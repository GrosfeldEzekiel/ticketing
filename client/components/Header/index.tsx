import { useRouter } from 'next/router';
import { mutate } from 'swr';
import useRequest from '../../hooks/use-request';
import useUser from '../../hooks/use-user';
import Link from '../Link';

export default function Header(props) {
	const { data } = useUser();
	const router = useRouter();
	const { doRequest } = useRequest({
		url: '/api/users/signout',
		method: 'post',
		body: {},
		onSuccess: async () => {
			router.push('/');
		},
	});

	return (
		<div className="bg-purple-600 max-h-32 py-5 sm:py-9 px-6 w-full text-center items-center flex-col flex sm:flex-row">
			<div className="">
				<Link
					href="/"
					text="Ticketing"
					color="white"
					className="text-2xl tracking-wide"
				/>
			</div>
			<div className="sm:right-6 sm:float-right sm:absolute sm:mt-0 mt-6 block space-x-8">
				{data ? (
					<>
						<Link href="/orders" text="Mis compras" color="white" />
						<Link href="/tickets/new" text="Vender" color="white" />
						<Link
							onClick={async () => {
								await doRequest();
								mutate('/api/users/currentuser', null);
							}}
							text="Salir"
							color="white"
						/>
					</>
				) : (
					<>
						<Link href="/signin" text="Iniciar Sesión" color="white" />
						<Link href="/signup" text="Registrarse" color="white" />
					</>
				)}
			</div>
		</div>
	);
}
