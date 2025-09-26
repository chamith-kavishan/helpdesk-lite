export interface User {
  id: number;
  name: number;
  email: string;
  role: "user" | "admin";
}

export interface UserOption {
  value: string;
  label: string;
}
