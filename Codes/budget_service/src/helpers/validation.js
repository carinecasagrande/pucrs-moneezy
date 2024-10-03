const validator = require("validator");
const { CustomError } = require("../errors/customError");

const validateSave = (date, category_id, value) => {
  if (!date || !validator.isDate(date)) {
    throw new CustomError("date_required", 400);
  }

  if (!category_id || parseInt(category_id) <= 0) {
    throw new CustomError("category_required", 400);
  }

  if (!value || parseFloat(value) < 0) {
    throw new CustomError("value_required", 400);
  }
};

module.exports = {
  validateSave,
};
