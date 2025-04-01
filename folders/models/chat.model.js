const mongoose = require("mongoose");
const { ALLOWEDTYPES } = require("../utility/enum");

const messageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        type: { type: String, enum: [ALLOWEDTYPES], default: "text" },
        timestamp: { type: Date, default: Date.now },
        delivered: { type: Boolean, default: false },
        read: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    });

const chatSchema = new mongoose.Schema(
    {
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        lastMessage: { type: String },
        lastMessageTime: { type: Date },
        messages: [messageSchema]
    });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
