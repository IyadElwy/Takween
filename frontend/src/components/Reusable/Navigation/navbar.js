import {
  Navbar, NavbarBrand, NavbarContent, DropdownTrigger, Dropdown, Avatar,

} from "@nextui-org/react";
import Link from "next/link";

import Image from "next/image";
import styles from "../../../styles/components/Reusable/navbar.module.css";
import GhostButton from "../ghostButton";
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

        {showCreateProjectButton && (
          <GhostButton
            onPress={createProjectTrigger}
            customStyle={{
              fontSize: "15px",
              width: "130px",
              height: "35px",
              marginTop: "0px",
            }}
          >
            Create Project
          </GhostButton>

        )}

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className={`transition-transform ${styles.avatar}`}
              name="Avatar"
              size="sm"
            />
          </DropdownTrigger>

        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
