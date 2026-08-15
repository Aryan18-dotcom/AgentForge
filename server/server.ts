import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./Configs/DB.js";
import session from "express-session";
import MongoStore from 'connect-mongo';
import AuthRouter from "./Routes/AuthRoutes.js";
import AgentRouter from "./Routes/AgentRoutes.js";
import publicAgentChat from "./Routes/PublicAgentChatRoutes.js";
import paymentRouter from "./Routes/PaymentRoutes.js";
import { UserSettingsRouter } from "./Routes/UserSettingsRoute.js";
import { AgentDB } from "./Models/AgentModels.js";

await connectDB();
const isProduction = process.env.NODE_ENV === "production";
const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
    process.env.VITE_FRONT_END_URL as string,
].filter(Boolean);

// Middleware
// Custom Middleware wrapper to expose the 'req' object to the CORS validation layer
function isOriginAllowed(originHeader: string | undefined, dynamicAllowedOrigins: string[]): boolean {
    if (!originHeader) return false;
    if (allowedOrigins.includes(originHeader)) return true;

    try {
        // 1. Normalize URL to ensure safe parsing
        const formattedUrl = /^https?:\/\//i.test(originHeader)
            ? originHeader
            : `http://${originHeader}`;

        const parsedUrl = new URL(formattedUrl);
        const hostname = parsedUrl.hostname.toLowerCase();
        const hostWithPort = parsedUrl.host.toLowerCase(); // hostname:port

        // 2. Check if the incoming request is local
        const isLocal =
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '::1' ||
            hostname.endsWith('.localhost');

        // Free tier / no custom domains -> ONLY localhost is allowed
        if (!dynamicAllowedOrigins || dynamicAllowedOrigins.length === 0) {
            return isLocal;
        }

        // Paid tier -> allow if it matches the whitelist OR if it's local
        const normalizedAllowed = dynamicAllowedOrigins.map(origin => {
            const formatted = /^https?:\/\//i.test(origin) ? origin : `http://${origin}`;
            try {
                const u = new URL(formatted);
                return { host: u.host.toLowerCase(), hostname: u.hostname.toLowerCase() };
            } catch {
                return { host: origin.toLowerCase(), hostname: origin.toLowerCase() };
            }
        });

        return normalizedAllowed.some(allowed =>
            hostWithPort === allowed.host ||
            hostname === allowed.hostname ||
            hostname.endsWith(`.${allowed.hostname}`)
        );
    } catch {
        return false;
    }
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Helper to send formatted JSON error with valid CORS headers
    const rejectCors = (statusCode: number, message: string) => {
        if (origin) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
        }
        return res.status(statusCode).json({
            success: false,
            message: message
        });
    };

    // 1. ISOLATION CHECK: Detect public widget endpoints instantly
    const isPublicRoute = req.path.startsWith('/api/agents/public') || req.path.startsWith('/api/agent/chat');

    if (isPublicRoute) {
        // Handle preflight OPTIONS requests immediately
        if (req.method === 'OPTIONS') {
            if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            return res.sendStatus(204);
        }

        // Extracts the 24-character hex MongoDB ID from the endpoint URL string
        const match = req.path.match(/(?:\/public\/details\/|\/chat\/public\/)([a-fA-F0-9]{24})/);
        const agentId = match ? match[1] : null;

        if (!agentId) {
            return rejectCors(400, "CORS Denied: Missing agent context parameter.");
        }

        try {
            const agentConfig = await AgentDB.findById(agentId).lean();

            // If agent doesn't exist or is explicitly deactivated by creator, block it
            if (!agentConfig || agentConfig.isActive === false) {
                return rejectCors(403, "CORS Denied: Agent configuration is unavailable or inactive.");
            }

            const dynamicAllowedOrigins = agentConfig.allowedOrigins || [];
            const isOriginPermitted = isOriginAllowed(origin, dynamicAllowedOrigins);

            if (isOriginPermitted) {
                // Allow the request through CORS
                return cors({
                    origin: origin || true,
                    credentials: true,
                    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
                    allowedHeaders: ["Content-Type", "Authorization"]
                })(req, res, next);
            } else {
                return rejectCors(403, "CORS Denied: Origin not permitted for this agent.");
            }

        } catch (error) {
            console.error("[CORS Engine Database Failure]:", error);
            return rejectCors(500, "CORS Denied: Gateway operational handshake exception.");
        }
    }

    // 2. FALLBACK: Internal dashboard panel system operations
    if (!origin || allowedOrigins.includes(origin)) {
        return cors({
            origin: origin || true,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"]
        })(req, res, next);
    } else {
        return rejectCors(403, "CORS Denied: Platform workspace restriction.");
    }
});

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    name: 'AgentForge_Session',
    cookie: {
        secure: isProduction, // Must be true for HTTPS on Vercel
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: isProduction ? "none" : "lax"
    },
    store: MongoStore.create({
        mongoUrl: process.env.Mongodb_URI as string,
        collectionName: 'sessions',
        ttl: 60 * 60 * 24 * 1,
    })
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// Function Routes
app.use('/api/auth', AuthRouter);
app.use('/api/agents', AgentRouter);
app.use('/api/agent/chat', publicAgentChat);
app.use('/api/payments', paymentRouter);
app.use('/api/profile', UserSettingsRouter);

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export default app;