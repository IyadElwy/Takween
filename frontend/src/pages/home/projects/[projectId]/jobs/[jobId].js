import { MaterialReactTable } from "material-react-table";
import Navigation from "../../../../../components/Reusable/Navigation/navBarSideBar";

export default function JobPage({ projectData, jobData }) {
  const getColumns = () => Object.keys(jobData.columns).map((key) => ({
    accessorKey: key,
    header: key,
    size: 150,
  }));
  const getData = () => {
    const columns = Object.keys(jobData.columns);
    return jobData.data.map((item) => {
      const resultObject = {};

      for (let i = 0; i < columns.length; i += 1) {
        const key = columns[i];
        const value = item[i];
        resultObject[key] = value;
      }
      return resultObject;
    });
  };

  return (
    <>
      <Navigation
        showCreateProjectButton={false}
        breadcrumbs={[
          { text: "Projects", href: "/home/projects" },
          { text: projectData.title, href: `/home/projects/${projectData.id}` },
          { text: "Job 1", href: `/home/projects/${projectData.id}/jobs/job1` },
        ]}
      />

      <MaterialReactTable
        enableStickyHeader
        enableRowSelection
        columns={getColumns()}
        data={getData()}
      />
    </>

  );
}

export async function getServerSideProps(context) {
  const {
    dataFileName, projectId,
    // jobId,
  } = context.query;

  const resProjectData = await fetch(`http://localhost:8000/projects/${projectId}`);
  const projectData = await resProjectData.json();
  const resJobData = await fetch(`http://localhost:8000/files/${dataFileName}`);
  const jobData = await resJobData.json();

  return { props: { projectData, jobData } };
}
