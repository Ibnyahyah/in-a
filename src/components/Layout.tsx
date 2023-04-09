import { User, userState } from "@/atoms/userAtom";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Logout from "./Logout";
import HeaderComponent from "./SideBar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const { pathname } = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  // const { data: session, status } = useSession();
  // console.log(session);

  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("user") as string);
    setUser(user);
  }, [setUser]);

  if (user === null && pathname !== "/login") {
    signOut();
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="inbox-peak">
      <div className={`side-bar ${showSidebar ? "show" : ""}`}>
        {pathname !== "/login" && pathname !== "/register" && (
          <HeaderComponent toggle={toggleSidebar} />
        )}
      </div>

      {pathname !== "/login" && pathname !== "/register" && (
        <div
          className="hamburger cursor-pointer absolute right-0 pr-4"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </div>
      )}

      <main
        className={`${
          pathname === "/login" || pathname === "/register" ? "" : "p-4"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
