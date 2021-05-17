import axios from 'axios';
import { useState } from 'react';

export interface Request {
	url: string;
	method: 'post' | 'get';
	body?: object;
	onSuccess(data?: any): void;
}

const useRequest = ({ url, method, body, onSuccess }: Request) => {
	const [errors, setErrors] = useState(null);

	const doRequest = async (props = {}) => {
		try {
			const response = await axios[method](url, { ...body, ...props });
			onSuccess(response.data);
		} catch (e) {
			setErrors(
				<div className="md:w-96 md:-ml-48 w-56 -ml-28 text-center rounded-md fixed z-50 left-1/2 bottom-7 bg-red-400">
					<ul className="p-2">
						{e?.response?.data?.errors?.map((e) => (
							<li key={e.message} className="text-red-100 my-2">
								{e.message}
							</li>
						))}
					</ul>
				</div>
			);

			setTimeout(() => setErrors(null), 5000);
		}
	};

	return { doRequest, errors };
};

export default useRequest;
