import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../store/slices/auth";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function HomePage() {
	// store reducer is mounted under `userAuth` (see store/index.js)
	

	return (
		<div>
			<div>
				<h1>Home page</h1>
			</div>
		</div>
	);
}

export default HomePage;
