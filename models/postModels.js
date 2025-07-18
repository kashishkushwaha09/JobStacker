const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: String,
    imageUrl: String,
    likes: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    comments: {
        type: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                text: String,
                createdAt: { type: Date, default: Date.now }
            }
        ], default: []
    }
}, { timestamps: true });
module.exports = mongoose.model("Post", postSchema);