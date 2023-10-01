import React from "react";
import {
  Navbar, NavbarBrand, NavbarContent, DropdownTrigger, Dropdown, Avatar,
} from "@nextui-org/react";

import Image from "next/image";
import styles from "../../../styles/components/Reusable/navbar.module.css";
import GhostButton from "../ghostButton";
import Logo from "../logo";

export default function NavBar({ drawerState, setDrawerState }) {
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

      </NavbarBrand>

      <NavbarContent as="div" justify="end">

        <GhostButton
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
