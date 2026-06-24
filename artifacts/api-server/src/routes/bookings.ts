import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, bookingsTable, salonsTable } from "@workspace/db";
import {
  ListBookingsQueryParams,
  ListBookingsResponse,
  CreateBookingBody,
  GetBookingParams,
  GetBookingResponse,
  UpdateBookingParams,
  UpdateBookingBody,
  UpdateBookingResponse,
  ListRecentBookingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookings", async (req, res): Promise<void> => {
  const query = ListBookingsQueryParams.safeParse(req.query);
  const salons = await db.select().from(salonsTable);
  const salonMap = Object.fromEntries(salons.map(s => [s.id, s.name]));

  let bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));

  if (query.success) {
    if (query.data.salonId) {
      bookings = bookings.filter(b => b.salonId === query.data.salonId);
    }
    if (query.data.status) {
      bookings = bookings.filter(b => b.status === query.data.status);
    }
  }

  res.json(ListBookingsResponse.parse(bookings.map(b => ({
    ...b,
    salonName: salonMap[b.salonId] ?? "Paloma Salon",
  }))));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
  const [salon] = await db.select().from(salonsTable).where(eq(salonsTable.id, booking.salonId));
  res.status(201).json(GetBookingResponse.parse({
    ...booking,
    salonName: salon?.name ?? "Paloma Salon",
  }));
});

router.get("/bookings/recent", async (_req, res): Promise<void> => {
  const salons = await db.select().from(salonsTable);
  const salonMap = Object.fromEntries(salons.map(s => [s.id, s.name]));
  const bookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt)).limit(10);
  res.json(ListRecentBookingsResponse.parse(bookings.map(b => ({
    ...b,
    salonName: salonMap[b.salonId] ?? "Paloma Salon",
  }))));
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBookingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id));
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const [salon] = await db.select().from(salonsTable).where(eq(salonsTable.id, booking.salonId));
  res.json(GetBookingResponse.parse({
    ...booking,
    salonName: salon?.name ?? "Paloma Salon",
  }));
});

router.patch("/bookings/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBookingParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [booking] = await db.update(bookingsTable).set(parsed.data).where(eq(bookingsTable.id, params.data.id)).returning();
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  const [salon] = await db.select().from(salonsTable).where(eq(salonsTable.id, booking.salonId));
  res.json(UpdateBookingResponse.parse({
    ...booking,
    salonName: salon?.name ?? "Paloma Salon",
  }));
});

export default router;
