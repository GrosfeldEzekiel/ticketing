import { useRouter } from "next/router";
import SignForm from "../../components/SignForm";
import useUser from "../../hooks/use-user";

export default function Signin() {
  const router = useRouter();
  const { data } = useUser();

  if (data) router.back();

  return <SignForm type="signin" title="Iniciar Sesión" />;
}
