import {
  useDisclosure,
} from "@nextui-org/react";
import { MaterialReactTable } from "material-react-table";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navigation from "../../../../components/Reusable/Navigation/navBarSideBar";
import CreateNewProjectModal from "../../../../components/ProjectOverview/createNewProjectModal";
import LoadingSymbol from "../../../../components/Reusable/loadingSymbol";

export default function ProjectDetailPage() {
  const {
    isOpen: isOpenCreateNewProjectModal,
    onOpen: onOpenCreateNewProjectModal,
    onOpenChange: onOpenChangeCreateNewProjectModal,
  } = useDisclosure();
  const [data, setData] = useState(null);
  const [projectData, setProjectData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (router.isReady) {
        const res = await fetch(`http://localhost:8000/files/${router.query.dataFileName}`);
        const resProject = await fetch(`http://localhost:8000/projects/${router.query.jobTitle}`);
        const responseDataProject = await resProject.json();
        const responseData = await res.json();
        setData(responseData);
        setProjectData(responseDataProject);
      }
    };

    fetchData();
  }, [router]);

  const getColumns = () => Object.keys(data.columns).map((key) => ({
    accessorKey: key,
    header: key,
    size: 150,
  }));

  const getData = () => {
    const columns = Object.keys(data.columns);
    return data.data.map((item) => {
      const resultObject = {};

      for (let i = 0; i < columns.length; i += 1) {
        const key = columns[i];
        const value = item[i];
        resultObject[key] = value;
      }
      return resultObject;
    });
  };

  if (data) {
    getData();
  }

  return (
    !data ? <LoadingSymbol width={350} height={350} />
      : (
        <>
          <Navigation
            showCreateProjectButton={false}
            breadcrumbs={[
              { text: "Projects", href: "/home/projects" },
              { text: projectData.title, href: `/home/projects/${projectData.id}` },
              { text: "Job 1", href: "/home/projects/job/1" },
            ]}
            createProjectTrigger={onOpenCreateNewProjectModal}
          />
          <CreateNewProjectModal
            isOpen={isOpenCreateNewProjectModal}
            onOpenChange={onOpenChangeCreateNewProjectModal}
          />
          <MaterialReactTable
            enableStickyHeader
            enableRowSelection
            columns={getColumns()}
            data={getData()}
          />
        </>
      )
  );
}
