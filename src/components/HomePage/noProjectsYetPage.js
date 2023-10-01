import styles from "../../styles/components/HomePage/homePage.module.css";
import GhostButton from "../Reusable/ghostButton";
import Navigation from "../Reusable/Navigation/navBarSideBar";
import Logo from "../Reusable/logo";

export default function NoProjectsComponent() {
  return (
    <>
      <Navigation />
      <div className={styles.noProjectDiv}>
        <Logo spin height={350} width={350} />
        <h1>Create a project and start labeling your data</h1>
        <GhostButton text="Create Project" />
      </div>
    </>
  );
}
