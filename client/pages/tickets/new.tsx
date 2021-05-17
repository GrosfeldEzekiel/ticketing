import useUser from '../../hooks/use-user';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { ChangeEvent, useState } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const newTicket = () => {
	useUser(true);
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState<number>(null);
	const { doRequest, errors } = useRequest({
		url: '/api/tickets',
		method: 'post',
		body: {
			title,
			price,
		},
		onSuccess: () => router.push('/'),
	});
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
		if (!loading) {
			setLoading(true);

			e.preventDefault();

			await doRequest();
		}

		setLoading(false);
	};

	return (
		<div className="p-10 md:w-6/12 w-10/12 bg-purple-50 rounded-md mx-auto mt-24 text-center">
			<Text variant="h1" text="Crear un nuevo ticket" marginBottom={5} />
			<form onSubmit={onSubmit}>
				<div className="p-3">
					<Input
						type="text"
						placeholder="Título"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="p-3">
					<Input
						type="number"
						placeholder="Precio"
						value={price ?? ''}
						onChange={(e) => setPrice(+e.target.value)}
					/>
				</div>
				{errors}
				<Button
					text="Crear Ticket"
					loading={loading}
					disabled={loading}
					className="mt-4"
				/>
			</form>
		</div>
	);
};

export default newTicket;
