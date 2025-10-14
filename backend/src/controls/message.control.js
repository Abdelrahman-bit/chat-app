import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import createError from "../utils/createError.js";

export const getUsersForSlider = async (req, res) => {
    const userId = req.user._id;    
    const users = await User.find({_id: { $ne: userId }}).select('_id fullName avatarUrl');
    res.status(200).json({
        success: true,
        users
    });
}

export const getUserById = async (req, res) => {
    const {id: userToChatId} = req.params;
    const myId = req.user._id;
    if(userToChatId === myId.toString()) throw createError('can not chat with yourself', 400);
    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId }
        ]
    });
    res.status(200).json({
        success: true,
        messages
    });
}

export const sendMessage = async (req, res) => {
    const {text, image} = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user._id;
    if(!text && !image) throw createError('text or image must be provided!', 400);
    if(receiverId === senderId.toString()) throw createError('can not chat with yourself', 400);
    
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imgUrl = uploadResponse.secure_url;

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imgUrl
    });
    await newMessage.save();
    
    // todo realtime with socket.io
    res.status(201).json({
        success: true,
        message: newMessage
    });
}