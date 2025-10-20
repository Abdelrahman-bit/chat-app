import { UserSearch, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../store/slices/message";


const ChatHeader = () => {
	// const { setSelectedUser } = useChatStore();
    const selectedUser = useSelector((state)=> state.messages.selectedUser);
    const onlineUsers = useSelector((state)=> state.userAuth.onlineUsers)
    const dispatch = useDispatch()
	return (
		<div className='p-2.5 border-b border-base-300'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					{/* Avatar */}
					<div className='avatar'>
						<div className='size-10 rounded-full relative'>
							<img src={selectedUser.avatarUrl || "/avatar.png"} alt={selectedUser.fullName} />
						</div>
					</div>

					{/* User info */}
					<div>
						<h3 className='font-medium'>{selectedUser.fullName}</h3>
						<p className='text-sm text-base-content/70'>
							{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
						</p>
					</div>
				</div>

				{/* Close button */}
				<button onClick={() => dispatch(setSelectedUser(null))}>
					<X />
				</button>
			</div>
		</div>
	);
};
export default ChatHeader;
