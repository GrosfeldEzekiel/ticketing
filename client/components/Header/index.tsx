import { useEffect, useState } from "react";
import useUser from "../../hooks/use-user";
import Link from "../Link";

export default function Header(props) {
  /* const { data, isLoading, isError } = useUser();

  if (data) {
    return <h1>Logeado</h1>;
  }
  return <h1>Deslogeado</h1>; */
  return (
    <div className="bg-purple-600 max-h-32 py-5 sm:py-9 px-6 w-full items-center flex-col flex sm:flex-row">
      <div className="">
        <Link
          href="/"
          text="Ticketing"
          color="white"
          className="text-2xl tracking-wide"
        />
      </div>
      <div className="sm:right-6 sm:float-right sm:absolute sm:mt-0 mt-6 block space-x-8">
        <Link href="/signin" text="Iniciar Sesión" color="white" />
        <Link href="/signup" text="Registrarse" color="white" />
      </div>
    </div>
  );
}
