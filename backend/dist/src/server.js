"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Trust proxy when deployed behind Railway/Vercel proxies
app.set("trust proxy", 1);
// CORS: allow origin from env or default to frontend hosts (allow all if not provided)
const CORS_ORIGIN = process.env.CORS_ORIGIN || process.env.FRONTEND_ORIGIN || "*";
const corsOptions = {
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 204,
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "Backend is running" });
});
// Stations search route
app.get("/api/stations/search", async (req, res) => {
    try {
        const { q, limit = "500" } = req.query;
        const searchTerm = q;
        const stations = await prisma.station.findMany({
            where: searchTerm
                ? {
                    OR: [
                        { name: { contains: searchTerm } },
                        { tags: { contains: searchTerm } },
                    ],
                }
                : undefined,
            take: parseInt(limit),
            orderBy: { clickCount: "desc" },
        });
        res.json(stations);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch stations" });
    }
});
// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Graceful shutdown
const shutdown = async () => {
    console.log("Shutting down server...");
    server.close(async () => {
        try {
            await prisma.$disconnect();
        }
        catch (e) {
            // ignore
        }
        process.exit(0);
    });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
