import { Router, type IRouter } from "express";
import { eq, avg, count } from "drizzle-orm";
import { db, salonsTable, bookingsTable } from "@workspace/db";
import {
  ListSalonsQueryParams,
  ListSalonsResponse,
  CreateSalonBody,
  GetSalonParams,
  GetSalonResponse,
  ListFeaturedSalonsResponse,
  GetSalonsSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/salons", async (req, res): Promise<void> => {
  const query = ListSalonsQueryParams.safeParse(req.query);
  let salons = await db.select().from(salonsTable);

  if (query.success) {
    if (query.data.neighborhood) {
      salons = salons.filter(s => s.neighborhood.toLowerCase().includes(query.data.neighborhood!.toLowerCase()));
    }
    if (query.data.service) {
      salons = salons.filter(s => s.services.some(sv => sv.toLowerCase().includes(query.data.service!.toLowerCase())));
    }
    if (query.data.rating) {
      salons = salons.filter(s => s.rating >= (query.data.rating ?? 0));
    }
  }

  res.json(ListSalonsResponse.parse(salons.map(s => ({
    ...s,
    reviewCount: s.reviewCount ?? 0,
    services: s.services ?? [],
    featured: s.featured ?? false,
    priceRange: s.priceRange ?? "₹₹₹",
  }))));
});

router.post("/salons", async (req, res): Promise<void> => {
  const parsed = CreateSalonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [salon] = await db.insert(salonsTable).values({
    ...parsed.data,
    services: parsed.data.services ?? [],
  }).returning();
  res.status(201).json(GetSalonResponse.parse({
    ...salon,
    reviewCount: salon.reviewCount ?? 0,
    services: salon.services ?? [],
    featured: salon.featured ?? false,
    priceRange: salon.priceRange ?? "₹₹₹",
  }));
});

router.get("/salons/featured", async (_req, res): Promise<void> => {
  const salons = await db.select().from(salonsTable).where(eq(salonsTable.featured, true));
  res.json(ListFeaturedSalonsResponse.parse(salons.map(s => ({
    ...s,
    reviewCount: s.reviewCount ?? 0,
    services: s.services ?? [],
    featured: s.featured ?? false,
    priceRange: s.priceRange ?? "₹₹₹",
  }))));
});

router.get("/salons/summary", async (_req, res): Promise<void> => {
  const salons = await db.select().from(salonsTable);
  const bookings = await db.select().from(bookingsTable);
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(b => b.date === today).length;

  const neighborhoodMap: Record<string, number> = {};
  for (const s of salons) {
    neighborhoodMap[s.neighborhood] = (neighborhoodMap[s.neighborhood] ?? 0) + 1;
  }
  const neighborhoods = Object.entries(neighborhoodMap).map(([name, count]) => ({ name, count }));

  const avgRating = salons.length > 0 ? salons.reduce((a, s) => a + (s.rating ?? 0), 0) / salons.length : 0;

  res.json(GetSalonsSummaryResponse.parse({
    totalSalons: salons.length,
    totalBookingsToday: todayBookings,
    avgRating: Math.round(avgRating * 10) / 10,
    neighborhoods,
  }));
});

router.get("/salons/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSalonParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [salon] = await db.select().from(salonsTable).where(eq(salonsTable.id, params.data.id));
  if (!salon) {
    res.status(404).json({ error: "Salon not found" });
    return;
  }
  res.json(GetSalonResponse.parse({
    ...salon,
    reviewCount: salon.reviewCount ?? 0,
    services: salon.services ?? [],
    featured: salon.featured ?? false,
    priceRange: salon.priceRange ?? "₹₹₹",
  }));
});

export default router;
