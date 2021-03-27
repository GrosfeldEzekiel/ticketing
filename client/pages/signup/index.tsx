import { ChangeEvent, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Text from "../../components/Text";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <div className="p-10 md:w-6/12 w-10/12 bg-purple-100 rounded-md mx-auto mt-32 text-center">
      <Text variant="h1" text="Registrarse" />
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
        <Button text="Registrarse" />
      </form>
    </div>
  );
}
