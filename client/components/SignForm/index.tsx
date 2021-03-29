import { ChangeEvent, useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-sign-request";
import Text from "../../components/Text";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { mutate } from "swr";

interface SignProps {
  type: "signin" | "signup";
  title: string;
}

export default function SignForm({ type, title }: SignProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { doRequest, errors } = useRequest({
    url: `/api/users/${type}`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    setLoading(false);
  }, [errors]);

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    if (!loading) {
      setLoading(true);

      e.preventDefault();

      await doRequest();

      mutate("api/users/currentuser");
    }
    setLoading(false);
  };

  return (
    <div className="p-10 md:w-6/12 w-10/12 bg-purple-50 rounded-md mx-auto mt-24 text-center">
      <Text variant="h1" text={title} marginBottom={5} />
      <form onSubmit={onSubmit}>
        <div className="p-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="p-3">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors}
        <Button
          text={title}
          loading={loading}
          disabled={loading}
          className="mt-4"
        />
      </form>
    </div>
  );
}
