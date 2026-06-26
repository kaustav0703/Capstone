import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';
import Channel from './models/Channel.js';
import User from './models/User.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database for local asset path deployment...");

    // 1. Wipe out old data entries to avoid reference collisions
    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared old mock data sets from collections.");

    // ==========================================
    // CREATOR INITIALIZATION 1: ASHISH
    // ==========================================
    const ashishUser = await User.create({
      username: "AshishCreator",
      email: "ashish@creator.com",
      password: "securePassword123",
      avatar: "/src/assets/ashish_logo.jpg"
    });

    const ashishChannel = await Channel.create({
      channelName: "Ashish Channels",
      description: "Custom personal showcase video logs and portfolio streams.",
      channelBanner: "/src/assets/ashish_logo.jpg",
      owner: ashishUser._id
    });

    // ==========================================
    // CREATOR INITIALIZATION 2: OREO
    // ==========================================
    const oreoUser = await User.create({
      username: "OreoOfficial",
      email: "media@oreo.com",
      password: "oreoPassword123",
      avatar: "/src/assets/oreo_logo.jpg"
    });

    const oreoChannel = await Channel.create({
      channelName: "Oreo Media",
      description: "Official channel for Oreo visual content assets.",
      channelBanner: "/src/assets/oreo_logo.jpg",
      owner: oreoUser._id
    });

    // ==========================================
    // CREATOR INITIALIZATION 3: STARS
    // ==========================================
    const starsUser = await User.create({
      username: "StarsMedia",
      email: "contact@stars.com",
      password: "starsPassword123",
      avatar: "/src/assets/stars_logo.jpg"
    });

    const starsChannel = await Channel.create({
      channelName: "Stars Network",
      description: "Cinematic updates and universe showcase elements.",
      channelBanner: "/src/assets/stars_logo.jpg",
      owner: starsUser._id
    });

    // ==========================================
    // LOCAL VIDEO FILE PAYLOAD TRACK MATRIX
    // ==========================================
    const videoDataPayload = [
      {
        title: "We talked to @dhruvrathee about the LPG Crisis in India | Khabr-e-Azam w/ Kunal Kamra & ROFL | E39",
        videoUrl: "/src/assets/ashish.mp4", // Points straight to your local asset video file
        thumbnailUrl: "/src/assets/ashish_thumbnail.jpg",
        description: "Kunal Kamra and ROFL Gandhi host a panel discussion featuring Dhruv Rathee to unpack domestic energy markets.",
        category: "Comedy",
        views: 742180,
        uploader: ashishUser._id,
        channelId: ashishChannel._id
      },
      {
        title: "Highlights | South Africa 1-0 Korea Republic | FIFA World Cup 2026™",
        videoUrl: "/src/assets/oreo.mp4", // Points straight to your local asset video file
        thumbnailUrl: "/src/assets/oreo_thumbnail.jpg",
        description: "Watch the latest high definition media presentation clip featuring custom animation captures.",
        category: "Sports",
        views: 1254300,
        uploader: oreoUser._id,
        channelId: oreoChannel._id
      },
      {
        title: "Cinematic Astronomy Visual Highlights | Deep Space Discovery Series",
        videoUrl: "/src/assets/stars.mp4", // Points straight to your local asset video file
        thumbnailUrl: "/src/assets/stars_thumbnail.jpg",
        description: "Exploring post-apocalyptic tracking visual effects and cosmic data structures mapping networks.",
        category: "Tech",
        views: 310500,
        uploader: starsUser._id,
        channelId: starsChannel._id
      }
    ];

    // 2. Persist videos into cloud database collections
    const insertedVideos = await Video.insertMany(videoDataPayload);

    // 3. Map tracking ID array links back onto their respective channels
    ashishChannel.videos.push(insertedVideos[0]._id);
    await ashishChannel.save();

    oreoChannel.videos.push(insertedVideos[1]._id);
    await oreoChannel.save();

    starsChannel.videos.push(insertedVideos[2]._id);
    await starsChannel.save();

    console.log(`Successfully migrated local assets! Seeded ${insertedVideos.length} custom streaming files.`);
    process.exit(0);
  } catch (error) {
    console.error("Data seeding migration crashed:", error);
    process.exit(1);
  }
};

seedDatabase();
