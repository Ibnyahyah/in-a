import { storage } from "@/config";
import sendRequest from "@/handler";
import {
  Box,
  Button,
  Container,
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
import { useRecoilValue } from "recoil";
import { userState } from "@/atoms/userAtom";
import { IconClipboard, IconCopy } from "@tabler/icons-react";

interface Register {
  avatar: File | null | string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string | null;
}

const CreateUserIndex = () => {
  const user = useRecoilValue(userState);
  const [imgValue, setImgValue] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{
    email: string;
    role: string;
    password: string;
  }>();

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
    setLoading(true);
    const imageRef = ref(storage, `profileImg/${values.email}/image`);
    await uploadBytesResumable(imageRef, imgValue!);
    const downloadURL = await getDownloadURL(imageRef);
    values.avatar = downloadURL;
    const res = await sendRequest(
      "POST",
      values,
      user.token,
      "user/create-a-new-admin"
    );
    console.log(res);
    setRegisteredUser(res._user);

    if (!res) {
      setLoading(false);
      return showNotification({
        message: "failed to register, pls try again!",
        autoClose: 2500,
        color: "red",
      });
    }

    showNotification({
      message: res.message,
      autoClose: 2500,
      color: "blue",
    });
    setLoading(false);
  };

  const copyHandler = () => {
    const text = document.getElementById("text")?.innerText ?? "";
    navigator.clipboard.writeText(text);

    showNotification({
      message: "user details copied to clipboard",
      autoClose: 2500,
      color: "blue",
    });
  };

  return (
    <>
      <Container className="" size="md" px="md">
        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          className="flex flex-col gap-4 w-[auto] lg:mx-10 my-6"
        >
          <h2 className="text-[23px] text-center font-bold">Register a user</h2>
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
                placeholder="inboxpeak"
                required
                value={form.values.username}
                onChange={(event) =>
                  form.setFieldValue("username", event.currentTarget.value)
                }
              />

              <TextInput
                label="Email"
                placeholder="you@inboxpeak.com"
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
                data={[
                  { value: "admin", label: "Admin" },
                  { value: "viewer", label: "Viewer" },
                  { value: "editor", label: "Editor" },
                ]}
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

            <Button
              fullWidth
              type="submit"
              className="bg-[#1c7ed6] mt-4"
              loading={loading}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>

      {registeredUser && (
        <Container className="" size="md" px="md">
          <Paper
            withBorder
            shadow="md"
            p={30}
            radius="md"
            className="flex flex-col gap-4 lg:mx-10 my-6"
          >
            <Box>
              <div className="flex justify-between">
                <h2 className="font-bold underline mb-2">User Details</h2>
                <IconClipboard
                  stroke="1"
                  className="cursor-pointer"
                  onClick={copyHandler}
                />
              </div>

              <div id="text">
                <p>
                  <span className="font-bold">EMAIL:</span>{" "}
                  {registeredUser.email}
                </p>
                <p>
                  <span className="font-bold">ROLE:</span> {registeredUser.role}
                </p>
                <p>
                  <span className="font-bold">PASSWORD:</span>{" "}
                  {registeredUser.password}
                </p>
              </div>
            </Box>
          </Paper>
        </Container>
      )}

      {/* <Container className="" size="md" px="md">
        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          className="flex flex-col gap-4 mx-10 my-6"
        >
          <Box>
            <div className="flex justify-between">
              <h2 className="font-bold underline mb-2">User Details</h2>
              <IconClipboard
                stroke="1"
                className="cursor-pointer"
                onClick={copyHandler}
              />
            </div>
            <div id="text">
              <p>
                <span className="font-bold">EMAIL:</span> {"email@email.com"}
              </p>
              <p>
                <span className="font-bold">ROLE:</span> {"admin"}
              </p>
              <p>
                <span className="font-bold">PASSWORD:</span> {"123456"}
              </p>
            </div>
          </Box>
        </Paper>
      </Container> */}
    </>
  );
};
export default CreateUserIndex;
