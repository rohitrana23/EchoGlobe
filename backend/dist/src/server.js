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
// Middleware
app.use((0, cors_1.default)());
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
