const i18n = require("i18n");
const { save, list, remove, removeFromUser } = require("../services/budgetService");
const errorHandler = require("../middlewares/errorHandler");

const actionSave = async (req, res) => {
  try {
    const { date, category_id, value } = req.body;
    await save(req.user.id, date, category_id, value);

    res.status(200).json({
      code: 200,
      message: i18n.__("save_success"),
      result: "success",
      budget_list: await list(req.user.id, date),
    });
  } catch (err) {
    errorHandler(err, req, res, null, "save_error");
  }
};

const actionList = async (req, res) => {
  try {
    const { date } = req.params;
    const budget_list = await list(req.user.id, date);

    res.status(200).json({
      code: 200,
      result: "success",
      budget_list,
    });
  } catch (err) {
    errorHandler(err, req, res, null, "list_error");
  }
};

const actionDelete = async (req, res) => {
  try {
    const { date, category_id } = req.params;

    await remove(req.user.id, date, category_id);

    res.status(200).json({
      code: 200,
      message: i18n.__("delete_success"),
      result: "success",
      budget_list: await list(req.user.id, date),
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
  actionSave,
  actionList,
  actionDelete,
  actionDeleteAllFromUser,
};
