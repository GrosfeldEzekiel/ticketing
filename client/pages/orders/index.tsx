import Card from '../../components/Card';
import Text from '../../components/Text';
import useFetch from '../../hooks/use-fetch';

const Orders = () => {
	const { data: orders } = useFetch('/api/orders');
	if (!orders) return null;
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

export default Orders;
