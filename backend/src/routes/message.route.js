import express from 'express';
import { getUsersForSlider, getUserById, sendMessage } from "../controls/message.control.js";

const router = express.Router();

router.get('/users', getUsersForSlider)
router.get("/:id", getUserById);
router.post("/users/:id", sendMessage);

export default router;