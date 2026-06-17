import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(cors());

app.get('/api/stations/search', async (req, res) => {
  try {
    const { q, limit = '1000' } = req.query;

    const stations = await prisma.station.findMany({
      where: q
        ? {
            OR: [
              {
                name: {
                  contains: q as string,
                },
              },
              {
                tags: {
                  contains: q as string,
                },
              },
            ],
          }
        : undefined,
      take: parseInt(limit as string),
      orderBy: {
        clickCount: 'desc',
      },
    });

    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
});
app.listen(5000, () => console.log('Server running on port 5000'));