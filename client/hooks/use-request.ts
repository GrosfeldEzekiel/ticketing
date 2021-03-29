import useSWR, { SWRConfiguration } from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useRequest = (url: string, options?: SWRConfiguration) => {
  const { data, error } = useSWR(url, fetcher, options);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useRequest;
