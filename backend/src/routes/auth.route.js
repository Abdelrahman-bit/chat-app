import express from 'express'
import { checkAuth, logIn, logOut, signUp, updateProfile } from "../controls/auth.control.js";
import asyncHandler from '../utils/catchAsync.js';
import { protectedRoute } from '../middleware/authHandler.js';
import multer from "multer";
const upload = multer({ dest: "temp/" });

const router = express.Router();

router.post('/signup', asyncHandler(signUp));

router.post('/login', asyncHandler(logIn));

router.post('/logout', asyncHandler(logOut));

router.post('/update-profile', asyncHandler(protectedRoute), upload.single("avatar"), asyncHandler(updateProfile));

router.get('/check', asyncHandler(protectedRoute), asyncHandler(checkAuth));

export default router;