import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

dotenv.config();

const NUM_USERS = 35;
const NUM_POSTS = 35;
const TOTAL_COMMENTS = 50;
const TOTAL_LIKES_TARGET = 10000; // for non-verified users
const NUM_VERIFIED_USERS = 8; // some users get 600k–2M total likes (verified badge)
const VERIFIED_MIN_LIKES = 600000;
const VERIFIED_MAX_LIKES = 2000000;

const FIRST_NAMES = [
  "Ahmed", "Sara", "Omar", "Layla", "Khalid", "Fatima", "Hassan", "Aisha",
  "Yusuf", "Mariam", "Ibrahim", "Zainab", "Ali", "Noor", "Mustafa", "Hana",
  "Adam", "Leila", "Amir", "Dina", "Tariq", "Rania", "Karim", "Nadia",
  "Rashid", "Samira", "Jamal", "Lina", "Faisal", "Yasmin", "Nasser", "Dalia",
  "Waleed", "Rasha", "Hamza"
];

const LAST_NAMES = [
  "Khan", "Ali", "Hassan", "Hussein", "Malik", "Rahman", "Shah", "Abbas",
  "Siddiqui", "Chaudhry", "Mirza", "Sheikh", "Ansari", "Khan", "Patel",
  "Singh", "Kumar", "Reddy", "Nelson", "Cooper"
];

const COMPANIES = [
  "TechCorp", "Global Solutions", "Innovate Labs", "DataDrive", "CloudNine",
  "NextGen Software", "Digital Ventures", "Smart Systems", "Alpha Inc", "Beta Labs",
  "Meta Solutions", "Stripe", "Netflix", "Amazon", "Google", "Microsoft",
  "Accenture", "Deloitte", "TCS", "Infosys", "Wipro", "Capgemini"
];

const POSITIONS = [
  "Software Engineer", "Senior Developer", "Tech Lead", "Product Manager",
  "Data Scientist", "DevOps Engineer", "Full Stack Developer", "Backend Engineer",
  "Frontend Developer", "ML Engineer", "CTO", "Engineering Manager",
  "Solution Architect", "QA Lead", "Scrum Master"
];

const SCHOOLS = [
  "MIT", "Stanford", "Harvard", "Oxford", "Cambridge", "IIT Bombay", "IIT Delhi",
  "NUST", "FAST", "LUMS", "UET", "PUCIT", "Georgia Tech", "Berkeley", "ETH Zurich"
];

const DEGREES = [
  "BS Computer Science", "MS Software Engineering", "MBA", "BSc IT",
  "MSc Data Science", "PhD Machine Learning", "BEng", "MEng"
];

const LONG_POST_SAMPLES = [
  "Building scalable systems has been one of the most rewarding challenges of my career. From designing microservices to handling millions of requests per day, the journey teaches you that simplicity often wins. Here are a few principles I follow: start with the problem, measure everything, and never optimize prematurely. What practices have worked for you in production?",
  "The future of work is remote-first, but that doesn't mean we should sacrifice collaboration. Our team has been experimenting with async standups, written updates, and focused deep-work blocks. Productivity has actually gone up. Would love to hear how other teams are balancing flexibility with alignment.",
  "Just wrapped up a major migration from monolith to microservices. The key was incremental strangler-fig approach: we never did a big-bang release. Each service was extracted, tested, and traffic shifted gradually. Took 18 months but zero downtime. Patience and automation are your friends.",
  "Debugging distributed systems is an art. Tracing, logging, and metrics form the holy trinity. We standardized on OpenTelemetry and it changed how we do incident response. If you're still debugging with print statements in prod, it's time to level up. Happy to share our playbook.",
  "Technical debt is not always bad—it's a conscious tradeoff. The mistake is pretending it doesn't exist. We now track it explicitly: every sprint we allocate 20% capacity to pay-down. Quality and velocity have both improved. How do you manage tech debt in your org?",
  "Mentorship has had the biggest impact on my growth. I've had managers who invested in me and peers who pushed me to think deeper. Now I try to pay it forward: code reviews, design docs, and career conversations. If you're early in your career, find someone who challenges you.",
  "Security cannot be an afterthought. We shifted left: SAST, dependency scanning, and secrets management are part of every PR. Last quarter we caught three critical issues before merge. The ROI on prevention is massive. What's your security checklist before deploy?",
  "Documentation is a product. We treat our internal docs like user-facing docs: clear, updated, and searchable. It reduced onboarding time by half and made cross-team collaboration much easier. Start with the README and the runbook—everything else follows.",
  "Failure postmortems are underrated. We do blameless retros after every incident and publish them internally. The same mistakes stopped repeating and the team trusts each other more. Culture of learning from failure is a competitive advantage.",
  "Diversity in teams leads to better products. Different backgrounds mean different questions, and that's where innovation comes from. Hiring for culture add, not culture fit, has made our product and codebase stronger. What's your experience?"
];

const COMMENT_SAMPLES = [
  "Great points, totally agree.",
  "We did something similar last year. Works well.",
  "Thanks for sharing this!",
  "Could you elaborate on the tooling?",
  "This is the approach we're moving to.",
  "Saved for later, very useful.",
  "Same challenges here. Good to know we're not alone.",
  "Would love to see a follow-up on the metrics.",
  "Our team is considering this. Any pitfalls?",
  "Clean and practical. Thanks.",
  "Exactly what I needed to read today.",
  "We tried this and had to adjust X. Still worth it.",
  "Bookmarking this thread.",
  "More of this content please.",
  "How did you get buy-in from leadership?",
  "The async standup idea is gold.",
  "We use a similar framework. Can share our template.",
  "Key takeaway: measure first. So true.",
  "This scales well. We're at 10x and holding.",
  "Resonates with our journey. Thanks for writing."
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing data...");
    await Promise.all([
      Comment.deleteMany({}),
      Post.deleteMany({}),
      Profile.deleteMany({}),
      User.deleteMany({}),
    ]);

    const hashedPassword = await bcrypt.hash("password123", 12);
    const users = [];
    const usedNames = new Set();

    console.log(`Creating ${NUM_USERS} users...`);
    for (let i = 0; i < NUM_USERS; i++) {
      let name;
      do {
        name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      } while (usedNames.has(name));
      usedNames.add(name);
      const username = `user_seed_${i}_${Date.now().toString(36)}`;
      const email = `user_seed_${i}_${Date.now()}@example.com`;

      const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        profilePicture: "default.jpg",
      });
      users.push(user);
    }

    console.log("Creating profiles with professional data...");
    for (const user of users) {
      const numJobs = 2 + Math.floor(Math.random() * 2);
      const pastWork = [];
      for (let j = 0; j < numJobs; j++) {
        pastWork.push({
          company: pick(COMPANIES),
          position: pick(POSITIONS),
          years: `${2018 + j}-${2019 + j + Math.floor(Math.random() * 2)}`,
        });
      }
      const numEdu = 1 + Math.floor(Math.random() * 2);
      const education = [];
      for (let e = 0; e < numEdu; e++) {
        education.push({
          school: pick(SCHOOLS),
          degree: pick(DEGREES),
          fieldOfStudy: "Computer Science",
          fieldStudy: "CS",
        });
      }
      await Profile.create({
        userId: user._id,
        bio: `Passionate about building scalable software and leading teams. ${pick(POSITIONS)} with experience across ${numJobs} roles. Always learning.`,
        currentPost: pick(POSITIONS) + " at " + pick(COMPANIES),
        pastWork,
        education,
      });
    }

    console.log(`Creating ${NUM_POSTS} posts (text only, no images)...`);
    const posts = [];
    for (let i = 0; i < NUM_POSTS; i++) {
      const post = await Post.create({
        userId: users[i % users.length]._id,
        body: pick(LONG_POST_SAMPLES),
        media: "",
        likes: 0,
      });
      posts.push(post);
    }

    console.log(`Adding ${TOTAL_COMMENTS} comments...`);
    for (let c = 0; c < TOTAL_COMMENTS; c++) {
      await Comment.create({
        userId: pick(users)._id,
        postId: pick(posts)._id,
        body: pick(COMMENT_SAMPLES),
      });
    }

    // Group posts by userId for verified vs normal likes
    const postsByUser = new Map();
    for (const post of posts) {
      const uid = post.userId.toString();
      if (!postsByUser.has(uid)) postsByUser.set(uid, []);
      postsByUser.get(uid).push(post);
    }
    const userIds = [...postsByUser.keys()];
    const verifiedUserIds = pickN(userIds, Math.min(NUM_VERIFIED_USERS, userIds.length));

    console.log(`Giving ${verifiedUserIds.length} users 600k–2M likes (verified badge)...`);
    for (const uid of verifiedUserIds) {
      const userPosts = postsByUser.get(uid);
      const totalForUser = VERIFIED_MIN_LIKES + Math.floor(Math.random() * (VERIFIED_MAX_LIKES - VERIFIED_MIN_LIKES + 1));
      let remaining = totalForUser;
      for (let i = 0; i < userPosts.length; i++) {
        const share = i === userPosts.length - 1 ? remaining : Math.floor(remaining * (0.3 + Math.random() * 0.5));
        remaining -= share;
        await Post.updateOne({ _id: userPosts[i]._id }, { likes: Math.max(0, share) });
      }
      if (remaining > 0) {
        await Post.updateOne({ _id: userPosts[0]._id }, { $inc: { likes: remaining } });
      }
    }

    console.log("Distributing ~10k likes across remaining posts...");
    const nonVerifiedPosts = posts.filter((p) => !verifiedUserIds.includes(p.userId.toString()));
    let remaining = TOTAL_LIKES_TARGET;
    for (let i = 0; i < nonVerifiedPosts.length; i++) {
      const share = i === nonVerifiedPosts.length - 1
        ? remaining
        : Math.floor(remaining * (0.5 + Math.random() * 0.5) / (nonVerifiedPosts.length - i));
      remaining -= share;
      await Post.updateOne({ _id: nonVerifiedPosts[i]._id }, { likes: Math.max(0, share) });
    }
    if (remaining > 0 && nonVerifiedPosts.length) {
      await Post.updateOne({ _id: nonVerifiedPosts[0]._id }, { $inc: { likes: remaining } });
    }

    const totalLikes = (await Post.aggregate([{ $group: { _id: null, sum: { $sum: "$likes" } } }]))[0]?.sum || 0;
    const countUsers = await User.countDocuments();
    const countProfiles = await Profile.countDocuments();
    const countPosts = await Post.countDocuments();
    const countComments = await Comment.countDocuments();

    console.log("\n--- Seed complete ---");
    console.log("Users:", countUsers);
    console.log("Profiles:", countProfiles);
    console.log("Posts:", countPosts);
    console.log("Comments:", countComments);
    console.log("Total likes:", totalLikes);
    console.log("Verified users (600k–2M likes):", verifiedUserIds.length);
    console.log("All users have password: password123");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

run();
