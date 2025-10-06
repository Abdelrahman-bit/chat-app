import express from 'express'
import { logIn, logOut, signUp, updateProfile } from "../controls/auth.control.js";
import asyncHandler from '../utils/catchAsync.js';
import { protectedRoute } from '../middleware/authHandler.js';

const router = express.Router();

router.post('/signup', asyncHandler(signUp));

router.post('/login', asyncHandler(logIn));

router.post('/logout', asyncHandler(logOut));

router.post('/update-profile', asyncHandler(protectedRoute), asyncHandler(updateProfile))

export default router;