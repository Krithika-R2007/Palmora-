import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const stylistsTable = pgTable("stylists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  salonId: integer("salon_id").notNull(),
  specialty: text("specialty").notNull(),
  rating: real("rating").notNull().default(4.5),
  imageUrl: text("image_url"),
  bio: text("bio").notNull().default(""),
  experience: text("experience"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStylistSchema = createInsertSchema(stylistsTable).omit({ id: true, createdAt: true });
export type InsertStylist = z.infer<typeof insertStylistSchema>;
export type Stylist = typeof stylistsTable.$inferSelect;
