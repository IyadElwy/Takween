import {
  Navbar, NavbarBrand, NavbarContent, DropdownTrigger, Dropdown,
  DropdownItem, DropdownMenu, User,

} from "@nextui-org/react";
import Link from "next/link";

import Image from "next/image";
import styles from "../../../styles/components/Reusable/navbar.module.css";
import Logo from "../logo";

export default function NavBar({
  drawerState, setDrawerState, breadcrumbs = [], createProjectTrigger,
  showCreateProjectButton = true,
}) {
  return (
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
              description="@admin"
              name="John Doe"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">@admin</p>
            </DropdownItem>
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

            {/* <DropdownItem key="settings">
              My Settings
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem> */}
          </DropdownMenu>
        </Dropdown>

      </NavbarContent>
    </Navbar>
  );
}
