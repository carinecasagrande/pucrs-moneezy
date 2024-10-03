const validator = require("validator");
const { CustomError } = require("../errors/customError");

const validateCreate = (type, date, name, category_id, value, status) => {
  if (!type || ["I", "O"].indexOf(type) === -1) {
    throw new CustomError("type_required", 400);
  }

  if (!date || !validator.isDate(date)) {
    throw new CustomError("date_required", 400);
  }

  if (!name || validator.isEmpty(name.trim())) {
    throw new CustomError("name_required", 400);
  }

  if (category_id && parseInt(category_id) <= 0) {
    throw new CustomError("category_required", 400);
  }

  if (!value || parseFloat(value) <= 0) {
    throw new CustomError("value_required", 400);
  }

  if (!status || [0, 1].indexOf(parseInt(status)) === -1) {
    throw new CustomError("status_required", 400);
  }
};

const validateUpdate = (updateData) => {
  if (updateData.type && ["I", "O"].indexOf(updateData.type) === -1) {
    throw new CustomError("type_required", 400);
  }

  if (updateData.date && !validator.isDate(updateData.date)) {
    throw new CustomError("date_required", 400);
  }

  if (updateData.name && validator.isEmpty(updateData.name.trim())) {
    throw new CustomError("name_required", 400);
  }

  if (updateData.category_id && parseInt(updateData.category_id) <= 0) {
    throw new CustomError("category_required", 400);
  }

  if (updateData.value && parseFloat(updateData.value) <= 0) {
    throw new CustomError("value_required", 400);
  }

  if (updateData.status && [0, 1].indexOf(parseInt(updateData.status)) === -1) {
    throw new CustomError("status_required", 400);
  }
};

module.exports = {
  validateCreate,
  validateUpdate,
};
