import {
	BadRequestError,
	natsWrapper,
	NotFoundError,
	requireAuth,
	UnauthorizedError,
	validateRequest,
} from '@eg-ticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title').notEmpty().withMessage('Title required'),
		body('price').isFloat({ gt: 0 }).withMessage('Price must be grater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;
		const ticket = await Ticket.findById(req.params.id);
		if (!ticket) throw new NotFoundError();

		if (ticket.userId !== req.currentUser!.id) throw new UnauthorizedError();

		if (ticket.orderId)
			throw new BadRequestError('The ticket is currently reserved');

		ticket.set({
			title,
			price,
		});

		await ticket.save();

		new TicketUpdatedPublisher(natsWrapper.client).publish({
			version: ticket.__v as number,
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
		});

		res.send(ticket);
	}
);

export { router as editTicketRouter };
