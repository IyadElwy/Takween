import { useState } from "react";
import NavBar from "./navbar";
import SideBar from "./sidebar";

export default function Navigation({ breadcrumbs }) {
  const [drawerState, setDrawerState] = useState(false);

  return (
    <>
      <NavBar
        drawerState={drawerState}
        setDrawerState={setDrawerState}
        breadcrumbs={breadcrumbs}
      />
      <SideBar drawerState={drawerState} setDrawerState={setDrawerState} />
    </>
  );
}
