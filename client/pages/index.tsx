import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import Card from '../components/Card';
import Text from '../components/Text';
import useFetch from '../hooks/use-fetch';

const App = () => {
	const { data: tickets, isLoading } = useFetch('/api/tickets', {
		refreshInterval: 5,
	});
	const router = useRouter();

	if (isLoading) return <h1>Cargando...</h1>;

	if (tickets.filter((t) => !t.orderId).length < 1) {
		return (
			<div className="text-center m-12 p-5">
				<Text variant="h1" text="No hay tickets disponibles" />
			</div>
		);
	}
	return (
		<>
			<div className="flex md:flex-wrap xs:flex-col place-content-center">
				{tickets
					.filter((t) => !t.orderId)
					.map((ticket) => (
						<Card
							key={ticket.id}
							className="md:w-3/12 w-full m-5 p-4 text-center"
							header={
								<Text
									variant="h1"
									color="black"
									className="font-bold"
									text={ticket.title}
								/>
							}
							content={
								<Text variant="h2" color="gray" text={`$ ${ticket.price}`} />
							}
							footer={
								<Button
									disabled={ticket.orderId}
									onClick={() => router.push(`/tickets/${ticket.id}`)}
									text="Ver"
								/>
							}
						/>
					))}
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	try {
		await axios.get(`${process.env.API_URL}/api/users/currentuser`, {
			headers: req.headers,
		});
		return {
			props: {
				loggedIn: true,
			},
		};
	} catch {
		return {
			props: {
				loggedIn: false,
			},
		};
	}
};

export default App;
