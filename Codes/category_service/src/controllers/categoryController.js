const i18n = require("i18n");
const { create, list, update, remove } = require("../services/categoryService");
const errorHandler = require("../middlewares/errorHandler");

const actionCreate = async (req, res) => {
  try {
    const { type, name, color, icon } = req.body;

    await create(req.user.id, type, name, color, icon);

    res.status(201).json({
      code: 201,
      message: i18n.__("create_success"),
      result: "success",
      category_list: await list(req.user.id),
    });
  } catch (err) {
    errorHandler(err, req, res, null, "create_error");
  }
};

const actionList = async (req, res) => {
  try {
    const category_list = await list(req.user.id);
    res.status(200).json({
      code: 200,
      message: i18n.__("list_success"),
      result: "success",
      category_list,
    });
  } catch (err) {
    errorHandler(err, req, res, null, "list_error");
  }
};

const actionUpdate = async (req, res) => {
  try {
    const category_id = req.params.id;
    const { name, color, icon } = req.body;

    await update(req.user.id, category_id, name, color, icon);

    res.status(200).json({
      code: 200,
      message: i18n.__("update_success"),
      result: "success",
      category_list: await list(req.user.id),
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
      category_list: await list(req.user.id),
    });
  } catch (err) {
    errorHandler(err, req, res, null, "delete_error");
  }
};

module.exports = {
  actionCreate,
  actionList,
  actionUpdate,
  actionDelete,
};
