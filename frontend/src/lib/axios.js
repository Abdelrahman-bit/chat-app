import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL
	? import.meta.env.VITE_API_URL
	: import.meta.env.MODE === "development"
	? "http://localhost:5000/api"
	: "/api";

const instance = axios.create({
	baseURL: apiBase,
	withCredentials: true,
});

export default instance;
