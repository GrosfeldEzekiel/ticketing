import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

jest.mock('@eg-ticketing/common', () => {
	const original = jest.requireActual('@eg-ticketing/common');

	return {
		__esmodule: true,
		...original,
		natsWrapper: {
			client: {
				publish: jest
					.fn()
					.mockImplementation(
						(subject: string, data: string, callback: () => void) => {
							callback();
						}
					),
			},
		},
	};
});

process.env.STRIPE_KEY =
	'sk_test_51IrPTAIjElOHUtmjzVqe6tCizRFY6PYU21dcCh6aHMQDr3195fThcHvCD3Pbvw4Y4zDlNx2gNCw6lbd8BYb1QIJQ00t9cezAOq';

beforeAll(async () => {
	process.env.JWT_KEY = 'random';

	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

export const getCookie = (id?: string) => {
	const sessionJSON = JSON.stringify({
		jwt: jwt.sign(
			{
				id: id ?? new mongoose.Types.ObjectId().toHexString(),
				email: 'test@test.com',
			},
			process.env.JWT_KEY!
		),
	});
	// Return Cookie string
	return [`express:sess=${Buffer.from(sessionJSON).toString('base64')}`];
};
