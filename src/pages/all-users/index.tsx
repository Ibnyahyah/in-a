import { userState } from "@/atoms/userAtom";
import AllUsersComponent, {
  AllUsersRowData,
} from "@/components/AllUsersComponent";
import Spinner from "@/components/Spinner";
import sendRequest from "@/handler";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const AllUsersIndex = () => {
  const user = useRecoilValue(userState);
  const [users, setUsers] = useState<[]>();
  const [error, setError] = useState(false);
  const data: AllUsersRowData[] = [];

  useEffect(() => {
    if (!user.token) return;
    sendRequest("GET", "", user.token, "user").then((res) => {
      console.log(res);
      if (res === "unauthorized user") return setError(true);
      setUsers(res.users);
    });
  }, [user.token]);

  users?.map((user: any) => {
    const formatted_data = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    data.push(formatted_data);
  });

  if (error) {
    return (
      <div className="flex justify-center h-[100%] items-center">
        <h2 className="font-bold">UNAUTHORIZED USER</h2>
      </div>
    );
  }

  if (data.length === 0) return <Spinner />;

  return (
    <>
      <h1 className="font-bold mb-6">All users</h1>
      <AllUsersComponent data={data} />
    </>
  );
};

export default AllUsersIndex;
