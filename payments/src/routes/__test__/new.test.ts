import { OrderStatus } from '@eg-ticketing/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import { getCookie } from '../../test/setup';

it('Expect error while purchasing an unexisting order', async () => {
	await request(app)
		.post('/api/payments')
		.set('Cookie', getCookie())
		.send({
			token: 'asdasdasf',
			orderId: mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404);
});

it('Expect error while purchasing an unbelonging order', async () => {
	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 10,
		userId: 'random',
		status: OrderStatus.Created,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', getCookie())
		.send({
			token: 'qewqeqw',
			orderId: order.id,
		})
		.expect(401);
});

it('Expect error while purchasing a cancelled order', async () => {
	const id = mongoose.Types.ObjectId().toHexString();
	const user = getCookie(id);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price: 10,
		userId: id,
		status: OrderStatus.Cancelled,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', user)
		.send({
			token: 'qewqeqw',
			orderId: order.id,
		})
		.expect(400);
});

it('Should successfully charge', async () => {
	const id = mongoose.Types.ObjectId().toHexString();
	const user = getCookie(id);

	const price = Math.floor(Math.random() * 10000);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price,
		userId: id,
		status: OrderStatus.Created,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', user)
		.send({
			token: 'tok_visa',
			orderId: order.id,
		})
		.expect(201);

	const charges = await stripe.charges.list({ limit: 50 });
	const charge = charges.data.find((c) => c.amount === price * 100);

	expect(charge).toBeDefined();
});

it('Should successfully add the stripe charge in DB', async () => {
	const id = mongoose.Types.ObjectId().toHexString();
	const user = getCookie(id);

	const price = Math.floor(Math.random() * 10000);

	const order = Order.build({
		id: mongoose.Types.ObjectId().toHexString(),
		price,
		userId: id,
		status: OrderStatus.Created,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', user)
		.send({
			token: 'tok_visa',
			orderId: order.id,
		})
		.expect(201);

	const charges = await stripe.charges.list({ limit: 50 });
	const charge = charges.data.find((c) => c.amount === price * 100);

	const payment = await Payment.findOne({
		stripeId: charge!.id,
		orderId: order.id,
	});

	expect(payment).not.toBeNull();

	expect(payment!.stripeId).toEqual(charge!.id);
});
