import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import createError from '../utils/createError.js';
import { generateToken } from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js';

const salt = Number(process.env.SALT)

const signUp = async (req, res) => {
	const { fullName, email, password} = req.body;
	if(!fullName.trim() || !email.trim() || !password.trim()) throw createError('fullName, email and password are required', 400);
	if(password.length < 6) throw createError('password must be at least 6 character', 400)

	const existingUser = await User.findOne({ email });
	if (existingUser) throw createError('user already exists, try to login', 400);

	const hashedPassword = await bcrypt.hash(password, salt)
	const newUser = await User.create({fullName, email, password: hashedPassword});
	if(!newUser) throw createError();

	res.status(201).json({
		message: "user created successfully",
		data: { id: newUser._id, fullName: newUser.fullName, profilePic: newUser.avatarUrl },
	});
};

const logIn = async (req, res) => {
	const { email, password } = req.body;
	if(!email.trim() || !password.trim()) throw createError('email and password are required!', 400);

	const user = await User.findOne({email});
	if(!user) throw createError(`invalid credentials`, 400);

	const match = await bcrypt.compare(password, user.password);
	if(!match) throw createError('invalid credentials', 400);

	generateToken({ userId: user._id, email }, res); // sends the token in httpOnly cookie

	res.status(200).json({
		message: "login sucessfully",
		data: { id: user._id, fullName: user.fullName, profilePic: user.avatarUrl },
	});
};

const logOut = (req, res) => {
	res.cookie('jwt', '', {maxAge: 0});
	res.status(200).json({message: 'logged out sucessefully'})
};

const updateProfile = async (req, res) =>{
	const {fullName} = req.body;
	if(!req.file && !fullName) throw createError('new avatar or fullName must be provided!', 400);
	let updatedVal = {}
	if(req.file){
		const uploadRespons = await cloudinary.uploader.upload(req.file.path);
		updatedVal.avatarUrl = uploadRespons.secure_url;
	}
	if(fullName) updatedVal.fullName = fullName;

	const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updatedVal }, { new: true });
 
	res.status(200).json({
		message: "Profile updated successfully",
		data: { id: updatedUser._id, fullName: updatedUser.fullName, profilePic: updatedUser.avatarUrl },
	});
}

const checkAuth = (req, res) => {
	res.status(200).json(req.user)
}


export { signUp, logIn, logOut, updateProfile, checkAuth };