import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import {
  ListReviewsQueryParams,
  ListReviewsResponse,
  CreateReviewBody,
  ListReviewsResponseItem,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const query = ListReviewsQueryParams.safeParse(req.query);
  let reviews = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));

  if (query.success) {
    if (query.data.salonId) {
      reviews = reviews.filter(r => r.salonId === query.data.salonId);
    }
    if (query.data.stylistId) {
      reviews = reviews.filter(r => r.stylistId === query.data.stylistId);
    }
  }

  res.json(ListReviewsResponse.parse(reviews.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }))));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db.insert(reviewsTable).values(parsed.data).returning();
  res.status(201).json(ListReviewsResponseItem.parse({
    ...review,
    createdAt: review.createdAt.toISOString(),
  }));
});

export default router;
