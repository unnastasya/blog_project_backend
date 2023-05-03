const PostModel = require("../models/Post.js");

const handleError = (res, error) => {
	res.status(500).send(error.message);
};

const getAll = async (req, res) => {
	PostModel.find()
		.sort({ createdAt: -1 })
		.populate("user")
		.exec()
		.then((posts) => res.status(200).json(posts))
		.catch((error) => handleError(res, error));
};

const getOne = async (req, res) => {
	const postId = req.params.id;
	PostModel.findOneAndUpdate(
		{
			_id: postId,
		},
		{
			$inc: { viewsCount: 1 },
		},
		{
			returnDocument: "after",
		}
	)
		.populate("user")
		.then((post) => res.status(200).json(post))
		.catch((error) => handleError(res, error));
};

const createPost = async (req, res) => {
	const { title, text, tags, imageUrl, user } = req.body;
	const post = new PostModel({ title, text, tags, imageUrl, user });
	post.save()
		.then((post) => res.status(200).json(post))
		.catch((error) => handleError(res, error));
};

const remove = async (req, res) => {
	PostModel.findByIdAndDelete(req.params.id)
		.then(() => res.status(200).json(req.params.id))
		.catch((error) => handleError(res, error));
};

const update = async (req, res) => {
	const { title, user, text, imageUrl, tags } = req.body;
	const postId = req.params.id;
	PostModel.findByIdAndUpdate(postId, { title, user, text, imageUrl, tags })
		.then(() =>
			res.status(200).json({
				success: true,
			})
		)
		.catch(() =>
			res.status(500).json({
				message: "Не удалось обновить статью",
			})
		);
};

const getAllTags = async (req, res) => {
	PostModel.find()
		.sort({ createdAt: -1 })
		.exec()
		.then((data) => {
			const tags = data.map((obj) => obj.tags).flat();
			const newSet = new Set(tags);
			const ttags = Array.from(newSet);
			res.status(200).json(ttags);
		})
		.catch(() => {
			res.status(500).json({
				message: "Не удалось",
			});
		});
};

const getLastComments = async (req, res) => {
	PostModel.find()
		.sort({ createdAt: -1 })
		.limit(5)
		.exec()
		.then((data) => {
			const comments = data
				.map((post) => post.comments)
				.flat()
				.splice(0, 5);

			res.status(200).json(comments);
		})
		.catch(() => {
			res.status(500).json({
				message: "Не удалось",
			});
		});
};

const getOnePostComments = async (req, res) => {
	const postId = req.params.id;
	PostModel.find({ _id: postId })
		.then((post) => {
			res.status(200).json(post[0].comments);
		})
		.catch(() => {
			res.status(500).json({
				message: "Не удалось",
			});
		});
};

const postComment = async (req, res) => {
	const postId = req.params.id;
	const { fullName, avatarUrl, id } = req.body.user;
	const post = await PostModel.find({ _id: postId });
	PostModel.updateOne(
		{ _id: postId },
		{
			comments: [
				...post[0].comments,
				{
					user: {
						fullName,
						avatarUrl,
						id,
					},
					text: req.body.text,
					postId: postId,
					id: req.body.id,
				},
			],
		}
	)
		.then(() =>
			res.json({
				succes: true,
			})
		)
		.catch(() => {
			res.status(500).json({
				message: "Не удалось",
			});
		});
};

const deleteComment = async (req, res) => {
	const postId = req.params.id;
	const post = await PostModel.find({ _id: postId });
	let comments = post[0].comments;

	const commentId = req.params.commentId;

	for (let i = 0; i < comments.length; i++) {
		if (comments[i].id === commentId) {
			comments.splice(i, 1);
			break;
		}
	}

	PostModel.updateOne(
		{ _id: postId },
		{
			comments: comments,
		}
	)
		.then(() =>
			res.status(200).json({
				succes: true,
			})
		)
		.catch(() => {
			res.status(500).json({
				message: "Не удалось",
			});
		});
};

const getLastTags = async (req, res) => {
	PostModel.find()
		.sort({ createdAt: -1 })
		.limit(5)
		.exec()
		.then((data) => {
			const tags = data
				.map((obj) => obj.tags)
				.flat()
				.splice(0, 5);

			const newSet = new Set(tags);
			const ttags = Array.from(newSet);
			res.status(200).json(ttags);
		})
		.catch(() => {
			res.status(500).json({
				message: "Не удалось",
			});
		});
};

module.exports = {
	createPost,
	getAll,
	getOne,
	remove,
	update,
	getLastTags,
	getAllTags,
	getOnePostComments,
	postComment,
	getLastComments,
	deleteComment,
};
