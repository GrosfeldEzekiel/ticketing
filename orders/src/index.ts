import { natsWrapper } from '@eg-ticketing/common';
import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './events/listeneres/expiration-complete';
import { PaymentCreatedListener } from './events/listeneres/payment-created';
import { TicketCreatedListener } from './events/listeneres/ticket-created';
import { TicketUpdatedListener } from './events/listeneres/ticket-updated';

const start = async () => {
	console.log('Starting Orders Service');
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}
	if (!process.env.NATS_SRV_PORT) {
		throw new Error('NATS_SRV_PORT must be defined');
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('NATS_CLUSTER_ID must be defined');
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('NATS_CLIENT_ID must be defined');
	}

	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_SRV_PORT!
		);
		natsWrapper.client.on('error', () => {
			console.log('Closing NATS!');
			process.exit();
		});

		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());

		new TicketCreatedListener(natsWrapper.client).listen();
		new TicketUpdatedListener(natsWrapper.client).listen();
		new ExpirationCompleteListener(natsWrapper.client).listen();
		new PaymentCreatedListener(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to Mongo DB');
	} catch (e) {
		console.error(e);
		process.exit(1);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000');
	});
};

start();
