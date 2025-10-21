import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useSelector } from "react-redux";

const HomePage = () => {
	const selectedUser = useSelector((state) => state.messages.selectedUser);

	return (
		<div className='min-h-screen pt-16'>
			<div className='flex items-center justify-center px-4 py-6'>
				<div className='w-full max-w-6xl h-[calc(100vh-5rem)] rounded-2xl overflow-hidden shadow-2xl card-surface'>
					<div className='flex h-full'>
						<Sidebar />

						{!selectedUser ? <NoChatSelected /> : <ChatContainer />}
					</div>
				</div>
			</div>
		</div>
	);
};
export default HomePage;
