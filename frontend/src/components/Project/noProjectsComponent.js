import Head from "next/head";
import styles from "../../styles/components/Project/projectOverview.module.css";
import GhostButton from "../Reusable/ghostButton";
import Navigation from "../Reusable/Navigation/navBarSideBar";
import Logo from "../Reusable/logo";

export default function NoProjectsComponent({ createProjectTrigger }) {
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
        createProjectTrigger={createProjectTrigger}
        breadcrumbs={[{ text: "Projects", href: "/home/projects" }]}
      />
      <div className={styles.noProjectDiv}>
        <Logo spin height={200} width={200} />
        <h1>Create a project and start labeling your data</h1>
        <GhostButton onPress={createProjectTrigger}>
          Create Project
        </GhostButton>
      </div>

    </>
  );
}
