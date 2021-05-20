import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { mutate } from 'swr';
import Button from '../../components/Button';
import Text from '../../components/Text';
import useFetch from '../../hooks/use-fetch';
import useRequest from '../../hooks/use-request';
import useUser from '../../hooks/use-user';

const Order = () => {
	const router = useRouter();
	const { id } = router.query;
	if (!id) return null;
	const { data: user } = useUser(true);
	const { data: order } = useFetch(`/api/orders/${id}`);

	if (!order) return null;

	const [payed, setPayed] = useState(false);

	useEffect(() => {
		if (order.status === 'complete') setPayed(true);
	}, [order]);

	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id,
		},
		onSuccess: async () =>
			await mutate(
				`/api/orders/${id}`,
				{ ...order, status: 'complete' },
				false
			),
	});

	const [loading, setLoading] = useState(false);

	const [timeLeft, setTimeLeft] = useState(1);

	useEffect(() => {
		const findTimeLeft = () => {
			//@ts-ignore
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};
		findTimeLeft();
		const intervalId = setInterval(findTimeLeft, 1000);

		return () => clearInterval(intervalId);
	}, []);

	const pay = async (token: string) => {
		if (!loading) {
			setLoading(true);
			await doRequest({ token });
		}
		setLoading(false);
	};

	if (payed) {
		return (
			<div className="text-center m-12 p-5">
				<Text
					variant="h1"
					text={'El ticket fue comprado satisfactoriamente!'}
				/>
			</div>
		);
	}

	if (timeLeft <= 0) {
		return (
			<div className="text-center m-12 p-5">
				<Text variant="h1" text={'La orden expiró'} />
			</div>
		);
	}

	return (
		<div className="p-10 xs:text-center">
			<Text
				variant="h1"
				className="text-4xl font-bold"
				text={order.ticket.title}
			/>
			<Text
				variant="h2"
				className="mt-6"
				color="gray"
				text={`Precio: $ ${order.ticket.price}`}
			/>
			<Text
				variant="h2"
				className="mt-6"
				color="gray"
				text={`Quedan ${timeLeft} segundos`}
			/>
			<StripeCheckout
				stripeKey="pk_test_51IrPTAIjElOHUtmj5htw9HoWzNIahSEDrqYBEfHPe3GtMFPqx0Ufzew0wdxhrYBF2Q6kDY8LcUmiOKEQ3HHkmRey00gtSYdqy4"
				token={(token) => pay(token.id)}
				amount={order.ticket.price * 100}
				currency="USD"
				email={user?.currentUser?.email}
				bitcoin={true}
				children={
					<Button
						loading={loading}
						disabled={loading}
						text="Pagar"
						className="sm:ml-0 mt-7"
					/>
				}
			/>
			{errors}
		</div>
	);
};

export default Order;
