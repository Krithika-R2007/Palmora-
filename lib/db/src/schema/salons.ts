import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const salonsTable = pgTable("salons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  neighborhood: text("neighborhood").notNull(),
  description: text("description"),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  services: text("services").array().notNull().default([]),
  imageUrl: text("image_url"),
  priceRange: text("price_range").notNull().default("₹₹₹"),
  featured: boolean("featured").notNull().default(false),
  address: text("address"),
  phone: text("phone"),
  openingHours: text("opening_hours"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSalonSchema = createInsertSchema(salonsTable).omit({ id: true, createdAt: true });
export type InsertSalon = z.infer<typeof insertSalonSchema>;
export type Salon = typeof salonsTable.$inferSelect;
