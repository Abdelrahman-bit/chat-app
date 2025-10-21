import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../store/slices/message";

const ChatHeader = () => {
	const selectedUser = useSelector((state) => state.messages.selectedUser) || {};
	const onlineUsers = useSelector((state) => state.userAuth.onlineUsers) || [];
	const dispatch = useDispatch();

	const isOnline = selectedUser._id && onlineUsers.includes(selectedUser._id);

	return (
		<div className='p-3 border-b card-surface'>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex items-center gap-3'>
					<div className='w-12 h-12 rounded-full overflow-hidden border border-white/6'>
						<img
							src={selectedUser.avatarUrl || "/avatar.png"}
							alt={selectedUser.fullName}
							className='w-full h-full object-cover'
						/>
					</div>
					<div>
						<h3 className='font-semibold text-sm'>{selectedUser.fullName}</h3>
						<div className='text-xs text-zinc-400 mt-0.5'>
							<span
								className={`inline-block w-2 h-2 rounded-full mr-2 ${
									isOnline ? "bg-emerald-400" : "bg-zinc-600"
								}`}
							/>
							{isOnline ? "Online" : "Offline"}
						</div>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<button
						aria-label='Close chat'
						onClick={() => dispatch(setSelectedUser(null))}
						className='p-2 rounded-md hover:bg-white/4 transition'
					>
						<X className='w-4 h-4' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatHeader;
