import { http, HttpResponse, delay } from "msw";

import {
  RANDOM_FAILURE_ENABLED,
  UPLOAD_SIMULATED_DELAY,
} from "../config/constants";

let mockUsers = [
    {
        id: 1,
        email: "demo@gmail.com",
        password: "qwerty",
        name: "Demo User"
    }
];

let refreshTokenStore = {};

let uploadsDB = {};

// DB for processing after successful upload
let processingDB = {};

export const handlers = [
    // Login
    http.post("/auth/login", async ({ request }) => {
        const { email, password } = await request.json();

        const user = mockUsers.find((u) => u.email === email);

        if(!user || user.password !== password) {
            return HttpResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const accessToken = "access_" + Date.now();
        const refreshToken = "refresh_" + Date.now();

        refreshTokenStore[refreshToken] = user.id;

        return HttpResponse.json({
            accessToken,
           refreshToken,
           user: {
            id: user.id,
            email: user.email,
            name: user.name
           },
        });
    }),

    // Refresh
    http.post("/auth/refresh", async ({ request }) => {
        console.log('refresh called')
        const { refreshToken } = await request.json();

        // If missing refresh token or unknown token than 401
        if(!refreshToken || !refreshTokenStore[refreshToken]) {
            return HttpResponse.json(
                { message: "Refresh failed "},
                { status: 401 }
            );
        }

        // Issue a new access token
        const newToken = "access_" + Date.now();

        return HttpResponse.json({
            accessToken: newToken,
        });
    }),

    //Upload
    http.post("/api/upload", async ({ request }) => {
        console.log("MSW upload hit!");
    

        // if (!window.__forced401) {
        //     window.__forced401 = true;
        //     return HttpResponse.json(
        //         { message: "Token expired" },
        //         { status: 401 }
        //     );
        // }

        const auth = request.headers.get("authorization");
        if(!auth) {
            return HttpResponse.json(
                { message: "Missing token" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if(!file) {
            return HttpResponse.json(
                { message: "No file received" },
                { status: 400 }
            );
        }

        // Simulate slow upload
        await delay(UPLOAD_SIMULATED_DELAY);

        // Simulate random failure 
        if (RANDOM_FAILURE_ENABLED && Math.random() < 0.1) {
            return HttpResponse.json(
                { message: "Random upload error"},
                { status: 500 }
            );
        }

        const id = "file_" + Date.now();

        uploadsDB[id] = {
            id,
            size: file.size,
            name: file.name
        };

        return HttpResponse.json(
            { id },
            { status: 200 }
        );
    }),

    // Start processing after successful upload
    http.post("/api/process/start", async ({ request }) => {
    const { uploadId } = await request.json();

    // Start with "processing" state
    processingDB[uploadId] = {
        status: "processing",
        startedAt: Date.now(),
    };

    return HttpResponse.json({ started: true });
    }),

    // Poll processing status
    http.get("/api/process/:id/status", async ({ params }) => {
    const id = params.id;

    const record = processingDB[id];
    if (!record) {
        return HttpResponse.json(
        { message: "Processing not found" },
        { status: 404 }
        );
    }

    const elapsed = Date.now() - record.startedAt;
    const totalTime = 2500; // 2.5 seconds to simulate processing

    if (elapsed < totalTime) {
        // Calculate incremental progress (0 → 100)
        const progress = Math.floor((elapsed / totalTime) * 100);

        return HttpResponse.json({
        status: "processing",
        progress,
        });
    }

    // Mark processing complete
    record.status = "processed";

    return HttpResponse.json({
        status: "processed",
        progress: 100,
    });
    }),

];