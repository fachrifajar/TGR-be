"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postVisitCache = new Map(); // Map to store post visit timestamps
const rateLimitMiddleware = (req, res, next) => {
    const postId = req.params.id;
    // Check if the user has already visited this post
    if (postVisitCache.has(postId)) {
        const lastVisitTimestamp = postVisitCache.get(postId);
        // Compare the current time with the last visit timestamp
        const elapsedTime = lastVisitTimestamp
            ? Date.now() - lastVisitTimestamp
            : undefined;
        // If the elapsed time is within the rate limit window, send the rate limit message
        if (elapsedTime && elapsedTime <= 60 * 60 * 1000) {
            return res.status(429).json({
                message: "Too many requests from this IP for this post, please try again later.",
            });
        }
    }
    postVisitCache.set(postId, Date.now());
    next();
};
exports.default = rateLimitMiddleware;
//# sourceMappingURL=rateLimit.js.map