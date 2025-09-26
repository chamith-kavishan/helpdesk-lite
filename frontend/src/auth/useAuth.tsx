import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import Cookies from "js-cookie";

type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

const tokenAtom = atomWithStorage<string | null>(
  "auth:token",
  Cookies.get("token") ?? null
);
const userAtom = atomWithStorage<User>("auth:user", null);

export function useAuth() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);

  const saveToken = (t: string | null) => {
    setToken(t);
    if (t) Cookies.set("token", t, { expires: 7 });
    else Cookies.remove("token");
  };

  return { token, saveToken, user, setUser };
}
