import axios from 'axios';
import { GetServerSideProps } from 'next';
import Card from '../../components/Card';
import Text from '../../components/Text';

const Orders = ({ orders }) => {
	return (
		<>
			{orders.map((ord) => (
				<Card
					className="m-8"
					content={
						<div className="flex flex-row w-full items-center">
							<Text
								className="mr-3"
								variant="h2"
								color="black"
								text={ord.ticket.title}
							/>
							<Text className="mr-3" variant="h2" color="gray" text="-" />
							<Text variant="h2" color="gray" text={`$ ${ord.ticket.price}`} />
							{ord.status === 'cancelled' ? (
								<Text
									className="p-2 rounded-xl ml-auto place-content-end bg-pink-600"
									color="white"
									variant="h2"
									text={`Cancelada`}
								/>
							) : ord.status === 'complete' ? (
								<Text
									className="p-2 rounded-xl ml-auto place-content-end bg-green-600"
									color="white"
									variant="h2"
									text={`Completada`}
								/>
							) : (
								<Text
									className="p-2 rounded-xl ml-auto place-content-end bg-yellow-600"
									color="white"
									variant="h2"
									text={`Creada`}
								/>
							)}
						</div>
					}
				/>
			))}
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	try {
		const { data: orders } = await axios.get(
			`${process.env.API_URL}/api/orders`,
			{
				headers: req.headers,
			}
		);

		return {
			props: {
				orders: orders,
			},
		};
	} catch {
		return {
			notFound: true,
		};
	}
};

export default Orders;
