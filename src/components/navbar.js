import React from "react";

import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar,
} from "@nextui-org/react";
import Image from "next/image";
import styles from "../styles/components/navbar.module.css";

export default function NavBar() {
  return (
    <Navbar maxWidth="2xl" isBordered isBlurred>
      <NavbarBrand>
        <Image
          src="/images/logo_2.svg"
          height={50}
          width={50}
          alt="Logo"
        />
        <p className="font-bold text-inherit">MML</p>
      </NavbarBrand>

      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className={styles.mainColor} href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page" className={styles.mainColor}>
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className={styles.mainColor} href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}

      <NavbarContent as="div" justify="end">

        <h1>2</h1>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
            //   color="secondary"
              className={`transition-transform ${styles.avatar}`}
              name="Avatar"
              size="sm"
            //   src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          {/* <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu> */}
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
