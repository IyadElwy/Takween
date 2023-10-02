import Head from "next/head";
import styles from "../../styles/components/ProjectOverview/projectOverview.module.css";
import GhostButton from "../Reusable/ghostButton";
import Navigation from "../Reusable/Navigation/navBarSideBar";
import Logo from "../Reusable/logo";

export default function NoProjectsComponent({ onOpen }) {
  return (
    <>
      <Head>
        <style>
          {`
            html {
              overflow: hidden;
            }
          `}
        </style>
      </Head>

      <Navigation
        breadcrumbs={[{ text: "Projects", href: "/home/projects" }]}
      />
      <div className={styles.noProjectDiv}>
        <Logo spin height={350} width={350} />
        <h1>Create a project and start labeling your data</h1>
        <GhostButton text="Create Project" onPress={onOpen} />
      </div>

    </>
  );
}
