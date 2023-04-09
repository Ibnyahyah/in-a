import { userState } from "@/atoms/userAtom";
import Spinner from "@/components/Spinner";
import { Button, Image } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

type UserIdProps = {};

interface User {
  access: boolean;
  avatar: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
  updatedAt: string;
  username: string;
  __v: number;
  _id: string;
}

const UserId: React.FC<UserIdProps> = () => {
  const { token } = useRecoilValue(userState);
  const { query, push } = useRouter();
  const { id } = query;
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (!token || !id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://inbox-peak.cyclic.app/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data);
        setUser(data);
      } catch (error) {
        console.log("getUserById Error", error);
      }
    };
    fetchData();
  }, [id, token]);

  const deleteHandler = async () => {
    try {
      const res = await fetch(`https://inbox-peak.cyclic.app/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      push("/all-users");
    } catch (error) {
      console.log("deleteUser Error", error);
    }
  };

  const blockHandler = async () => {
    try {
      const res = await fetch(
        `https://inbox-peak.cyclic.app/user/revoke-access/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log("blockUser Error", error);
    }
  };

  if (!user) return <Spinner />;

  return (
    <section>
      <article className="flex gap-8 items-center">
        <div className="w-[300px]">
          <Image
            src={user.avatar}
            alt={user.first_name}
            width="100"
            height="100"
            style={{ borderRadius: "20px" }}
          />
        </div>

        <aside>
          <h1 className="text-[25px]">
            <span className="font-bold">Full Name: </span>
            {user.first_name} {user.last_name}
          </h1>

          <h1 className="text-[25px]">
            <span className="font-bold">Username: </span>
            {user.username}
          </h1>

          <h1 className="text-[25px]">
            <span className="font-bold">Email: </span>
            {user.email}
          </h1>

          <h1 className="text-[25px]">
            <span className="font-bold">Role: </span>
            {user.role}
          </h1>

          <div className="flex gap-6 items-center mt-10">
            <Button color="red" variant="outline" onClick={blockHandler}>
              {user.access ? "Block" : "Unblock"}
            </Button>

            <Button color="red" variant="outline" onClick={deleteHandler}>
              Delete
            </Button>
          </div>
        </aside>
      </article>
    </section>
  );
};
export default UserId;
