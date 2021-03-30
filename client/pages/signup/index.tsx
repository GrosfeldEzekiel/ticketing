import { useRouter } from "next/router";
import SignForm from "../../components/SignForm";
import useUser from "../../hooks/use-user";

export default function Signup() {
  const router = useRouter();
  const { data } = useUser();

  if (data) router.back();
  return <SignForm type="signup" title="Registrarse" />;
}
