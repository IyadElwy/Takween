import { MaterialReactTable } from "material-react-table";
import Navigation from "../../../../../components/Reusable/Navigation/navBarSideBar";

export default function JobPage({ project, job, jobData }) {
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
          { text: project.title, href: `/home/projects/${project.id}` },
          { text: job.title, href: `/home/projects/${project.id}/jobs/job1` },
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
    projectId,
    jobId,
  } = context.query;

  const resProject = await fetch(`http://localhost:8000/projects/${projectId}`);
  const project = await resProject.json();
  const resJob = await fetch(`http://localhost:8000/projects/${projectId}/jobs/${jobId}`);
  const job = await resJob.json();

  const resJobData = await fetch(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/data`);
  const jobData = await resJobData.json();

  return { props: { project: project.project, job: job.job, jobData } };
}
