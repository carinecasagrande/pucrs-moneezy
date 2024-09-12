const validator = require("validator");
const { CustomError } = require("../errors/customError");
const { Category } = require("../models");

const validateCreate = (type, name) => {
  if (!type || ["I", "O"].indexOf(type) === -1) {
    throw new CustomError("type_required", 400);
  }

  if (!name || validator.isEmpty(name.trim())) {
    throw new CustomError("name_required", 400);
  }
};

const checkIfNameAlreadyInUseByUser = async (user_id, name) => {
  const existingCategory = await Category.findOne({
    where: {
      user_id,
      name,
    },
  });

  if (existingCategory) {
    throw new CustomError("name_already_in_use_by_user", 400);
  }
};

const validateUpdate = (updateData) => {
  if (updateData.name && validator.isEmpty(updateData.name.trim())) {
    throw new CustomError("name_required", 400);
  }

  if (updateData.type && ["I", "O"].indexOf(updateData.type) === -1) {
    throw new CustomError("type_required", 400);
  }
};

module.exports = {
  validateCreate,
  checkIfNameAlreadyInUseByUser,
  validateUpdate,
};
