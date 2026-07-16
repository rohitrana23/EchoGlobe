"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.get('/api/stations/search', async (req, res) => {
    try {
        const { q, limit = '1000' } = req.query;
        const stations = await prisma.station.findMany({
            where: q
                ? {
                    OR: [
                        {
                            name: {
                                contains: q,
                            },
                        },
                        {
                            tags: {
                                contains: q,
                            },
                        },
                    ],
                }
                : undefined,
            take: parseInt(limit),
            orderBy: {
                clickCount: 'desc',
            },
        });
        res.json(stations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Server error',
        });
    }
});
app.listen(5000, () => console.log('Server running on port 5000'));
