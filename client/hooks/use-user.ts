import useSWR from 'swr';
import { useRouter } from 'next/router';

const useUser = (goToLogin: boolean = false) => {
	const router = useRouter();
	const { data } = useSWR('/api/users/currentuser', {
		shouldRetryOnError: false,
		revalidateOnReconnect: false,
		dedupingInterval: 60 * 60 * 7,
		onError: () => {
			if (goToLogin) router.push('/signin');
		},
	});

	return {
		data: data,
	};
};

export default useUser;
