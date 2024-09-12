const { CustomError } = require("../errors/customError");
const {
  validateCreate,
  validateUpdate,
  checkIfNameAlreadyInUseByUser,
} = require("../helpers/validation");
const { Category } = require("../models");
const validator = require("validator");

const create = async (user_id, type, name, color, icon) => {
  validateCreate(type, name);
  await checkIfNameAlreadyInUseByUser(user_id, name);

  if (!color || validator.isEmpty(color.trim())) {
    color = undefined;
  }

  if (!icon || validator.isEmpty(icon.trim())) {
    icon = undefined;
  }

  await Category.create({ user_id, type, name, color, icon });
};

const list = async (user_id) => {
  const all_categories = await Category.findAll({
    where: {
      user_id,
    },
  });

  const output = { I: [], O: [] };
  for (var i in all_categories) {
    output[all_categories[i].type].push(all_categories[i]);
  }

  return output;
};

const update = async (user_id, category_id, name, color, icon, type) => {
  const category = await Category.findOne({ where: { user_id, category_id } });
  if (!category) {
    throw new CustomError("category_not_found", 400);
  }

  if (!color || validator.isEmpty(color.trim())) {
    color = undefined;
  }

  if (!icon || validator.isEmpty(icon.trim())) {
    icon = undefined;
  }

  var updateData = {};
  if (name && category.name !== name) {
    updateData.name = name;
  }

  if (type && category.type !== type) {
    updateData.type = type;
  }

  if (color && category.color !== color) {
    updateData.color = color;
  }

  if (icon && category.icon !== icon) {
    updateData.icon = icon;
  }

  if (Object.keys(updateData).length === 0) {
    throw new CustomError("update_no_changes", 400);
  }

  validateUpdate(updateData);
  if (updateData.name) {
    await checkIfNameAlreadyInUseByUser(user_id, updateData.name);
  }

  Object.assign(category, updateData);

  await category.save();
};

const remove = async (user_id, category_id) => {
  const category = await Category.findOne({ where: { user_id, category_id } });
  if (!category) {
    throw new CustomError("category_not_found", 400);
  }
  await category.destroy();
};

const removeFromUser = async (user_id) => {
  await Category.destroy({
    where: {
      user_id,
    },
  });
};

module.exports = {
  create,
  list,
  update,
  remove,
  removeFromUser,
};
