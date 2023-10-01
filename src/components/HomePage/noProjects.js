import Image from "next/image";
import styles from "../../styles/components/HomePage/homePage.module.css";
import Navbar from "../navbar";
import GhostButton from "../Reusable/ghostButton";

export default function NoProjectsComponent() {
  return (
    <>
      <Navbar />
      <div className={styles.noProjectDiv}>
        <Image
          src="/images/logo_2.svg"
          height={350}
          width={350}
          alt="Logo"
        />
        <h1>Create a project and start labeling your data</h1>
        <GhostButton text="Create Project" />
      </div>
    </>
  );
}
