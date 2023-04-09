import { storage } from "@/config";
import sendRequest from "@/handler";
import {
  Button,
  FileInput,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";

import auth from "/public/auth-pic.svg";

interface Register {
  avatar: File | null | string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string | null;
}

export default function AuthenticationTitle() {
  const [imgValue, setImgValue] = useState<File | null>(null);

  const form = useForm<Register>({
    initialValues: {
      avatar: "",
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      role: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const submitHandler = async (values: Register) => {
    const imageRef = ref(storage, `profileImg/${values.email}/image`);
    await uploadBytesResumable(imageRef, imgValue!);
    const downloadURL = await getDownloadURL(imageRef);
    values.avatar = downloadURL;

    const res = await sendRequest("POST", values, "", "user/register");

    if (!res)
      return showNotification({
        message: "failed to register, pls try again!",
        autoClose: 2500,
        color: "red",
      });

    showNotification({
      message: res.message,
      autoClose: 2500,
      color: "blue",
    });
  };

  return (
    <SimpleGrid
      cols={2}
      breakpoints={[{ maxWidth: 755, cols: 1, spacing: "lg" }]}
      className="lg:p-10"
    >
      <Paper
        withBorder
        shadow="md"
        p={30}
        radius="md"
        className="flex flex-col gap-4 w-[auto] mx-10 my-6"
      >
        <h2 className="text-[25px] text-center font-bold">Register</h2>
        <form
          onSubmit={form.onSubmit((values) => submitHandler(values))}
          className="flex flex-col gap-4"
        >
          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: 755, cols: 1, spacing: "sm" }]}
          >
            <TextInput
              label="First Name"
              placeholder="John"
              required
              value={form.values.first_name}
              onChange={(event) =>
                form.setFieldValue("first_name", event.currentTarget.value)
              }
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              required
              value={form.values.last_name}
              onChange={(event) =>
                form.setFieldValue("last_name", event.currentTarget.value)
              }
            />
          </SimpleGrid>

          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: 755, cols: 1, spacing: "sm" }]}
          >
            <TextInput
              label="Username"
              placeholder="mantine"
              required
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
            />

            <TextInput
              label="Email"
              placeholder="you@mantine.dev"
              required
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
            />
          </SimpleGrid>

          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: 755, cols: 1, spacing: "sm" }]}
          >
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
            />
            <Select
              label="Role"
              placeholder="Pick one"
              required
              data={[{ value: "admin", label: "Admin" }]}
              value={form.values.role}
              onChange={(value) => form.setFieldValue("role", value)}
            />
          </SimpleGrid>

          <FileInput
            placeholder="Upload avatar"
            accept="image/png,image/jpeg"
            label="Avatar"
            withAsterisk
            required
            onChange={(file) => {
              setImgValue(file);
              if (file) {
                form.setFieldValue("avatar", file);
              }
            }}
          />

          <Button fullWidth type="submit" className="bg-[#1c7ed6] mt-4">
            Register
          </Button>
        </form>
        <Link href="/login" className="text-[10pt]">
          Already have an account? <span className="text-[blue]">Login</span>
        </Link>
      </Paper>

      <div className="items-center w-[100%] hidden lg:flex">
        <Image src={auth} alt="auth" />
      </div>
    </SimpleGrid>
  );
}
