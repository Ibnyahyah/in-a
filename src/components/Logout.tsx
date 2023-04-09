import { Button, Modal, Text } from "@mantine/core";
import { signOut } from "next-auth/react";

export default function Logout({
  logout,
  setLogout,
}: {
  logout: boolean;
  setLogout: (arg: boolean) => void;
}) {
  const logoutHandler = () => {
    localStorage.clear();
    signOut();
  };

  return (
    <>
      <Modal opened={logout} onClose={() => setLogout(false)} size="auto">
        <Text className="text-[20px]">Do you want to logout?</Text>
        <Button
          fullWidth
          className="bg-[#1c7ed6] mt-4 opacity-100 hover:opacity-75"
          onClick={logoutHandler}
        >
          Logout
        </Button>
      </Modal>
    </>
  );
}
