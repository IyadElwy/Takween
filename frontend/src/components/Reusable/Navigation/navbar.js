import {
  Navbar, NavbarBrand, NavbarContent, DropdownTrigger, Dropdown,
  DropdownItem, DropdownMenu, User, DropdownSection,

} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";

import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import styles from "../../../styles/components/Reusable/navbar.module.css";
import Logo from "../logo";
import AxiosWrapper from "../../../utils/axiosWrapper";

export default function NavBar({
  drawerState, setDrawerState, breadcrumbs = [], createProjectTrigger,
  showCreateProjectButton = true,
}) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = (await AxiosWrapper.get("http://127.0.0.1:8000/currentuser")).data;
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  return !user ? <p>Loading...</p> : (
    <Navbar maxWidth="2xl" isBordered isBlurred>
      <NavbarBrand>
        <Image
          className={styles.burgerMenu}
          onClick={() => setDrawerState(!drawerState)}
          style={{
            marginRight: "20px",
          }}
          src="/icons/burger-menu.svg"
          height={40}
          width={40}
          alt="Logo"
        />
        <Logo spin height={50} width={50} />
        <p className="font-bold text-inherit">MML</p>
        <div style={{ marginLeft: "50px" }} className="flex">
          {breadcrumbs.map((crumb, index) => (
            <div key={`${crumb.text}-div`} className="flex">
              {index === breadcrumbs.length - 1 ? (
                <p
                  key={`${crumb.text}-p1`}
                  className={styles.breadcrumb}
                >
                  {crumb.text}

                </p>
              )
                : (
                  <>
                    <Link key={`${crumb.text}-link`} href={crumb.href}>
                      <p
                        key={`${crumb.text}-p1`}
                        className={styles.breadcrumb}
                      >
                        {crumb.text}

                      </p>
                    </Link>
                    <p
                      key={`${crumb.text}-p2`}
                      style={{ marginRight: "10px" }}
                    >
                      {" "}
                      /
                      {" "}

                    </p>
                  </>

                )}

            </div>
          ))}
        </div>

      </NavbarBrand>

      <NavbarContent as="div" justify="end">

        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                // src: "avatar",
              }}
              className="transition-transform"
              description={user.email}
              name={`${user.first_name} ${user.last_name}`}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{user.email}</p>
            </DropdownItem>
            <DropdownSection aria-label="Profile & Actions" showDivider>

              {showCreateProjectButton && (
              <DropdownItem
                key="new_project"
                onPress={createProjectTrigger}
                endContent={(
                  <Image
                    height={18}
                    alt="Card background"
                    className="object-cover"
                    src="/images/plus.svg"
                    width={18}
                  />
              )}
              >
                New Project
              </DropdownItem>
              )}
              <DropdownItem
                key="dashboard"
                onPress={() => {
                  router.push("/home/projects");
                }}
              >
                Dashboard
              </DropdownItem>

            </DropdownSection>
            <DropdownItem
              key="logout"
              color="danger"
              onPress={() => {
                Cookies.remove("accessToken");
                router.push("/");
              }}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

      </NavbarContent>
    </Navbar>
  );
}
