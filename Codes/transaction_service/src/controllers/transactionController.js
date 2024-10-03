const i18n = require("i18n");
const {
  create,
  list,
  update,
  remove,
  removeFromUser,
  getBalance,
} = require("../services/transactionService.js");
const errorHandler = require("../middlewares/errorHandler");

const actionCreate = async (req, res) => {
  try {
    const { type, date, name, category_id, value, status } = req.body;

    await create(req.user.id, type, date, name, category_id, value, status);

    var month = date.split("-");
    month = `${month[0]}-${month[1]}`;

    res.status(200).json({
      code: 200,
      message: i18n.__("create_success"),
      result: "success",
      transaction_list: await list(req.user.id, [month]),
      balance: await getBalance(req.user.id),
    });
  } catch (err) {
    errorHandler(err, req, res, null, "create_error");
  }
};

const actionList = async (req, res) => {
  try {
    const transaction_list = await list(req.user.id, [req.params.date]);

    res.status(200).json({
      code: 200,
      result: "success",
      transaction_list,
      balance: await getBalance(req.user.id),
    });
  } catch (err) {
    errorHandler(err, req, res, null, "list_error");
  }
};

const actionUpdate = async (req, res) => {
  try {
    const { type, date, name, category_id, value, status } = req.body;

    const dateList = await update(
      req.user.id,
      req.params.id,
      type,
      date,
      name,
      category_id,
      value,
      status
    );

    res.status(200).json({
      code: 200,
      message: i18n.__("update_success"),
      result: "success",
      transaction_list: await list(req.user.id, dateList),
      balance: await getBalance(req.user.id),
    });
  } catch (err) {
    errorHandler(err, req, res, null, "update_error");
  }
};

const actionDelete = async (req, res) => {
  try {
    await remove(req.user.id, req.params.id);

    res.status(200).json({
      code: 200,
      message: i18n.__("delete_success"),
      result: "success",
      transaction_list: await list(req.user.id, [req.params.date]),
      balance: await getBalance(req.user.id),
    });
  } catch (err) {
    errorHandler(err, req, res, null, "delete_error");
  }
};

const actionDeleteAllFromUser = async (req, res) => {
  try {
    await removeFromUser(req.user.id);

    res.status(200).json({
      code: 200,
      message: i18n.__("delete_all_success"),
      result: "success",
    });
  } catch (err) {
    errorHandler(err, req, res, null, "delete_all_error");
  }
};

module.exports = {
  actionCreate,
  actionList,
  actionUpdate,
  actionDelete,
  actionDeleteAllFromUser,
};
