import { useState } from "react";
import NavBar from "./navbar";
import SideBar from "./sidebar";

export default function Navigation({ breadcrumbs, createProjectTrigger }) {
  const [drawerState, setDrawerState] = useState(false);

  return (
    <>
      <NavBar
        createProjectTrigger={createProjectTrigger}
        drawerState={drawerState}
        setDrawerState={setDrawerState}
        breadcrumbs={breadcrumbs}
      />
      <SideBar drawerState={drawerState} setDrawerState={setDrawerState} />
    </>
  );
}
