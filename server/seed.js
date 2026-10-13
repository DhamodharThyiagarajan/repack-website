import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';
import Repack from './models/Repack.js';
import Comment from './models/Comment.js';
import { createRequire } from 'module';

dotenv.config();

const require = createRequire(import.meta.url);
const realGames = require('./real_games.json');

const poolGenres = ['Action', 'RPG', 'Open World', 'Souls-like', 'Adventure', 'Roguelike', 'Sci-fi', 'First-Person', 'Cyberpunk', 'Western', 'Indie', 'Mythology', 'Sports', 'Simulation', 'Strategy'];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Repack.deleteMany();
    await Comment.deleteMany();

    console.log('Database cleared.');

    // Seed Users
    const adminUser = await User.create({
      username: 'FitGirl',
      email: 'admin@fitgirl.site',
      firebaseUid: 'dev-admin-uid',
      isAdmin: true,
    });

    const normalUser = await User.create({
      username: 'gamer99',
      email: 'gamer@example.com',
      firebaseUid: 'dev-user-uid',
      isAdmin: false,
    });

    console.log('Users seeded.');

    // Slice first 150 games from realGames to match exactly the required count
    const targetGames = realGames.slice(0, 150);
    const repacks = targetGames.map((game, index) => {
      const originalSize = game.originalSize || '50 GB';
      const repackSize = game.repackSize || '30 GB';
      
      // Determine genres based on keywords in title
      const genres = [];
      const titleLower = game.title.toLowerCase();
      if (titleLower.includes('action')) genres.push('Action');
      if (titleLower.includes('rpg') || titleLower.includes('role')) genres.push('RPG');
      if (titleLower.includes('world') || titleLower.includes('tsushima') || titleLower.includes('gta')) genres.push('Open World');
      if (titleLower.includes('souls') || titleLower.includes('elden')) genres.push('Souls-like');
      if (titleLower.includes('hades') || titleLower.includes('rogue')) genres.push('Roguelike');
      if (titleLower.includes('sport') || titleLower.includes('fc')) genres.push('Sports');
      if (titleLower.includes('indie')) genres.push('Indie');
      
      // Fallback if no keywords matched
      if (genres.length === 0) {
        genres.push(poolGenres[index % poolGenres.length]);
        genres.push(poolGenres[(index + 2) % poolGenres.length]);
      }

      // Estimate developer / publisher
      let developer = 'Various Developers';
      let publisher = 'Various Publishers';
      if (titleLower.includes('elden') || titleLower.includes('souls')) {
        developer = 'FromSoftware';
        publisher = 'Bandai Namco';
      } else if (titleLower.includes('cyberpunk') || titleLower.includes('witcher')) {
        developer = 'CD PROJEKT RED';
        publisher = 'CD PROJEKT RED';
      } else if (titleLower.includes('grand theft') || titleLower.includes('red dead') || titleLower.includes('gta')) {
        developer = 'Rockstar Games';
        publisher = 'Rockstar Games';
      } else if (titleLower.includes('resident evil')) {
        developer = 'Capcom';
        publisher = 'Capcom';
      } else if (titleLower.includes('spider-man') || titleLower.includes('last of us')) {
        developer = 'PlayStation Studios';
        publisher = 'Sony Interactive';
      } else if (titleLower.includes('wukong')) {
        developer = 'Game Science';
        publisher = 'Game Science';
      } else if (titleLower.includes('hades')) {
        developer = 'Supergiant Games';
        publisher = 'Supergiant Games';
      }

      // Generate features list
      const cleanTitle = game.title.split(' - ')[0];
      const features = [
        `Based on official lossless release with all updates included`,
        `100% Lossless & MD5 Perfect: all files are identical to originals after installation`,
        `NOTHING ripped, NOTHING re-encoded`,
        `Compressed from ${originalSize} to ${repackSize}`,
        `Selective Download feature: you can skip downloading of optional components`
      ];

      return {
        title: game.title,
        originalSize,
        repackSize,
        genres,
        developer,
        publisher,
        releaseDate: new Date(Date.now() - (index * 3 * 24 * 60 * 60 * 1000)), // dynamic spread out dates
        description: `${cleanTitle} is a critically acclaimed title featuring outstanding visuals, highly immersive gameplay mechanics, and engaging environments. Download this repack highly compressed to save download bandwidth.`,
        coverImage: game.coverImage,
        features,
        requirements: {
          minimum: 'Requires a 64-bit processor and operating system\nOS: Windows 10 (64-bit)\nProcessor: Intel Core i5 / AMD Ryzen 5\nMemory: 8 GB RAM\nGraphics: NVIDIA GTX 1060 3GB / AMD RX 580 4GB\nStorage: 60 GB available space',
          recommended: 'Requires a 64-bit processor and operating system\nOS: Windows 10/11 (64-bit)\nProcessor: Intel Core i7 / AMD Ryzen 7\nMemory: 16 GB RAM\nGraphics: NVIDIA RTX 3060 6GB / AMD RX 6700 XT 8GB\nStorage: 60 GB available space (SSD recommended)'
        },
        downloadLinks: game.downloadLinks,
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
        ],
        views: Math.floor(Math.random() * 85000) + 1200
      };
    });

    const seededRepacks = await Repack.insertMany(repacks);
    console.log(`Successfully seeded ${seededRepacks.length} Game Repacks using real thumbnail/page URLs.`);

    // Add some sample comments on the first repack (The Genesis Order)
    const firstRepack = seededRepacks[0];
    await Comment.create([
      {
        repackId: firstRepack._id,
        userId: normalUser._id,
        username: 'gamer99',
        content: 'Awesome game! Thanks for this repack, downloaded in no time.',
        createdAt: new Date()
      },
      {
        repackId: firstRepack._id,
        userId: adminUser._id,
        username: 'FitGirl',
        content: 'Enjoy! Seed as long as you can.',
        createdAt: new Date(Date.now() + 60000)
      }
    ]);
    console.log('Sample comments seeded.');

    mongoose.connection.close();
    console.log('Seeding complete. Connection closed.');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
