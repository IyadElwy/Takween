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
    const projects = (await AxiosWrapper.get("http://127.0.0.1:8000/projects", {
      accessToken: accessToken || "",
    })).data;

    const projectsWithUsers = await Promise.all(projects.map(async (project) => {
      const userCreatedProject = (await AxiosWrapper.get(`http://localhost:8000/users/${project.created_by_id}`, {
        accessToken: accessToken || "",
      })).data;
      return { ...project, user: userCreatedProject };
    }));

    return { props: { projects: projectsWithUsers } };
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
