# Deploying the Chat App frontend to Vercel

This project separates frontend and backend. The frontend is a Vite React app (in `frontend/`) and the backend is an Express + Socket.IO app (in `backend/`).

Two deployment approaches:

-   Fast & recommended: Deploy the frontend to Vercel and host the backend on a separate host (Render, Fly, Heroku, Railway, AWS, DigitalOcean, etc.). Configure the frontend to proxy API/socket calls to the backend via environment variables.
-   Alternative (not recommended for Socket.IO heavy apps): Try to convert the backend into Vercel Serverless Functions. Socket.IO does not map well to serverless functions for persistent connections, so a separate host is preferred.

What you'll do here

1. Build and deploy the `frontend/` on Vercel as a static site (Vite build).
2. Deploy the `backend/` on a server that supports long-lived WebSocket/Socket.IO connections.
3. Set environment variables on Vercel to point the frontend at the backend for API and socket connections.

Recommended environment variables (Vercel Project settings)

-   `VITE_API_URL` — base URL for API (for example `https://api.example.com`)
-   `VITE_SOCKET_URL` — WebSocket/Socket.IO server URL (for example `https://api.example.com`)

Notes on client code

-   The frontend reads the API base URL using `import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api'` in `frontend/src/lib/axios.js`.
    -   For production on Vercel we recommend using an explicit env var `VITE_API_URL` and switching the client to use it.
-   The socket client currently defaults to `http://localhost:5000` when you call `connectSocketClient()` without a URL. You should pass `import.meta.env.VITE_SOCKET_URL` when initializing the socket in production.

Minimal changes to make config-driven (optional but recommended)

1. Update `frontend/src/lib/axios.js` to use `import.meta.env.VITE_API_URL || '/api'` as baseURL.
2. Pass `import.meta.env.VITE_SOCKET_URL` into `connectSocketClient()` in your `SocketProvider`.

Vercel project setup (frontend)

1. Create a new project on Vercel and connect your GitHub/Git provider to this repository. Choose the `frontend/` folder as the project root.
2. For the build command use:

```bash
npm run build
```

3. For the output directory use:

```text
dist
```

4. Add the Vercel environment variables (in Project Settings -> Environment Variables):

-   `VITE_API_URL` = https://your-backend.example.com/api
-   `VITE_SOCKET_URL` = https://your-backend.example.com

5. Deploy. Vercel will run `npm run build` in the `frontend/` folder and publish the static site.

Routing / API proxying (optional)

If you prefer to keep API calls under the same origin (`/api`) you can add a rewrite to `vercel.json` that proxies `/api/*` to your backend URL. See `vercel.json` next to this README.

Socket.IO note

Socket.IO requires a server that supports long-lived connections. Vercel Serverless Functions are not a good fit for Socket.IO servers because they are ephemeral and not designed to maintain persistent connections. Deploy your backend to Render/Fly/Railway/Heroku/VM and set `VITE_SOCKET_URL` to that host.

If you want, I can:

-   Create the small code edits to use `VITE_API_URL` and `VITE_SOCKET_URL` in the frontend and add `vercel.json` with a rewrite.
-   Provide step-by-step commands to deploy the backend to a recommended host (e.g., Render or Railway).

---

End of instructions.
