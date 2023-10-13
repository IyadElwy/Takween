import { MaterialReactTable } from "material-react-table";
import { useState, useEffect } from "react";
import Navigation from "../../../../../components/Reusable/Navigation/navBarSideBar";
import LoadingSymbol from "../../../../../components/Reusable/loadingSymbol";

export default function JobPage({
  project, job, firstAnnotationDataBatch, projectId, jobId, totalRowCount,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [annotationData, setAnnotationData] = useState(firstAnnotationDataBatch);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const nextAnnotationDataRes = await fetch(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations?page=${pagination.pageIndex}&itemsPerPage=${pagination.pageSize}`);
      const nextAnnotationData = await nextAnnotationDataRes.json();
      setAnnotationData(nextAnnotationData.data);

      setIsLoading(false);
    };

    fetchData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const handlePaginationChange = (newPagination) => {
    setPagination(newPagination);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      size: 150,
    },
    {
      accessorKey: "annotation",
      header: "Annotation",
      size: 150,
    },
    {
      accessorKey: "data",
      header: "Data",
      size: 150,
    },
  ];

  const formatData = (unformatedData) => unformatedData.map((item) => ({
    id: item.id,
    annotation: item.annotated_class || "None",
    data: item.data_as_json[job.field_to_annotate],
  }));

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

      {isLoading ? <LoadingSymbol height={200} width={200} /> : (
        <MaterialReactTable
          enableStickyHeader
          enableRowSelection
          columns={columns}
          data={formatData(annotationData)}
          page
          manualPagination
          onPaginationChange={handlePaginationChange}
          rowCount={totalRowCount}
          state={{
            isLoading,
            pagination,
          }}

        />
      )}

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

  const resFirstAnnotationDataBatch = await fetch(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations?page=${0}&itemsPerPage=${10}`);
  const firstAnnotationDataBatch = await resFirstAnnotationDataBatch.json();
  return {
    props: {
      projectId,
      jobId,
      project: project.project,
      job: job.job,
      firstAnnotationDataBatch: firstAnnotationDataBatch.data,
      totalRowCount: firstAnnotationDataBatch.totalRowCount,
    },
  };
}
