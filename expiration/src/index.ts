import { natsWrapper } from '@eg-ticketing/common';
import { OrderCreatedListener } from './events/listeners/order-created';

const start = async () => {
	console.log('Starting Expiration Service');
	if (!process.env.NATS_SRV_PORT) {
		throw new Error('NATS_SRV_PORT must be defined');
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('NATS_CLUSTER_ID must be defined');
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('NATS_CLIENT_ID must be defined');
	}
	if (!process.env.REDIS_HOST) {
		throw new Error('REDIS_HOST must be defined');
	}
	if (!process.env.REDIS_PORT) {
		throw new Error('REDIS_PORT must be defined');
	}
	if (!process.env.REDIS_PASSWORD) {
		throw new Error('REDIS_PASSWORD must be defined');
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

		new OrderCreatedListener(natsWrapper.client).listen();
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
};

start();
