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
          {breadcrumbs.map((crumb) => (
            <div key={crumb.text} className="flex">
              {" "}
              <Link href={crumb.href}>
                <p className={styles.breadcrumb}>{crumb.text}</p>
              </Link>
              <p style={{ marginRight: "10px" }}> / </p>
            </div>
          ))}
        </div>

      </NavbarBrand>

      <NavbarContent as="div" justify="end">

        <GhostButton
          onPress={createProjectTrigger}
          customStyle={{
            fontSize: "15px",
            width: "130px",
            height: "35px",
            marginTop: "0px",
          }}
          text="Create Project"
        />
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
