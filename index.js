const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

const {
	registerValidation,
	loginValidation,
	postCreateValidation,
} = require("./validations/index.js");
const { UserController, PostController } = require("./controllers/index.js");
const { handleValidationErrors, checkAuth } = require("./middlewares/index.js");

mongoose
	.connect(
		"mongodb+srv://unnastasya:Anast31P12@cluster0.wiguxq5.mongodb.net/users?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("Connect DB");
	})
	.catch(() => {
		console.log("Error DB");
	});

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.urlencoded());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
	"/auth/register",
	registerValidation,
	handleValidationErrors,
	UserController.register
);
app.post(
	"/auth/login",
	loginValidation,
	handleValidationErrors,
	UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.post("/uploadAvatar", upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/comments/:id", PostController.getOnePostComments);
app.get("/comments", PostController.getLastComments);
app.post("/comments/:id", checkAuth, PostController.postComment);
app.delete(
	"/post/:id/comments/:commentId",
	checkAuth,
	PostController.deleteComment
);

app.get("/posts", PostController.getAll);
app.get("/posts/lastTags", PostController.getLastTags);
app.get("/posts/tags", PostController.getAllTags);
app.get("/posts/:id", PostController.getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.createPost
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK");
});
