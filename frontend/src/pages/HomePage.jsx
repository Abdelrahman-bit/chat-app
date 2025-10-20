import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useSelector } from "react-redux";

const HomePage = () => {
	const selectedUser = useSelector((state) => state.messages.selectedUser);

	return (
		<div className='min-h-screen bg-base-200 pt-16'>
			<div className='flex items-center justify-center px-4 py-6'>
				<div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)]'>
					<div className='flex h-full rounded-lg overflow-hidden'>
						<Sidebar />

						{!selectedUser ? <NoChatSelected /> : <ChatContainer />}
					</div>
				</div>
			</div>
		</div>
	);
};
export default HomePage;
