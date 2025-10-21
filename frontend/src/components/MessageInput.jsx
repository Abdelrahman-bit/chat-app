import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { sendMessage, optimisticMessageAdded } from "../store/slices/message";
import { useDispatch } from "react-redux";

const MessageInput = () => {
	const [text, setText] = useState("");
	const [imagePreview, setImagePreview] = useState(null);
	const fileInputRef = useRef(null);
	const dispatch = useDispatch();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!text.trim() && !imagePreview) return;

		// create a tempId for optimistic update
		const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		const tempMessage = {
			__tempId: tempId,
			senderId: null, // will be replaced by server response
			receiverId: null,
			text: text.trim(),
			image: imagePreview,
			createdAt: new Date().toISOString(),
		};

		// add optimistic message to UI
		dispatch(optimisticMessageAdded(tempMessage));

		// dispatch send with tempId for reconciliation
		try {
			dispatch(sendMessage({ tempId, text: text.trim(), image: imagePreview }));
			// Optimistically clear the input and preview immediately
			setText("");
			setImagePreview(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	return (
		<div className='p-4 w-full'>
			{imagePreview && (
				<div className='mb-3 flex items-center gap-2'>
					<div className='relative'>
						<img
							src={imagePreview}
							alt='Preview'
							className='w-24 h-24 object-cover rounded-xl border border-white/6 shadow-sm'
						/>
						<button
							onClick={removeImage}
							className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/6 text-white flex items-center justify-center'
							type='button'
							aria-label='Remove image'
						>
							<X className='w-3 h-3' />
						</button>
					</div>
				</div>
			)}

			<form onSubmit={handleSendMessage} className='flex items-center gap-3'>
				<div className='flex-1 flex items-center gap-2 bg-white/5 rounded-full px-3 py-2 card-surface'>
					<button
						type='button'
						onClick={() => fileInputRef.current?.click()}
						className='p-2 rounded-full hover:bg-white/6 transition'
						aria-label='Attach image'
					>
						<Image className='w-4 h-4 text-zinc-300' />
					</button>

					<input type='file' accept='image/*' className='hidden' ref={fileInputRef} onChange={handleImageChange} />

					<input
						type='text'
						className='bg-transparent outline-none text-sm w-full text-zinc-100'
						placeholder='Type a message...'
						value={text}
						onChange={(e) => setText(e.target.value)}
						aria-label='Message input'
					/>
				</div>

				<button
					type='submit'
					className='p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 transition shadow-md'
					disabled={!text.trim() && !imagePreview}
					aria-label='Send'
				>
					<Send className='w-5 h-5 text-white' />
				</button>
			</form>
		</div>
	);
};
export default MessageInput;
