import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(cors());

app.get('/api/stations/search', async (req, res) => {
  const { q, limit = '500' } = req.query;
  const searchTerm = q as string;

  const stations = await prisma.station.findMany({
    where: searchTerm ? {
      OR: [
        { name: { contains: searchTerm } },
        { tags: { contains: searchTerm } }
      ]
    } : undefined,
    take: parseInt(limit as string),
    orderBy: { clickCount: 'desc' }
  });
  res.json(stations);
});
app.listen(5000, () => console.log('Server running on port 5000'));