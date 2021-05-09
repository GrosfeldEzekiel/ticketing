import {
	natsWrapper,
	NotFoundError,
	OrderStatus,
	requireAuth,
	UnauthorizedError,
} from '@eg-ticketing/common';
import express, { Request, Response } from 'express';
import { OrderCancelledEventPublisher } from '../events/publishers/order-cancelled';
import { Order } from '../models/order';

const router = express.Router();

router.patch(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.orderId).populate('ticket');

		if (!order) throw new NotFoundError();

		if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

		order.status = OrderStatus.Cancelled;

		await order.save();

		new OrderCancelledEventPublisher(natsWrapper.client).publish({
			id: order.id,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.status(200).send(order);
	}
);

export { router as cancelOrderRouter };
