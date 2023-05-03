const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		commentCount: {
			type: Number,
			default: 0,
		},
		comments: {
			type: Array,
			default: [],
		},
		imageUrl: String,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
