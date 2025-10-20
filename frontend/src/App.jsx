import { Navigate, Route, Routes } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/slices/auth";
import { Loader } from "lucide-react";
import NavBar from "./components/NavBar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SittingsPage";
import ProfilePage from "./pages/ProfilePage"
import { Toaster } from "react-hot-toast";


function App() {
  const auth = useSelector((state) => state.userAuth.authUser);
  const isChecking = useSelector((state) => state.userAuth.isCheckingAuth);
  const theme = useSelector((state)=> state.theme.theme)
  const dispatch = useDispatch();

  useEffect(() => {
		console.log("auth:", auth);
		dispatch(checkAuth());
		// run once on mount
  }, [dispatch]);

  if (isChecking && !auth) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader className='size-10 animate-spin' />
			</div>
		);
  }

  return (
		<div data-theme={theme}>
			<NavBar />
			<Routes>
				<Route path='/' element={auth ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/signup' element={!auth ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/login' element={!auth ? <LoginPage /> : <Navigate to={"/"} />} />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path='/profile' element={auth ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			<Toaster />
		</div>
  );
}

export default App
