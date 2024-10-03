const { CustomError } = require("../errors/customError");
const { getLastDayOfMonth, parseDate } = require("../helpers/utils");
const { validateCreate, validateUpdate } = require("../helpers/validation");
const { Transaction, Balance } = require("../models");
const { Op } = require("sequelize");

const create = async (user_id, type, date, name, category_id, value, status) => {
  date = parseDate(date);

  if (category_id == "") {
    category_id = null;
  }

  validateCreate(type, date, name, category_id, value, status);

  await Transaction.create({
    user_id,
    type,
    date,
    name,
    category_id,
    value,
    status,
  });

  // Só atualiza o saldo se o status = 1
  if (status == 1) {
    if (type == "O") {
      value = value * -1; // Se está saindo, deixo o valor negativo
    }
    await updateBalance(user_id, value);
  }
};

const updateBalance = async (user_id, value) => {
  value = parseFloat(value);

  const balance = await Balance.findOne({
    where: {
      user_id,
    },
  });

  if (balance) {
    balance.value = (balance.value + value).toFixed(2);
    await balance.save();
  } else {
    await Balance.create({
      user_id,
      value: value.toFixed(2),
    });
  }
};

const list = async (user_id, monthList) => {
  var output = {};

  for (const month of monthList) {
    var splitMonth = month.split("-");
    const initialDate = new Date(`${splitMonth[0]}-${splitMonth[1]}-01`);
    const finalDate = new Date(getLastDayOfMonth(month));
    finalDate.setUTCHours(23, 59, 59, 999);

    const all_transation = await Transaction.findAll({
      where: {
        user_id,
        date: {
          [Op.between]: [initialDate, finalDate],
        },
      },
    });

    var list = {};
    if (all_transation) {
      for (var i in all_transation) {
        if (!list[all_transation[i].date]) {
          list[all_transation[i].date] = [];
        }

        list[all_transation[i].date].push(all_transation[i]);
      }
    }

    output[`${splitMonth[0]}-${splitMonth[1]}`] = list;
  }

  return output;
};

const update = async (
  user_id,
  transaction_id,
  type,
  date,
  name,
  category_id,
  value,
  status
) => {
  const transaction = await Transaction.findOne({
    where: { user_id, transaction_id },
  });
  if (!transaction) {
    throw new CustomError("transaction_not_found", 400);
  }

  var currentDate = transaction.date.split("-");
  currentDate = `${currentDate[0]}-${currentDate[1]}`;
  const output = [currentDate];

  var updateData = {};
  if (type && transaction.type !== type) {
    updateData.type = type;
  }

  if (date && transaction.date !== date) {
    const newDateJS = parseDate(date);
    if (isNaN(newDateJS.getTime())) {
      throw new CustomError("invalid_date_format", 400);
    }

    const oldDateJS = parseDate(transaction.date);
    const oldDateOnly = oldDateJS.toISOString().split("T")[0];
    const newDateOnly = newDateJS.toISOString().split("T")[0];
    if (oldDateOnly !== newDateOnly) {
      updateData.date = newDateJS;

      const datereturn = newDateOnly.split("-");
      output.push(`${datereturn[0]}-${datereturn[1]}`);
    }
  }

  if (name && transaction.name !== name) {
    updateData.name = name;
  }

  if (category_id === "") {
    category_id = null;
  }

  if (transaction.category_id !== category_id) {
    updateData.category_id = category_id;
  }

  if (value && transaction.value !== value) {
    updateData.value = value;
  }

  if (status && transaction.status !== status) {
    updateData.status = status;
  }

  if (Object.keys(updateData).length === 0) {
    throw new CustomError("update_no_changes", 400);
  }

  validateUpdate(updateData);

  // Antes de atualizar, ajusta o saldo removendo o lançamento anterior
  if (transaction.status == 1) {
    var saldo = transaction.value;
    if (transaction.type == "I") {
      saldo = saldo * -1;
    }
    await updateBalance(user_id, saldo);
  }

  Object.assign(transaction, updateData);

  await transaction.save();

  // Depois de atualizar, ajusta o saldo salvando o lançamento atual
  if (transaction.status == 1) {
    var saldo = transaction.value;
    if (transaction.type == "O") {
      saldo = saldo * -1;
    }
    await updateBalance(user_id, saldo);
  }

  return output;
};

const remove = async (user_id, transaction_id) => {
  const transaction = await Transaction.findOne({
    where: { user_id, transaction_id },
  });
  if (!transaction) {
    throw new CustomError("transaction_not_found", 400);
  }

  // só atualiza o valor se o valor removido estava concluído
  var canUpdateBalance = false;
  if (transaction.status == 1) {
    // Se é um registro de entrada, preciso deixar ele negativo
    // para que o valor seja removido do balanço
    var value = transaction.value;
    if (transaction.type == "I") {
      value = value * -1;
    }

    canUpdateBalance = true;
  }

  await transaction.destroy();

  if (canUpdateBalance) {
    await updateBalance(user_id, value);
  }
};

const removeFromUser = async (user_id) => {
  await Transaction.destroy({
    where: {
      user_id,
    },
  });

  await Balance.destroy({
    where: {
      user_id,
    },
  });
};

const getBalance = async (user_id) => {
  const balance = await Balance.findOne({
    where: {
      user_id,
    },
  });

  if (balance) {
    return balance.value;
  } else {
    return 0;
  }
};

module.exports = {
  create,
  list,
  update,
  remove,
  removeFromUser,
  getBalance,
};
