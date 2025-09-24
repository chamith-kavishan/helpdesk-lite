import { atom, useAtom } from "jotai";

type User = { id: number; email: string; role: "user" | "admin" } | null;
const tokenAtom = atom<string | null>(localStorage.getItem("token"));
const userAtom = atom<User>(null);

export function useAuth() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);

  const saveToken = (t: string | null) => {
    setToken(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  };
  return { token, saveToken, user, setUser };
}
