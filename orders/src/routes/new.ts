import {
	BadRequestError,
	natsWrapper,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@eg-ticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/order-created';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const router = express.Router();

router.post(
	'/api/orders',
	requireAuth,
	[
		body('ticketId')
			.notEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('Ticket Id must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);

		if (!ticket) throw new NotFoundError();

		const isReserved = await ticket.isReserved();

		if (isReserved) throw new BadRequestError('Ticket is alredy reserved');

		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket,
		});

		await order.save();

		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			status: order.status,
			expiresAt: order.expiresAt.toISOString(),
			userId: order.userId,
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
		});

		res.status(201).send(order);
	}
);

export { router as newOrderRouter };
