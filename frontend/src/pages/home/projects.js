import {
  useDisclosure,
} from "@nextui-org/react";
import useSWR from "swr";
import NoProjectsComponent from "../../components/Project/noProjectsComponent";
import ProjectsOverview from "../../components/Project/projectsOverview";
import CreateNewProjectModal from "../../components/Project/CreateProject/createNewProjectModal";
import LoadingSymbol from "../../components/Reusable/loadingSymbol";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function ProjectsHome() {
  const { data, isLoading } = useSWR("http://127.0.0.1:8000/projects", fetcher);

  const {
    isOpen: isOpenCreateNewProjectModal,
    onOpen: onOpenCreateNewProjectModal,
    onOpenChange: onOpenChangeCreateNewProjectModal,
  } = useDisclosure();

  return (isLoading ? <LoadingSymbol height={300} width={300} />
    : (
      <>
        <CreateNewProjectModal
          isOpen={isOpenCreateNewProjectModal}
          onOpenChange={onOpenChangeCreateNewProjectModal}
        />
        {data.length === 0
          ? <NoProjectsComponent createProjectTrigger={onOpenCreateNewProjectModal} />
          : <ProjectsOverview data={data} createProjectTrigger={onOpenCreateNewProjectModal} />}

      </>
    )
  );
}
