import { userState } from "@/atoms/userAtom";
import {
  Avatar,
  createStyles,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import Logout from "../Logout";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    minWidth: "15rem",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export function UserButton({ icon }: UserButtonProps) {
  const user = useRecoilValue(userState);
  const { classes } = useStyles();
  const [logout, setLogout] = useState(false);

  function maskEmail(email: string) {
    if (!email) return;

    const split = email.split("@");
    const firstThreeChars = email.substring(0, 3);
    const maskedChars = "...";
    const maskedEmail = `${firstThreeChars}${maskedChars}${split[1].slice(2)}`;

    return maskedEmail;
  }

  return (
    <>
      <Logout logout={logout} setLogout={setLogout} />
      <UnstyledButton className={classes.user} onClick={() => setLogout(true)}>
        <Group>
          <Avatar src={user?.avatar} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {user?.username}
            </Text>

            <Text color="dimmed" size="xs">
              {maskEmail(user?.email)}
            </Text>
          </div>

          {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
        </Group>
      </UnstyledButton>
    </>
  );
}
