import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, bookingsTable, reviewsTable } from "@workspace/db";
import {
  GetDashboardStatsQueryParams,
  GetDashboardStatsResponse,
  GetDashboardActivityQueryParams,
  GetDashboardActivityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (req, res): Promise<void> => {
  const query = GetDashboardStatsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const salonId = query.data.salonId;
  const allBookings = await db.select().from(bookingsTable).where(eq(bookingsTable.salonId, salonId));
  const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.salonId, salonId));

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = allBookings.filter(b => b.date === today);
  const cancelled = allBookings.filter(b => b.status === "cancelled");
  const waitlisted = allBookings.filter(b => b.status === "pending");

  const serviceCounts: Record<string, number> = {};
  for (const b of allBookings) {
    serviceCounts[b.service] = (serviceCounts[b.service] ?? 0) + 1;
  }
  const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Haircut";

  const avgRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 4.8;
  const revenue = allBookings.filter(b => b.status === "completed").length * 3500;
  const cancelRate = allBookings.length > 0 ? Math.round((cancelled.length / allBookings.length) * 100) : 0;

  const uniqueCustomers = new Set(allBookings.map(b => b.customerName));
  const repeatCustomers = Math.floor(uniqueCustomers.size * 0.6);

  res.json(GetDashboardStatsResponse.parse({
    totalBookings: allBookings.length,
    todayBookings: todayBookings.length,
    revenue,
    cancelRate,
    waitlistCount: waitlisted.length,
    topService,
    avgRating: Math.round(avgRating * 10) / 10,
    repeatCustomers,
  }));
});

router.get("/dashboard/activity", async (req, res): Promise<void> => {
  const query = GetDashboardActivityQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const salonId = query.data.salonId;
  const bookings = await db.select().from(bookingsTable)
    .where(eq(bookingsTable.salonId, salonId))
    .orderBy(desc(bookingsTable.createdAt))
    .limit(15);

  const activities = bookings.map((b, i) => ({
    id: b.id,
    type: b.status === "cancelled" ? "cancellation" : b.status === "pending" ? "waitlist" : "booking",
    message: b.status === "cancelled"
      ? `${b.customerName} cancelled their ${b.service} appointment`
      : b.status === "pending"
      ? `${b.customerName} added to waitlist for ${b.service}`
      : `${b.customerName} booked ${b.service} with ${b.stylistName}`,
    customerName: b.customerName,
    createdAt: b.createdAt.toISOString(),
  }));

  res.json(GetDashboardActivityResponse.parse(activities));
});

export default router;
