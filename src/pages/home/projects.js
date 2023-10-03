import {
  useDisclosure,
} from "@nextui-org/react";
// import NoProjectsComponent from "../../components/ProjectOverview/noProjectsCreated";
import ProjectsOverview from "../../components/ProjectOverview/projectOverview";
import CreateNewProjectModal from "../../components/ProjectOverview/createNewProjectModal";

export default function ProjectsHome() {
  const {
    isOpen: isOpenCreateNewProjectModal,
    onOpen: onOpenCreateNewProjectModal,
    onOpenChange: onOpenChangeCreateNewProjectModal,
  } = useDisclosure();

  return (
    <>
      {/* <NoProjectsComponent createProjectTrigger={onOpenCreateNewProjectModal} /> */}
      <ProjectsOverview createProjectTrigger={onOpenCreateNewProjectModal} />
      <CreateNewProjectModal
        isOpen={isOpenCreateNewProjectModal}
        onOpenChange={onOpenChangeCreateNewProjectModal}
      />
    </>
  );
}
