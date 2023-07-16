import { Request, Response, NextFunction } from "express";

const postVisitCache = new Map<string, number>(); // Map to store post visit timestamps

const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.id;

  // Check if the user has already visited this post
  if (postVisitCache.has(postId)) {
    const lastVisitTimestamp = postVisitCache.get(postId);

    // Compare the current time with the last visit timestamp
    const elapsedTime: number | undefined = lastVisitTimestamp
      ? Date.now() - lastVisitTimestamp
      : undefined;

    // If the elapsed time is within the rate limit window, send the rate limit message
    if (elapsedTime && elapsedTime <= 60 * 60 * 1000) {
      return res.status(429).json({
        message:
          "Too many requests from this IP for this post, please try again later.",
      });
    }
  }

  postVisitCache.set(postId, Date.now());

  next();
};

export default rateLimitMiddleware;
