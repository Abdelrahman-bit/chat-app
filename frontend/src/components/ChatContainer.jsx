import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
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
				{messages.map((message) => {
					const mine = message.senderId === authUser._id;
					const avatarSrc = mine
						? authUser.avatarUrl || "/avatar.png"
						: selectedUser?.avatarUrl || selectedUser?.profilePic || "/avatar.png";
					return (
						<div key={message._id} className={`flex items-end gap-3 ${mine ? "justify-end" : "justify-start"}`}>
							{!mine && (
								<div className='w-10 h-10 rounded-full overflow-hidden border border-white/6'>
									<img src={avatarSrc} alt='profile' className='w-full h-full object-cover' />
								</div>
							)}

							<div className={`max-w-[70%] ${mine ? "text-right" : "text-left"}`}>
								<div
									className={`inline-block p-3 rounded-2xl shadow-sm ${
										mine ? "bg-indigo-600 text-white" : "bg-white/6 text-zinc-100"
									}`}
								>
									{message.image && (
										<img
											src={message.image}
											alt='Attachment'
											className='w-full sm:max-w-[300px] rounded-lg mb-2 object-cover'
										/>
									)}
									{message.text && <p className='whitespace-pre-wrap'>{message.text}</p>}
								</div>
								<div className='text-[11px] text-zinc-400 mt-1'>{formatMessageTime(message.createdAt)}</div>
							</div>

							{mine && (
								<div className='w-10 h-10 rounded-full overflow-hidden border border-white/6'>
									<img src={avatarSrc} alt='profile' className='w-full h-full object-cover' />
								</div>
							)}
						</div>
					);
				})}

				{/* scroll sentinel placed at the end so scrolling to it doesn't push the input */}
				<div ref={messageEndRef} />
			</div>

			<MessageInput />
		</div>
	);
};
export default ChatContainer;
