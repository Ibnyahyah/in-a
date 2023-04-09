import {
  Box,
  Button,
  Checkbox,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useState } from "react";

import { signIn } from "next-auth/react";
import config from "../../auth";
import { showNotification } from "@mantine/notifications";
import { User, userState } from "@/atoms/userAtom";
import { useSetRecoilState } from "recoil";

type NewLoginProps = {};
const Login: React.FC<NewLoginProps> = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userState);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const submitHandler = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const data = await config(values.email, values.password);
      console.log(data);

      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        callbackUrl: "/",
      });
      console.log(res);

      if (res?.error) {
        showNotification({
          message: res.error,
          autoClose: 2500,
          color: "blue",
        });
        localStorage.clear();
        setLoading(false);
        return;
      }

      showNotification({
        message: data.message,
        autoClose: 2500,
        color: "blue",
      });

      if (!data._user) return;
      localStorage.setItem("user", JSON.stringify(data._user));
      setUser(data._user as User);
      setLoading(false);
    } catch (error) {
      console.log("login error", error);
      setLoading(false);
    }
  };

  return (
    <Box className="wrapper">
      <Flex className="login-card flex-col items-center">
        <Box className="circle-box">
          <div className="circle-box-2">
            <div className="circle-box-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="18"
                fill="none"
                viewBox="0 0 30 18"
              >
                <g clipPath="url(#clip0_11012_450125)">
                  <path
                    fill="#fff"
                    d="M14.766 14.118a12.571 12.571 0 01-7.253-2.358c-2.438-1.746-4.087-4.315-4.612-7.184 0-.191-.06-.382-.087-.54a1.233 1.233 0 01.042-.547c.054-.177.148-.341.275-.48.127-.14.284-.252.46-.328.176-.076.368-.115.561-.115h.625c.474 2.184 1.727 4.142 3.544 5.54a10.67 10.67 0 006.385 2.167c5.585.116 11.022-4.626 14.497-9.808a1.213 1.213 0 00-.426-.34A1.27 1.27 0 0028.238 0H1.26a1.29 1.29 0 00-.89.353A1.178 1.178 0 000 1.204v15.538c0 .32.133.626.369.852.236.226.556.353.89.353h26.98c.168.004.335-.024.492-.082.157-.059.3-.147.42-.26a1.157 1.157 0 00.381-.863V3.455c-4.612 7.665-9.875 10.663-14.766 10.663z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_11012_450125">
                    <path fill="#fff" d="M0 0H29.533V18H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </Box>

        <div className="flex flex-col w-[100%]">
          <h1 className="mb-5 font-bold text-[2rem] text-center">
            Admin Login
          </h1>

          <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
            <Stack className="gap-8" id="stack">
              <TextInput
                required
                withAsterisk={false}
                label="Email"
                placeholder="Enter your email"
                id="login-email"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
              />

              <div className="pwd">
                <PasswordInput
                  required
                  withAsterisk={false}
                  label="Password"
                  id="password"
                  placeholder="Your password"
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue("password", event.currentTarget.value)
                  }
                  error={
                    form.errors.password &&
                    "Password should include at least 6 characters"
                  }
                />
              </div>
              <Link href="/" className="fgt">
                Forgot password?
              </Link>

              <Checkbox
                label="Keep me logged in for 30 days"
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
            </Stack>

            <Flex mt="xl" justify="center">
              <Button
                type="submit"
                variant="subtle"
                className="btn-login opacity-100 hover:opacity-80"
                loading={loading}
              >
                Login
              </Button>
            </Flex>
          </form>
        </div>
      </Flex>
    </Box>
  );
};

export default Login;
