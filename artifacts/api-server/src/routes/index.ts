import { Router, type IRouter } from "express";
import healthRouter from "./health";
import salonsRouter from "./salons";
import stylistsRouter from "./stylists";
import bookingsRouter from "./bookings";
import productsRouter from "./products";
import reviewsRouter from "./reviews";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(salonsRouter);
router.use(stylistsRouter);
router.use(bookingsRouter);
router.use(productsRouter);
router.use(reviewsRouter);
router.use(dashboardRouter);

export default router;
