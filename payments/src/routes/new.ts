import {
	BadRequestError,
	natsWrapper,
	NotFoundError,
	OrderStatus,
	requireAuth,
	UnauthorizedError,
	validateRequest,
} from '@eg-ticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedpublisher } from '../events/publishers/payment-created';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
	'/api/payments',
	requireAuth,
	[body('token').notEmpty(), body('orderId').notEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;

		const order = await Order.findById(orderId);

		if (!order) throw new NotFoundError();

		if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

		if (order.status === OrderStatus.Cancelled)
			throw new BadRequestError('Order was cancelled');

		const charge = await stripe.charges.create({
			amount: order.price * 100,
			currency: 'usd',
			source: token,
		});

		const payment = Payment.build({
			orderId,
			stripeId: charge.id,
		});

		await payment.save();

		await new PaymentCreatedpublisher(natsWrapper.client).publish({
			id: payment.id,
			orderId: payment.orderId,
			stripeId: payment.id,
			version: payment.__v,
		});

		res.status(201).send({ id: payment.id });
	}
);

export { router as createChargeRouter };
