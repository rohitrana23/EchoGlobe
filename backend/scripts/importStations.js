"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Fetching stations from Radio Browser API...');
    try {
        const response = await axios_1.default.post('https://de1.api.radio-browser.info/json/stations/search', {
            limit: 5000, //more stations to filter out stations without cords.
            order: 'clickcount',
            reverse: true,
            hidebroken: true,
            has_geo_info: true,
        });
        const stations = response.data;
        console.log(`Fetched ${stations.length} stations with geo info.`);
        let importedCount = 0;
        const MAX_STATIONS = 5000;
        for (const station of stations) {
            if (importedCount >= MAX_STATIONS)
                break;
            // Make sure we have coordinates
            const lat = parseFloat(station.geo_lat);
            const lng = parseFloat(station.geo_long);
            if (isNaN(lat) || isNaN(lng))
                continue;
            try {
                await prisma.station.upsert({
                    where: { stationuuid: station.stationuuid },
                    update: {
                        name: station.name,
                        url: station.url,
                        urlResolved: station.url_resolved,
                        favicon: station.favicon,
                        tags: station.tags,
                        country: station.country,
                        countryCode: station.countrycode,
                        state: station.state,
                        language: station.language,
                        votes: station.votes,
                        codec: station.codec,
                        bitrate: station.bitrate,
                        hls: station.hls === 1,
                        lastCheckOk: station.lastcheckok === 1,
                        geoLat: lat,
                        geoLong: lng,
                        clickCount: station.clickcount,
                    },
                    create: {
                        stationuuid: station.stationuuid,
                        name: station.name || 'Unknown Station',
                        url: station.url,
                        urlResolved: station.url_resolved,
                        homepage: station.homepage,
                        favicon: station.favicon,
                        tags: station.tags,
                        country: station.country,
                        countryCode: station.countrycode,
                        state: station.state,
                        language: station.language,
                        votes: station.votes || 0,
                        codec: station.codec,
                        bitrate: station.bitrate || 0,
                        hls: station.hls === 1,
                        lastCheckOk: station.lastcheckok === 1,
                        geoLat: lat,
                        geoLong: lng,
                        clickCount: station.clickcount || 0,
                    },
                });
                importedCount++;
                if (importedCount % 100 === 0) {
                    console.log(`Imported ${importedCount} stations...`);
                }
            }
            catch (err) {
                console.error(`Failed to import station ${station.name}:`, err);
            }
        }
        console.log(`Successfully imported ${importedCount} stations.`);
    }
    catch (error) {
        console.error('Error fetching stations:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
