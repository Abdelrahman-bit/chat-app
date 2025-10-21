import { Camera, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/auth";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { isUpdatingProfile, authUser } = useSelector((state) => state.userAuth);
	const [selectedImg, setSelectedImg] = useState(null);
	const [fullName, setFullName] = useState("");
	const dispatch = useDispatch();

	console.log(authUser);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.readAsDataURL(file);

		reader.onload = async () => {
			const base64Image = reader.result;
			setSelectedImg(base64Image);
			try {
				await dispatch(updateProfile({ profilePic: base64Image })).unwrap();
				toast.success("Profile image updated");
			} catch (err) {
				console.error("Failed to update profile", err);
			}
		};
	};

	useEffect(() => {
		if (authUser?.fullName) setFullName(authUser.fullName);
	}, [authUser]);

	const handleSaveName = async () => {
		if (!fullName.trim()) return toast.error("Full name cannot be empty");
		try {
			await dispatch(updateProfile({ fullName: fullName.trim() })).unwrap();
			toast.success("Name updated");
		} catch (err) {
			console.error("Failed to update name", err);
			toast.error("Failed to update name");
		}
	};
	return (
		<div className='min-h-screen pt-16'>
			<div className='max-w-3xl mx-auto p-4 py-10'>
				<div className='rounded-2xl p-6 space-y-8 card-surface'>
					<div className='text-center'>
						<h1 className='text-2xl font-semibold '>Profile</h1>
						<p className='mt-2 text-zinc-400'>Manage your profile details and account settings</p>
					</div>

					<div className='flex flex-col items-center gap-4'>
						<div className='relative'>
							<div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white/6 shadow-md'>
								<img
									src={selectedImg || authUser.avatarUrl || "/avatar.png"}
									alt='Profile'
									className='w-full h-full object-cover'
								/>
							</div>

							<label
								htmlFor='avatar-upload'
								className={`absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full cursor-pointer shadow-lg text-white ${
									isUpdatingProfile ? "opacity-60 pointer-events-none" : ""
								}`}
							>
								<Camera className='w-4 h-4' />
								<input
									type='file'
									id='avatar-upload'
									className='hidden'
									accept='image/*'
									onChange={handleImageUpload}
									disabled={isUpdatingProfile}
								/>
							</label>
						</div>
						<p className='text-sm text-zinc-400'>{isUpdatingProfile ? "Uploading..." : "Upload a profile photo"}</p>
					</div>

					<div className='space-y-6'>
						<div className='space-y-1.5'>
							<div className='text-sm text-zinc-400 flex items-center gap-2'>
								<User className='w-4 h-4' />
								Full Name
							</div>
							<div className='flex gap-2'>
								<input
									type='text'
									className='flex-1 px-4 py-2.5 bg-transparent rounded-lg border border-white/6 text-zinc-100'
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
								/>
								<button
									className='px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white'
									onClick={handleSaveName}
									disabled={isUpdatingProfile}
								>
									Save
								</button>
							</div>
						</div>

						<div className='space-y-1.5'>
							<div className='text-sm text-zinc-400 flex items-center gap-2'>
								<Mail className='w-4 h-4' />
								Email Address
							</div>
							<p className='px-4 py-2.5 bg-transparent rounded-lg border border-white/6 text-zinc-100'>
								{authUser?.email}
							</p>
						</div>
					</div>

					<div className='mt-6 rounded-xl p-6 bg-white/3'>
						<h2 className='text-lg font-medium mb-4'>Account Information</h2>
						<div className='space-y-3 text-sm text-zinc-200'>
							<div className='flex items-center justify-between py-2 border-b border-white/6'>
								<span>Member Since</span>
								<span>{authUser?.createdAt?.split("T")[0] || "-"}</span>
							</div>
							<div className='flex items-center justify-between py-2'>
								<span>Account Status</span>
								<span className='text-emerald-400'>Active</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
