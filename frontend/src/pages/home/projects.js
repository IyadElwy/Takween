import {
  useDisclosure,
} from "@nextui-org/react";
import cookieParse from "cookie-parse";
import NoProjectsComponent from "../../components/Project/noProjectsComponent";
import ProjectsOverview from "../../components/Project/projectsOverview";
import CreateNewProjectModal from "../../components/Project/CreateProject/createNewProjectModal";
import AxiosWrapper from "../../utils/axiosWrapper";

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

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie || "";
  const { accessToken } = cookieParse.parse(cookies);

  try {
    const projects = (await AxiosWrapper.get("http://127.0.0.1:5002/currentuserprojects", {
      accessToken: accessToken || "",
    })).data;
    return { props: { projects } };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }
  return null;
}
