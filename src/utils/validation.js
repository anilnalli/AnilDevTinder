const validator = require("validator");
const bcrypt = require("bcrypt");
const fieldValidations = (req) => {
  {
    const { firstName, lastName, email, password } = req;
    if (!firstName || !lastName) {
      throw new Error("firstname and lastname are required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Invalid Password");
    }
  }
};
const isValidateProfileData = (req) => {
  const profileNewData = req.body;
  const allowedFieldToUpdate = ["firstName", "lastName", "age", "gender"];
  const isProfileValidToUpdate = Object.keys(profileNewData).every((field) =>
    allowedFieldToUpdate.includes(field)
  );
  return isProfileValidToUpdate;
};

module.exports = {
  fieldValidations,
  isValidateProfileData,
};
