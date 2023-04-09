import { userState } from "@/atoms/userAtom";
import { Drag } from "@/components/Drag";
import { storage } from "@/config";
import sendRequest from "@/handler";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Input,
  Loader,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconMail } from "@tabler/icons-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useRecoilValue } from "recoil";

type settingsProps = {};

interface Reset {
  avatar: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

const Settings: React.FC<settingsProps> = () => {
  const user = useRecoilValue(userState);
  const [imgValue, setImgValue] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const form = useForm<Reset>({
    initialValues: {
      first_name: user ? user.first_name : "",
      last_name: user ? user.last_name : "",
      email: user ? user.email : "",
      username: user ? user.username : "",
      avatar: user ? user.avatar : "",
    },
  });

  const passwordForm = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validate: {
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const submitHandler = async (values: Reset) => {
    setLoading(true);

    if (imgValue.length > 0) {
      const imageRef = ref(storage, `profileImg/${values.email}/image`);
      await uploadBytesResumable(imageRef, imgValue[0]);
      const downloadURL = await getDownloadURL(imageRef);
      values.avatar = downloadURL;
    }

    const res = await sendRequest("PATCH", values, user?.token!, "user/update");

    showNotification({
      message: res.message,
      autoClose: 2500,
      color: "blue",
    });

    console.log(res);

    // const event = new Event("visibilitychange");
    // document.dispatchEvent(event);

    localStorage.setItem("user", JSON.stringify(res._user));
    setLoading(false);
  };

  const passwordSubmitHandler = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      return showNotification({
        message: "Passwords does not match",
        autoClose: 2500,
        color: "red",
      });
    }

    if (password.length < 6)
      return showNotification({
        message: "Passwords must be greater than 6 characters",
        autoClose: 2500,
        color: "red",
      });

    setPassLoading(true);

    const res = await sendRequest(
      "PATCH",
      { new_password: password },
      user?.token!,
      "user/change-password"
    );

    if (!res)
      return showNotification({
        message: "failed to update, pls try again!",
        autoClose: 2500,
        color: "red",
      });

    showNotification({
      message: res.message,
      autoClose: 2500,
      color: "blue",
    });

    setPassLoading(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loader />
      </div>
    );
  }

  return (
    <section>
      <h3 className="font-bold text-[20px]">Profile Info</h3>
      <p className="text-[#228be6] text-[13px]">
        update your profile details here
      </p>

      <Container size="sm" className="my-6 bg-[#fafafa] py-8">
        <form onSubmit={form.onSubmit((values) => submitHandler(values))}>
          <SimpleGrid cols={2}>
            <Input.Wrapper label="First name">
              <Input
                placeholder="John"
                {...form.getInputProps("first_name")}
                name="first_name"
              />
            </Input.Wrapper>
            <Input.Wrapper label="Last name">
              <Input placeholder="Doe" {...form.getInputProps("last_name")} />
            </Input.Wrapper>

            <Input.Wrapper label="Email">
              <Input
                icon={<IconMail stroke="1.1" />}
                placeholder="inboxpeak@hello.io"
                {...form.getInputProps("email")}
              />
            </Input.Wrapper>

            <Input.Wrapper label="username">
              <Input
                placeholder="inboxpeak"
                {...form.getInputProps("username")}
              />
            </Input.Wrapper>
          </SimpleGrid>

          <div className="mt-8 flex gap-4">
            <Avatar src={user?.avatar} radius="xl" size={50} />
            <Drag setImgValue={setImgValue} />
          </div>

          <Divider className="my-6" />

          <div className="flex gap-4 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button
              className="bg-[#228be6] text-[#fff] opacity-100 hover:opacity-80 hover:bg-[#228be6]"
              type="submit"
              loading={loading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Container>

      <Container size="sm" className="my-6 bg-[#fafafa] py-8">
        <h3 className="font-bold text-[17px]">Change password</h3>
        <div className="mt-4">
          <form
            onSubmit={passwordForm.onSubmit((values) =>
              passwordSubmitHandler(values)
            )}
          >
            <SimpleGrid cols={2}>
              <TextInput
                label="new password"
                type="password"
                {...passwordForm.getInputProps("password")}
              />
              <TextInput
                label="confirm new password"
                type="password"
                {...passwordForm.getInputProps("confirmPassword")}
              />
            </SimpleGrid>
            <div className="flex gap-4 justify-end mt-4">
              <Button
                className="bg-[#228be6] text-[#fff] opacity-100 hover:opacity-80 hover:bg-[#228be6]"
                type="submit"
                loading={passLoading}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};
export default Settings;
