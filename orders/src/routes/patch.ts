import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnauthorizedError,
} from "@eg-ticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.patch(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    // Publish order cancelled event

    res.status(200).send(order);
  }
);

export { router as cancelOrderRouter };
