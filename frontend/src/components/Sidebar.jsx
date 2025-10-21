import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { Users } from "lucide-react";
import { getUsers, setSelectedUser } from "../store/slices/message";

const Sidebar = () => {
	const { users = [], isUsersLoading, selectedUser } = useSelector((state) => state.messages || {});
	const onlineUsers = useSelector((state) =>
		state.userAuth && Array.isArray(state.userAuth.onlineUsers) ? state.userAuth.onlineUsers : []
	);
	const searchQuery = useSelector((state) => state.messages?.searchQuery || "");
	const authUserId = useSelector((state) => state.userAuth?.authUser?._id);
	// compute visible online count: if the auth user is in the list, subtract one (don't count yourself)
	const onlineCount = Math.max(0, authUserId && onlineUsers.includes(authUserId) ? onlineUsers.length - 1 : onlineUsers.length);
	const [showOnlineOnly, setShowOnlineOnly] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

	const safeUsers = Array.isArray(users) ? users : [];
	// apply online filter first, then search filter by fullName
	let filteredUsers = showOnlineOnly ? safeUsers.filter((user) => onlineUsers.includes(user._id)) : safeUsers;
	if (searchQuery && searchQuery.trim()) {
		const q = searchQuery.trim().toLowerCase();
		filteredUsers = filteredUsers.filter((u) => (u.fullName || "").toLowerCase().includes(q));
	}

	if (isUsersLoading) return <SidebarSkeleton />;

	return (
		<aside className='h-full w-20 sm:w-24 lg:w-72 border-r border-white/6 flex flex-col transition-all duration-200 card-surface p-3'>
			{/* mobile header: show small title and online count */}
			<div className='mb-3 w-full flex items-center justify-between lg:hidden'>
				<div className='flex items-center gap-2'>
					<Users className='w-5 h-5 text-zinc-200' />
					{/* <span className='font-medium text-zinc-100'>Contacts</span> */}
				</div>
				<div className='text-xs text-zinc-400'>{onlineCount} online</div>
			</div>

			<div className='mb-3 hidden lg:block'>
				<div className='flex items-center gap-2'>
					<Users className='w-5 h-5 text-zinc-200' />
					<span className='font-medium text-zinc-100'>Contacts</span>
				</div>

				<div className='mt-3 flex items-center gap-2'>
					<label className='cursor-pointer flex items-center gap-2'>
						<input
							type='checkbox'
							checked={showOnlineOnly}
							onChange={(e) => setShowOnlineOnly(e.target.checked)}
							className='checkbox checkbox-sm'
						/>
						<span className='text-sm text-zinc-300'>Show online only</span>
					</label>
					<span className='text-xs text-zinc-400'>({onlineCount} online)</span>
				</div>
			</div>

			<div className='overflow-y-auto w-full py-1 space-y-2'>
				{filteredUsers.map((user) => {
					const isSelected = selectedUser?._id === user._id;
					const isOnline = onlineUsers.includes(user._id);
					return (
						<button
							key={user._id}
							onClick={() => dispatch(setSelectedUser(user))}
							className={`w-full flex items-center gap-3 p-2 rounded-xl transition ${
								isSelected ? "ring-1 ring-indigo-500 bg-white/6" : "hover:bg-white/4"
							}`}
						>
							<div className='relative'>
								<img
									src={user.avatarUrl || "/avatar.png"}
									alt={user.fullName}
									className='w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border border-white/6'
								/>
								{isOnline && (
									<span className='absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-zinc-900' />
								)}
							</div>

							{/* show name only on md+ to keep compact mobile sidebar */}
							<div className='text-left min-w-0 hidden xl:block'>
								<div className='font-medium text-sm truncate text-zinc-100'>{user.fullName}</div>
								<div className='text-xs text-zinc-400'>{isOnline ? "Online" : "Offline"}</div>
							</div>
							{/* small-screen online label under avatar */}
							<div className='hidden lg:block text-xs text-zinc-400 ml-1'>{isOnline ? "Online" : ""}</div>
						</button>
					);
				})}

				{filteredUsers.length === 0 && (
					<div className='text-center text-zinc-500 py-4'>{showOnlineOnly ? "No online users" : "No contacts"}</div>
				)}
			</div>
		</aside>
	);
};
export default Sidebar;
