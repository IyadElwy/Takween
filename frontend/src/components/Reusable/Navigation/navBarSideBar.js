import { useState } from "react";
import NavBar from "./navbar";
import SideBar from "./sidebar";

export default function Navigation({ breadcrumbs, createProjectTrigger, showCreateProjectButton }) {
  const [drawerState, setDrawerState] = useState(false);

  return (
    <>
      <NavBar
        showCreateProjectButton={showCreateProjectButton}
        createProjectTrigger={createProjectTrigger}
        drawerState={drawerState}
        setDrawerState={setDrawerState}
        breadcrumbs={breadcrumbs}
      />
      <SideBar drawerState={drawerState} setDrawerState={setDrawerState} />
    </>
  );
}
