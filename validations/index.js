const { registerValidation, loginValidation } = require("./auth.js");
const { postCreateValidation } = require("./post.js");

module.exports = {
	registerValidation,
	loginValidation,
	postCreateValidation,
};
