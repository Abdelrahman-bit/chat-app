import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User, Search } from "lucide-react";
import { logout } from "../store/slices/auth";
import { useState } from "react";
import { setSearchQuery } from "../store/slices/message";

const NavBar = () => {
	const dispatch = useDispatch();
	const authUser = useSelector((state) => state.userAuth.authUser);
	const [search, setSearch] = useState("");

	const handleSearchChange = (value) => {
		setSearch(value);
		dispatch(setSearchQuery(value));
	};

	return (
		<header className='fixed w-full top-0 z-40'>
			<div className='h-16 flex items-center justify-center px-4'>
				<div className='w-full max-w-6xl flex items-center gap-4'>
					<div className='flex items-center gap-3'>
						<Link to='/' className='flex items-center gap-2 hover:opacity-90 transition'>
							<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg'>
								<MessageSquare className='w-5 h-5 text-white' />
							</div>
							<h1 className='text-lg font-semibold tracking-wide hidden sm:block'>Chatty</h1>
						</Link>
					</div>

					<div className='flex-1 hidden md:flex items-center justify-center'>
						<div className='w-2/3 flex items-center gap-2 bg-white/6 rounded-lg py-2 px-3 card-surface'>
							<Search className='w-4 h-4 text-zinc-300' />
							<input
								aria-label='Search'
								placeholder='Search people'
								value={search}
								onChange={(e) => handleSearchChange(e.target.value)}
								className='bg-transparent outline-none text-sm w-full text-zinc-200'
							/>
						</div>
					</div>

					<div className='ml-auto flex items-center gap-3'>
						<Link to={"/settings"} className='p-2 rounded-md hover:bg-white/4 transition'>
							<Settings className='w-5 h-5' />
						</Link>

						{authUser ? (
							<>
								<Link
									to={"/profile"}
									className='flex items-center gap-2 p-1 rounded-md hover:bg-white/4 transition'
								>
									<div className='w-8 h-8 rounded-full overflow-hidden border border-white/10'>
										<img
											src={authUser.avatarUrl || "/avatar.png"}
											alt={authUser.fullName}
											className='w-full h-full object-cover'
										/>
									</div>
									<span className='hidden sm:block text-sm'>{authUser.fullName}</span>
								</Link>
								<button
									onClick={() => dispatch(logout())}
									className='p-2 rounded-md hover:bg-white/6 transition'
									aria-label='Logout'
								>
									<LogOut className='w-5 h-5' />
								</button>
							</>
						) : (
							<Link to={"/login"} className='btn btn-sm'>
								Login
							</Link>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default NavBar;
