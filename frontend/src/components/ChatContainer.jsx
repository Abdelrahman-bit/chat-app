import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../store/slices/message";
import { useSocket } from "../context/SocketProvider";
import { messageReceived } from "../store/slices/message";

const ChatContainer = () => {
	// const {subscribeToMessages, unsubscribeFromMessages } =

	const { messages, isMessagesLoading, selectedUser } = useSelector((state) => state.messages || {});
	const authUser = useSelector((state) => state.userAuth?.authUser);
	const dispatch = useDispatch();
	const messageEndRef = useRef(null);
	const { socket } = useSocket() || {};

	useEffect(() => {
		if (!selectedUser?._id) return;
		dispatch(getMessages(selectedUser._id));

		// subscribe to incoming messages via socket
		const onNewMessage = (msg) => {
			// payload assumed to be the message object
			dispatch(messageReceived(msg));
		};

		if (socket && typeof socket.on === "function") {
			socket.on("newMessage", onNewMessage);
		}

		return () => {
			if (socket && typeof socket.off === "function") {
				socket.off("newMessage", onNewMessage);
			}
		};
	}, [selectedUser?._id, socket, dispatch]);

	useEffect(() => {
		if (messageEndRef.current && messages) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// ensure scrolling when messages change (use length to avoid object identity issues)
	useEffect(() => {
		if (messageEndRef.current && Array.isArray(messages)) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages?.length]);

	// debug: log images in messages
	useEffect(() => {
		if (Array.isArray(messages)) {
			console.log(
				"Messages images:",
				messages.map((m) => ({ id: m._id, image: m.image }))
			);
		}
	}, [messages]);

	if (isMessagesLoading) {
		return (
			<div className='flex-1 flex flex-col overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		);
	}

	return (
		<div className='flex-1 flex flex-col overflow-hidden min-h-0'>
			<ChatHeader />

			<div className='flex-1 overflow-y-auto p-4 space-y-4'>
				{messages.map((message) => (
					<div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
						<div className=' chat-image avatar'>
							<div className='size-10 rounded-full border'>
								<img
									src={
										message.senderId === authUser._id
											? authUser.avatarUrl || "/avatar.png"
											: selectedUser?.avatarUrl || selectedUser?.profilePic || "/avatar.png"
									}
									alt='profile pic'
								/>
							</div>
						</div>
						<div className='chat-header mb-1'>
							<time className='text-xs opacity-50 ml-1'>{formatMessageTime(message.createdAt)}</time>
						</div>
						<div className='chat-bubble flex flex-col'>
							{message.image && (
								<img src={message.image} alt='Attachment' className='sm:max-w-[200px] rounded-md mb-2' />
							)}
							{message.text && <p>{message.text}</p>}
						</div>
					</div>
				))}

				{/* scroll sentinel placed at the end so scrolling to it doesn't push the input */}
				<div ref={messageEndRef} />
			</div>

			<MessageInput />
		</div>
	);
};
export default ChatContainer;
