import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
	return (
		<div className='w-full flex flex-1 flex-col items-center justify-center p-8'>
			<div className='max-w-md text-center space-y-6'>
				<div className='flex justify-center gap-4 mb-2'>
					<div className='w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg'>
						<MessageSquare className='w-8 h-8 text-white' />
					</div>
				</div>

				<h2 className='text-2xl font-semibold'>Welcome to Chatty</h2>
				<p className='text-zinc-400'>Select a conversation from the sidebar to start chatting</p>
			</div>
		</div>
	);
};

export default NoChatSelected;
