import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  CreateProductBody,
  GetProductParams,
  GetProductResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const query = ListProductsQueryParams.safeParse(req.query);
  let products = await db.select().from(productsTable);

  if (query.success) {
    if (query.data.category) {
      products = products.filter(p => p.category.toLowerCase() === query.data.category!.toLowerCase());
    }
    if (query.data.featured !== undefined) {
      products = products.filter(p => p.featured === query.data.featured);
    }
  }

  res.json(ListProductsResponse.parse(products.map(p => ({
    ...p,
    rating: p.rating ?? 4.0,
    featured: p.featured ?? false,
  }))));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db.insert(productsTable).values({
    ...parsed.data,
    featured: parsed.data.featured ?? false,
  }).returning();
  res.status(201).json(GetProductResponse.parse({
    ...product,
    rating: product.rating ?? 4.0,
    featured: product.featured ?? false,
  }));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(GetProductResponse.parse({
    ...product,
    rating: product.rating ?? 4.0,
    featured: product.featured ?? false,
  }));
});

export default router;
