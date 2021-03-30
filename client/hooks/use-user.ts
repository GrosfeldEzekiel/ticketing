import useSWR from "swr";

const useUser = () => {
  const { data } = useSWR("api/users/currentuser", {
    shouldRetryOnError: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data,
  };
};

export default useUser;
