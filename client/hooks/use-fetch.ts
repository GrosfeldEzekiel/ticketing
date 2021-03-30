import useSWR, { SWRConfiguration } from "swr";

const useFetch = (url: string, options?: SWRConfiguration) => {
  const { data, error } = useSWR(url, options);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetch;
