import {
  useDisclosure,
} from "@nextui-org/react";
import NoProjectsComponent from "../../components/Project/noProjectsComponent";
import ProjectsOverview from "../../components/Project/projectsOverview";
import CreateNewProjectModal from "../../components/Project/CreateProject/createNewProjectModal";

export default function ProjectsHome({ projects }) {
  const {
    isOpen: isOpenCreateNewProjectModal,
    onOpen: onOpenCreateNewProjectModal,
    onOpenChange: onOpenChangeCreateNewProjectModal,
  } = useDisclosure();

  return (
    <>
      <CreateNewProjectModal
        isOpen={isOpenCreateNewProjectModal}
        onOpenChange={onOpenChangeCreateNewProjectModal}
      />
      {projects.length === 0
        ? <NoProjectsComponent createProjectTrigger={onOpenCreateNewProjectModal} />
        : <ProjectsOverview data={projects} createProjectTrigger={onOpenCreateNewProjectModal} />}

    </>

  );
}

export async function getServerSideProps() {
  const res = await fetch("http://127.0.0.1:8000/projects");
  const projects = await res.json();

  return { props: { projects } };
}
