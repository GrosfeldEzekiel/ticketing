import { natsWrapper } from '@eg-ticketing/common';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete';

export interface Payload {
	orderId: string;
}

const connection = {
	host: process.env.REDIS_HOST,
	port: +process.env.REDIS_PORT!,
	password: process.env.REDIS_PASSWORD,
};

const expirationQueue = new Queue<Payload>('order:expiration', {
	connection,
	defaultJobOptions: {
		removeOnComplete: true,
	},
});

const expirationScheduler = new QueueScheduler(expirationQueue.name, {
	connection,
});

const expirationWorker = new Worker<Payload>(
	expirationQueue.name,
	async (job) => {
		new ExpirationCompletePublisher(natsWrapper.client).publish({
			orderId: job.data.orderId,
		});
	},
	{
		connection,
	}
);

export { expirationQueue, expirationWorker };
