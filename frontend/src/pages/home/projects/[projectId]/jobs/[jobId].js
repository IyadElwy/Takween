import _ from "lodash";
import { MaterialReactTable } from "material-react-table";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Modal, ModalContent, ModalBody, ModalFooter, Button, useDisclosure,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  DropdownSection,
  Progress,
} from "@nextui-org/react";
import JsonView from "react18-json-view";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Navigation from "../../../../../components/Reusable/Navigation/navBarSideBar";
import LoadingSymbol from "../../../../../components/Reusable/loadingSymbol";
import "react18-json-view/src/style.css";
import closerLookButtonStyles from "../../../../../styles/components/Reusable/navbar.module.css";
import MainAnnotationScreen from "../../../../../components/Project/AnnotationScreens/mainScreen";

export default function JobPage({
  project, job, firstAnnotationDataBatch, projectId, jobId, totalRowCount,
  finishedAnnotations,
  // finishedAnnotationsByUser,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [annotatedDataCount, setAnnotatedDataCount] = useState(finishedAnnotations);
  const [annotationData, setAnnotationData] = useState(firstAnnotationDataBatch);
  const [currentDataToAnnotate, setCurrentDataToAnnotate] = useState(null);
  const [showDetailedSplit, setShowDetailedSplit] = useState(false);
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
      setAnnotatedDataCount(nextAnnotationData.finishedAnnotations);
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
      // eslint-disable-next-line no-underscore-dangle
      accessorFn: (row) => row._id,
      id: "id",
      header: "ID",
      size: 150,
    },
    {
      accessorFn: (row) => (row.annotations.length === 0 ? "None" : "Annotated"),
      id: "annotation",
      header: "Annotation",
      size: 150,
    },
    {
      accessorFn: (row) => {
        let dataToDisplay = row.data[job.field_to_annotate];
        if (typeof dataToDisplay === "object" && dataToDisplay !== null) {
          dataToDisplay = JSON.stringify(dataToDisplay);
        }

        return _.truncate(dataToDisplay, { length: 50 });
      },
      id: "data",
      header: "Data",
      size: 150,
    },
    {
      // accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      accessorKey: "none",
      header: "",
      size: 150,

      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ cell }) => {
        // eslint-disable-next-line camelcase
        const { data } = cell.row.original;

        return (
          <Image
            className={closerLookButtonStyles.burgerMenu}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentItemCloserLook(data);
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

  const mainBody = () => (
    <>
      <Modal
        size="3xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="m-4" style={{ maxHeight: "400px", maxWidth: "1000px", overflow: "auto" }}>
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
        onPaginationChange={(v) => {
          handlePaginationChange(v);
        }}
        rowCount={totalRowCount}
        state={{
          isLoading,
          pagination,
        }}
        muiTableBodyRowProps={({
          row, table,
          // staticRowIndex,
        }) => ({
          onClick: () => {
            const rowData = {
              ...row,
              totalRowCount,
              allRows: table.getRowModel().rowsById,
              pagination,
              setPagination,
              setShowDetailedSplit,
            };
            // setShowDetailedSplit(true);
            setShowDetailedSplit(!showDetailedSplit);
            setCurrentDataToAnnotate(rowData);
          },
          sx: {
            cursor: "pointer",
          },
        })}
      // add custom action buttons to top-left of top toolbar
        renderTopToolbarCustomActions={() => (
          <div className="w-full">

            <div className="flex flex-col ml-3 mr-5 mb-3">
              <Progress
                aria-label="Downloading..."
                size="md"
                value={annotatedDataCount}
                maxValue={totalRowCount}
                minValue={0}
                color="success"
              />
            </div>

            <div className="w-full">

              <Dropdown
                showArrow
                classNames={{
                  base: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                  arrow: "bg-default-200",
                }}
              >
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                  >
                    Job Menu
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
                  <DropdownSection title="Actions">
                    <DropdownItem
                      key="export"
                      description="Export Annotated Data"
                      startContent={(
                        <Image
                          className={closerLookButtonStyles.burgerMenu}
                          onClick={() => {
                          }}
                          alt="nextui logo"
                          height={25}
                          radius="sm"
                          src="/images/export.svg"
                          width={25}
                        />
                  )}
                    >
                      Export
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            </div>

          </div>

        )}

      />
    </>
  );

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
        <div style={{ width: "100%", height: "100vh" }}>

          {showDetailedSplit ? (
            <Allotment
              minSize={200}
              // maxSize={}
              defaultSizes={[50, 200]}
            >
              {mainBody()}
              <MainAnnotationScreen
                data={currentDataToAnnotate}
                projectId={projectId}
                jobId={jobId}
                annotatedDataCount={annotatedDataCount}
                setAnnotatedDataCount={setAnnotatedDataCount}
              />
            </Allotment>
          ) : mainBody()}

        </div>

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
      finishedAnnotations: firstAnnotationDataBatch.finishedAnnotations,
      finishedAnnotationsByUser: firstAnnotationDataBatch.finishedAnnotationsByUser,
    },
  };
}
