const { CustomError } = require("../errors/customError");
const { validateSave } = require("../helpers/validation");
const { Budget } = require("../models");

const save = async (user_id, date, category_id, value) => {
  if (date) {
    date = new Date(date + " 12:00:00");
  }

  validateSave(date, category_id, value);
  const budget = await Budget.findOne({ where: { user_id, date, category_id } });

  if (budget) {
    budget.value = value;
    await budget.save();
  } else {
    await Budget.create({ date, category_id, user_id, value });
  }
};

const list = async (user_id, date) => {
  if (!date) {
    throw new CustomError("date_required", 400);
  }

  date = new Date(date + " 12:00:00");
  const all_budget = await Budget.findAll({
    where: {
      user_id,
      date,
    },
  });

  const output = {};
  for (var i in all_budget) {
    output[all_budget[i].category_id] = all_budget[i].value;
  }

  return output;
};

const remove = async (user_id, date, category_id) => {
  if (!date) {
    throw new CustomError("date_required", 400);
  }

  date = new Date(date + " 12:00:00");

  const budget = await Budget.findOne({ where: { user_id, date, category_id } });
  if (!budget) {
    throw new CustomError("budget_not_found", 400);
  }
  await budget.destroy();
};

const removeFromUser = async (user_id) => {
  await Budget.destroy({
    where: {
      user_id,
    },
  });
};

module.exports = {
  save,
  list,
  remove,
  removeFromUser,
};
