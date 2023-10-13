import { MaterialReactTable } from "material-react-table";
import Navigation from "../../../../../components/Reusable/Navigation/navBarSideBar";

export default function JobPage({
  project, job,
  // jobData,
}) {
  // const getColumns = () => Object.keys(jobData.columns).map((key) => ({
  //   accessorKey: key,
  //   header: key,
  //   size: 150,
  // }));
  // const getData = () => {
  //   const columns = Object.keys(jobData.columns);
  //   return jobData.data.map((item) => {
  //     const resultObject = {};

  //     for (let i = 0; i < columns.length; i += 1) {
  //       const key = columns[i];
  //       const value = item[i];
  //       resultObject[key] = value;
  //     }
  //     return resultObject;
  //   });
  // };

  const data = [
    // {
    //   name: {
    //     firstName: "John",
    //     lastName: "Doe",
    //   },
    //   address: "261 Erdman Ford",
    //   city: "East Daphne",
    //   state: "Kentucky",
    // },
    // {
    //   name: {
    //     firstName: "Jane",
    //     lastName: "Doe",
    //   },
    //   address: "769 Dominic Grove",
    //   city: "Columbus",
    //   state: "Ohio",
    // },
    // {
    //   name: {
    //     firstName: "Joe",
    //     lastName: "Doe",
    //   },
    //   address: "566 Brakus Inlet",
    //   city: "South Linda",
    //   state: "West Virginia",
    // },
    // {
    //   name: {
    //     firstName: "Kevin",
    //     lastName: "Vandy",
    //   },
    //   address: "722 Emie Stream",
    //   city: "Lincoln",
    //   state: "Nebraska",
    // },
    // {
    //   name: {
    //     firstName: "Joshua",
    //     lastName: "Rolluffs",
    //   },
    //   address: "32188 Larkin Turnpike",
    //   city: "Charleston",
    //   state: "South Carolina",
    // }, {
    //   name: {
    //     firstName: "Joshua",
    //     lastName: "Rolluffs",
    //   },
    //   address: "32188 Larkin Turnpike",
    //   city: "Charleston",
    //   state: "South Carolina",
    // }, {
    //   name: {
    //     firstName: "Joshua",
    //     lastName: "Rolluffs",
    //   },
    //   address: "32188 Larkin Turnpike",
    //   city: "Charleston",
    //   state: "South Carolina",
    // }, {
    //   name: {
    //     firstName: "Joshua",
    //     lastName: "Rolluffs",
    //   },
    //   address: "32188 Larkin Turnpike",
    //   city: "Charleston",
    //   state: "South Carolina",
    // },

  ];

  const columns = [
    {
      accessorKey: "id", // access nested data with dot notation
      header: "ID",
      size: 150,
    },
    {
      accessorKey: "data",
      header: "Data",
      size: 150,
    },
  ];

  return (
    <>
      <Navigation
        showCreateProjectButton={false}
        breadcrumbs={[
          { text: "Projects", href: "/home/projects" },
          { text: project.title, href: `/home/projects/${project.id}` },
          { text: job.title, href: `/home/projects/${project.id}/jobs/${job.id}` },
        ]}
      />

      <MaterialReactTable
        enableStickyHeader
        enableRowSelection
        columns={columns}
        data={data}
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

  // const resJobData = await fetch(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/data`);
  // const jobData = await resJobData.json();

  return {
    props: {
      project: project.project,
      job: job.job,
      // jobData,
    },
  };
}
