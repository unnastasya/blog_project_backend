const validator = require("express-validator");
const body = validator.body;

const postCreateValidation = [
	body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
	body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
	body("tags", "неверный формат тегов").optional().isArray(),
	body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];

module.exports = { postCreateValidation };
