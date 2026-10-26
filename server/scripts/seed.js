// scripts/seed.js
// Clear the collections and insert sample data for local development.
// Run with: node scripts/seed.js  (repeatable: collections are cleared first)

require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/UserModel');
const Project = require('../models/ProjectModel');
const BlogPost = require('../models/BlogPostModel');
const Comment = require('../models/CommentModel');
const Message = require('../models/MessageModel');

// Remove all existing documents from the seedable collections
const clearDatabase = async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await BlogPost.deleteMany({});
  await Comment.deleteMany({});
  await Message.deleteMany({});
};

// Insert the admin account and sample projects, posts and comments
const seedDatabase = async () => {
  await clearDatabase();

  // Admin account (password hashed by the model pre-save hook)
  const admin = await User.create({
    username: 'admin',
    email: 'admin@portfolio.com',
    password: '123456',
  });

  // Sample portfolio projects
  const projects = await Project.insertMany([
    {
      title: 'Personal Portfolio Website',
      description:
        'A responsive personal portfolio built with React and Express, presenting projects, blog posts and a contact form. Built by Wang Guoning (Student ID: 24998015) for the Capstone Project.',
      imageUrl: '/images/portfolio.png',
      repoUrl: 'https://github.com/example/portfolio',
      liveUrl: '',
      user: admin._id,
    },
    {
      title: 'Student Course Management System',
      description:
        'A web application for managing students, courses and grades, built with Node.js, Express and MongoDB. Covers CRUD operations, data validation and role-based access.',
      imageUrl: '/images/course-system.png',
      repoUrl: 'https://github.com/example/course-management',
      liveUrl: '',
      user: admin._id,
    },
    {
      title: 'Task Tracker REST API',
      description:
        'A RESTful task management API with JWT authentication, protected routes, comment support and centralized error handling, designed as the backend of a productivity app.',
      imageUrl: '/images/task-tracker.png',
      repoUrl: 'https://github.com/example/task-tracker-api',
      liveUrl: '',
      user: admin._id,
    },
    {
      title: 'Weather Dashboard',
      description:
        'A small dashboard that fetches current weather data from a public API and displays forecasts in cards, with a search bar and responsive layout.',
      imageUrl: '/images/weather-dashboard.png',
      repoUrl: 'https://github.com/example/weather-dashboard',
      liveUrl: '',
      user: admin._id,
    },
  ]);

  // Sample blog posts
  const post1 = await BlogPost.create({
    title: 'Welcome to My Portfolio Blog',
    content:
      'Hello and welcome! This blog belongs to Wang Guoning (Student ID: 24998015), a Computer Science student. Here I will share notes on web development, database design and the projects I build during my studies.',
    author: admin._id,
  });

  const post2 = await BlogPost.create({
    title: 'Why I Chose the MERN Stack',
    content:
      'MongoDB, Express, React and Node.js form a JavaScript-only stack that makes full-stack development fast and consistent. In this post I explain the basics of each layer and how they communicate through REST APIs.',
    author: admin._id,
  });

  const post3 = await BlogPost.create({
    title: 'Notes on REST API Design',
    content:
      'A good REST API uses clear resource names, proper HTTP status codes, centralized error handling and authentication middleware. These notes summarize the patterns used in this Capstone backend.',
    author: admin._id,
  });

  // Sample comments on the posts
  await Comment.insertMany([
    {
      body: 'Nice introduction, looking forward to the next posts!',
      author: admin._id,
      post: post1._id,
    },
    {
      body: 'Good explanation of the MERN layers, thanks for sharing.',
      author: admin._id,
      post: post2._id,
    },
    {
      body: 'The status code mapping section was especially helpful.',
      author: admin._id,
      post: post3._id,
    },
  ]);

  // One sample contact message
  await Message.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hi, I really like your portfolio. Would love to connect!',
  });

  console.log('Seed complete:');
  console.log(`  Users: ${await User.countDocuments()}`);
  console.log(`  Projects: ${projects.length}`);
  console.log(`  Blog posts: ${await BlogPost.countDocuments()}`);
  console.log(`  Comments: ${await Comment.countDocuments()}`);
  console.log(`  Messages: ${await Message.countDocuments()}`);
  console.log(`  Admin login: admin@portfolio.com / 123456`);
};

// Run the seed when executed directly
if (require.main === module) {
  connectDB()
    .then(() => seedDatabase())
    .then(() => mongoose.connection.close())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(`Seed failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { clearDatabase, seedDatabase };
