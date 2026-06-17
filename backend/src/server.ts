import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Stations search route
app.get("/api/stations/search", async (req, res) => {
  try {
    const { q, limit = "500" } = req.query;
    const searchTerm = q as string;

    const stations = await prisma.station.findMany({
      where: searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm } },
              { tags: { contains: searchTerm } },
            ],
          }
        : undefined,
      take: parseInt(limit as string),
      orderBy: { clickCount: "desc" },
    });

    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
