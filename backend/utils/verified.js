import Post from "../models/posts.model.js";

const VERIFIED_LIKES_THRESHOLD = 600000; // 600k - 2M range: user verified if total post likes >= 600k

/**
 * Returns Set of user IDs (strings) whose total post likes >= VERIFIED_LIKES_THRESHOLD.
 */
export async function getVerifiedUserIds() {
  const result = await Post.aggregate([
    { $group: { _id: "$userId", totalLikes: { $sum: "$likes" } } },
    { $match: { totalLikes: { $gte: VERIFIED_LIKES_THRESHOLD } } },
  ]);
  return new Set(result.map((r) => r._id.toString()));
}

export { VERIFIED_LIKES_THRESHOLD };
