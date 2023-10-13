import { MaterialReactTable } from "material-react-table";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Modal, ModalContent, ModalBody, ModalFooter, Button, useDisclosure,
} from "@nextui-org/react";
import JsonView from "react18-json-view";
import Navigation from "../../../../../components/Reusable/Navigation/navBarSideBar";
import LoadingSymbol from "../../../../../components/Reusable/loadingSymbol";
import "react18-json-view/src/style.css";
import closerLookButtonStyles from "../../../../../styles/components/Reusable/navbar.module.css";

export default function JobPage({
  project, job, firstAnnotationDataBatch, projectId, jobId, totalRowCount,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [annotationData, setAnnotationData] = useState(firstAnnotationDataBatch);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [currentItemCloserLook, setCurrentItemCloserLook] = useState(null);

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
      accessorFn: (row) => row.id,
      id: "id",
      header: "ID",
      size: 150,
    },
    {
      accessorFn: (row) => row.annotated_class || "None",
      id: "annotation",
      header: "Annotation",
      size: 150,
    },
    {
      accessorFn: (row) => row.data_as_json[job.field_to_annotate],
      id: "data",
      header: "Data",
      size: 150,
    },
    {
      // accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      accessorKey: "ee",
      header: "",
      size: 150,

      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ cell }) => {
        // eslint-disable-next-line camelcase
        const { data_as_json } = cell.row.original;

        return (
          <Image
            className={closerLookButtonStyles.burgerMenu}
            onClick={() => {
              setCurrentItemCloserLook(data_as_json);
              onOpen();
            }}
            alt="nextui logo"
            height={25}
            radius="sm"
            src="/images/magnifier.svg"
            width={25}
          />
        );
      },
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

      {isLoading ? <LoadingSymbol height={200} width={200} /> : (
        <>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <div className="m-4">
                      <JsonView src={currentItemCloserLook} />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

          <MaterialReactTable
            enableStickyHeader
            enableRowSelection
            columns={columns}
            data={annotationData}
            page
            manualPagination
            onPaginationChange={handlePaginationChange}
            rowCount={totalRowCount}
            state={{
              isLoading,
              pagination,
            }}
          />
        </>
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
