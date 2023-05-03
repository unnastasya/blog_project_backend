const validator = require("express-validator");
const body = validator.body;

const registerValidation = [
	body("email", "Неверно введена почта").isEmail(),
	body("password", "Пароль должен быть минимум 5 символов").isLength({
		min: 5,
	}),
	body("fullName", "Укажите имя").isLength({ min: 3 }),
	body("avatarUrl", "Неверная ссылка аватара").optional().isString(),
];

const loginValidation = [
	body("email", "Неверно введена почта").isEmail(),
	body("password", "Пароль должен быть минимум 5 символов").isLength({
		min: 5,
	}),
];

module.exports = { registerValidation, loginValidation };
