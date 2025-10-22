import axios from "axios";

const apiBase = "https://chat-app-production-095c.up.railway.app/api"
const instance = axios.create({
	baseURL: apiBase,
	withCredentials: true,
});

export default instance;
