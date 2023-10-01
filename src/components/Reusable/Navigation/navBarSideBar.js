import { useState } from "react";
import NavBar from "./navbar";
import SideBar from "./sidebar";

export default function Navigation() {
  const [drawerState, setDrawerState] = useState(false);

  return (
    <>
      <NavBar drawerState={drawerState} setDrawerState={setDrawerState} />
      <SideBar drawerState={drawerState} setDrawerState={setDrawerState} />
    </>
  );
}
