import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import createError from "../utils/createError.js";
import { io } from "../utils/soket.js";

export const getUsersForSlider = async (req, res) => {
	const userId = req.user._id;
	const users = await User.find({ _id: { $ne: userId } }).select("_id fullName avatarUrl");
	res.status(200).json({
		success: true,
		users,
	});
};

export const getUserById = async (req, res) => {
	const { id: userToChatId } = req.params;
	const myId = req.user._id;
	if (userToChatId === myId.toString()) throw createError("can not chat with yourself", 400);
	const messages = await Message.find({
		$or: [
			{ senderId: myId, receiverId: userToChatId },
			{ senderId: userToChatId, receiverId: myId },
		],
	});
	res.status(200).json({
		success: true,
		messages,
	});
};

export const sendMessage = async (req, res) => {
	const { text, image } = req.body;
	const { id: receiverId } = req.params;
	const senderId = req.user._id;
	if (!text && !image) throw createError("text or image must be provided!", 400);
	if (receiverId === senderId.toString()) throw createError("can not chat with yourself", 400);
	// If an image is provided, upload it to Cloudinary and use the secure URL.
	// For text-only messages, skip the upload step.
	let imgUrl = null;
	if (image) {
		const uploadResponse = await cloudinary.uploader.upload(image);
		imgUrl = uploadResponse.secure_url;
		console.log("Cloudinary upload returned URL:", imgUrl);
	}

	const newMessage = new Message({
		senderId,
		receiverId,
		text,
		...(imgUrl ? { image: imgUrl } : {}),
	});
	await newMessage.save();
	console.log("Saved message with image:", newMessage.image);
	// Emit the new message via socket.io for realtime updates
	try {
		if (io && typeof io.to === "function") {
			// send only to the receiver's room so the sender doesn't receive a duplicate
			io.to(receiverId.toString()).emit("newMessage", newMessage);
		}
	} catch (e) {
		console.error("Socket emit failed:", e);
	}
	res.status(201).json({
		success: true,
		message: newMessage,
	});
};
