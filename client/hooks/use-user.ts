import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useUser = () => {
  const { data, error } = useSWR("api/users/currentuser", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUser;
