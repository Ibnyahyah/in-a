import { atom } from "recoil";

export type User = {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: string;
  token: string;
  access: boolean;
};

export const userState = atom<User>({
  key: "userState",
  default: {
    avatar: "",
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    role: "",
    token: "",
    access: true,
  },
});
