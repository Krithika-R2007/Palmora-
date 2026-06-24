import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, stylistsTable, salonsTable } from "@workspace/db";
import {
  ListStylistsQueryParams,
  ListStylistsResponse,
  GetStylistParams,
  GetStylistResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stylists", async (req, res): Promise<void> => {
  const query = ListStylistsQueryParams.safeParse(req.query);
  let stylists = await db.select().from(stylistsTable);
  const salons = await db.select().from(salonsTable);
  const salonMap = Object.fromEntries(salons.map(s => [s.id, s.name]));

  if (query.success) {
    if (query.data.salonId) {
      stylists = stylists.filter(s => s.salonId === query.data.salonId);
    }
    if (query.data.specialty) {
      stylists = stylists.filter(s => s.specialty.toLowerCase().includes(query.data.specialty!.toLowerCase()));
    }
  }

  res.json(ListStylistsResponse.parse(stylists.map(s => ({
    ...s,
    salonName: salonMap[s.salonId] ?? null,
    rating: s.rating ?? 4.5,
  }))));
});

router.get("/stylists/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetStylistParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [stylist] = await db.select().from(stylistsTable).where(eq(stylistsTable.id, params.data.id));
  if (!stylist) {
    res.status(404).json({ error: "Stylist not found" });
    return;
  }
  const [salon] = await db.select().from(salonsTable).where(eq(salonsTable.id, stylist.salonId));
  res.json(GetStylistResponse.parse({
    ...stylist,
    salonName: salon?.name ?? null,
    rating: stylist.rating ?? 4.5,
  }));
});

export default router;
