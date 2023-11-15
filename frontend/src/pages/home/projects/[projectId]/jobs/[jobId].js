/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import _ from "lodash";
import { MaterialReactTable } from "material-react-table";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Modal, ModalContent, ModalBody, ModalFooter, Button, useDisclosure,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  DropdownSection, cn,
  Progress,
  Avatar, AvatarGroup,
  Chip,
  Switch,
} from "@nextui-org/react";
import JsonView from "react18-json-view";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import cookieParse from "cookie-parse";
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

import Navigation from "../../../../../components/Reusable/Navigation/navBarSideBar";
import LoadingSymbol from "../../../../../components/Reusable/loadingSymbol";
import "react18-json-view/src/style.css";
import closerLookButtonStyles from "../../../../../styles/components/Reusable/navbar.module.css";
import MainAnnotationScreen from "../../../../../components/Project/AnnotationScreens/mainScreen";
import AxiosWrapper from "../../../../../utils/axiosWrapper";
import DeleteDocumentIcon from "../../../../../components/Icons/DeleteDocument";
import EditDocumentIcon from "../../../../../components/Icons/EditDocumentIcons";
import AnnotatorEditComponent from "../../../../../components/Project/EditProject/AnnotationSetup/annotatorEditComponent";

const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

export default function JobPage({
  project, job, firstAnnotationDataBatch, projectId, jobId, totalRowCount,
  finishedAnnotations, user,
  // finishedAnnotationsByUser,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenVisualization,
    onOpen: onOpenVisualization,
    onOpenChange: onOpenChangeVisualization,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [annotatedDataCount, setAnnotatedDataCount] = useState(finishedAnnotations);
  const [visualizationData, setVisualizationData] = useState(null);
  const [annotationData, setAnnotationData] = useState(firstAnnotationDataBatch);
  const [currentDataToAnnotate, setCurrentDataToAnnotate] = useState(null);
  const [showDetailedSplit, setShowDetailedSplit] = useState(false);
  const [onlyShowUnanotatedData, setOnlyShowUnanotatedData] = useState(true);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [currentItemCloserLook, setCurrentItemCloserLook] = useState(null);
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
  } = useDisclosure();

  const {
    isOpen: isOpenModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const nextAnnotationData = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations?page=${pagination.pageIndex}&itemsPerPage=${pagination.pageSize}&onlyShowUnanotatedData=${onlyShowUnanotatedData}`)).data;
      setAnnotationData(nextAnnotationData.data);
      setAnnotatedDataCount(nextAnnotationData.finishedAnnotations);
      setIsLoading(false);
    };

    fetchData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    showDetailedSplit,
    onlyShowUnanotatedData,
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
      id: "annotation",
      header: "Annotation",
      // size: 150,
      Cell: ({ cell }) => {
        const { annotations, _id } = cell.row.original;
        return (
          <AvatarGroup key={_id} max={3}>
            {annotations.map((ann) => <Avatar key={ann.user.id} name={ann.user.email} />)}
          </AvatarGroup>
        );
      },
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
      accessorKey: "none",
      header: "",
      size: 150,
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ cell }) => {
        // eslint-disable-next-line camelcase
        const { data } = cell.row.original;
        return (
          <div>
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
            {cell.row.original.conflict && job.assigned_reviewer_id === user.id && (
            <Image
              className={`${closerLookButtonStyles.burgerMenu} ml-5`}
              alt="nextui logo"
              height={25}
              radius="sm"
              src="/images/warning.svg"
              width={25}
            />
            )}
          </div>
        );
      },
    },
  ];

  const handleExport = async (type, merge = false) => {
    setIsLoading(true);
    try {
      let response;
      if (merge) {
        response = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations/merge/export?type=${type}`, {
          responseType: "blob",
        }));
      } else {
        response = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations/export?type=${type}`, {
          responseType: "blob",
        }));
      }
      if (response.status === 200) {
        const blob = await response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `data.${type}`;
        a.click();
      } else {
        console.error("Export failed.");
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function MyChart({ data }) {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#d62728", "#9467bd"]; // Add more colors as needed
    const dataWithDateString = data.by_date.map((entry) => ({ ...entry, dateString: `${entry.day}-${entry.month}-${entry.year}` }));
    const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    return (
      <div>
        {/* Total Finished vs Total */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[data]}>
            <Bar dataKey="total" fill="#8884d8" />
            <Bar dataKey="total_finished" fill="#82ca9d" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>

        {/* Finished by User */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="count"
              isAnimationActive={false}
              data={data.by_user}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            {data.by_user.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRandomColor()} />
            ))}
            <Tooltip />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              payload={data.by_user.map((entry) => ({ value: entry.user_email, type: "circle", color: "#8884d8" }))}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Distribution of Count over Time */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataWithDateString}>
            <Bar dataKey="count" fill="#8884d8" />
            <XAxis dataKey="dateString" />
            <YAxis />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
        <br />
        <br />
      </div>
    );
  }

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
      {visualizationData && (
      <Modal
        size="5xl"
        style={{
          height: "500px",
        }}
        isOpen={isOpenVisualization}
        onOpenChange={onOpenChangeVisualization}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="m-4" style={{ maxHeight: "400px", maxWidth: "1000px", overflow: "auto" }}>
                  {/* <div className="flex flex-col ml-3 mr-5 mb-3"> */}
                  <Progress
                    aria-label="Downloading..."
                    size="md"
                    value={annotatedDataCount}
                    maxValue={totalRowCount}
                    minValue={0}
                    color="success"
                  />
                  <br />
                  <MyChart data={visualizationData} />
                  <br />

                  {/* {
    "total": 5,
    "total_finished": 3,
    "by_user": [
        {
            "count": 3,
            "user_email": "iyadelwy@gmail.com"
        }
    ],
    "by_date": [
        {
            "count": 3,
            "year": 2023,
            "month": 11,
            "day": 15
        }
    ]
} */}
                  {/* </div> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <br />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      )}
      <Modal
        style={{
          height: "500px",
        }}
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        isDismissable={false}
        size="5xl"
        scrollBehavior="inside"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody>
              <AnnotatorEditComponent onClose={onClose} projectId={projectId} jobId={jobId} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
      <Modal
        style={{
          height: "150px",
        }}
        isOpen={isOpenModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        isDismissable={false}
        size="sm"
        scrollBehavior="inside"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody>

              <div className="text-4xl">Are you sure?</div>
              <p className="text-s text-gray-500 mb-2">This action cannot be undone</p>

              <div className="absolute bottom-0 right-0 mr-5 mb-5">
                <div className="flex space-x-4">
                  <Button
                    color="default"
                    variant="solid"
                    onPress={() => {
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    variant="ghost"
                    onPress={async () => {
                      await AxiosWrapper.delete(`http://localhost:8000/projects/${projectId}/jobs/${jobId}`);
                      window.location = `http://localhost:3000/home/projects/${projectId}`;
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </div>

            </ModalBody>
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

            <div className="flex justify-between">

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
                      onClick={async () => {
                        setIsLoading(true);
                        const vizData = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/visualization`)).data;
                        setVisualizationData(vizData);
                        setIsLoading(false);
                        onOpenVisualization();
                      }}
                      key="visualize"
                      description="Visualize Annotation Info"
                      startContent={(
                        <Image
                          className={closerLookButtonStyles.burgerMenu}
                          alt="nextui logo"
                          height={25}
                          radius="sm"
                          src="/images/visualize.svg"
                          width={25}
                        />
                  )}
                    >
                      Visualize
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleExport("ndjson", false)}
                      key="export"
                      description="Export Annotated Data"
                      startContent={(
                        <Image
                          className={closerLookButtonStyles.burgerMenu}
                          alt="nextui logo"
                          height={25}
                          radius="sm"
                          src="/images/json.svg"
                          width={25}
                        />
                  )}
                    >
                      Export as NdJson
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleExport("csv", false)}
                      key="export"
                      description="Export Annotated Data"
                      startContent={(
                        <Image
                          className={closerLookButtonStyles.burgerMenu}
                          alt="nextui logo"
                          height={25}
                          radius="sm"
                          src="/images/csv.svg"
                          width={25}
                        />
                  )}
                    >
                      Export as CSV
                    </DropdownItem>

                    {user.id === job.created_by_id && (
                    <DropdownItem
                      onClick={onOpenModal}
                      key="edit"
                      description="Edit job annotators"
                      startContent={<EditDocumentIcon className={iconClasses} />}
                    >
                      Annotators
                    </DropdownItem>
                    )}

                  </DropdownSection>

                  {job.assigned_reviewer_id === user.id && (
                  <DropdownSection>
                    <DropdownItem
                      onClick={() => handleExport("ndjson", true)}
                      key="merge"
                      className="text-warning"
                      color="warning"
                      description="Merge Reviewed Annotations"
                      startContent={(
                        <Image
                          className={closerLookButtonStyles.burgerMenu}
                          alt="nextui logo"
                          height={25}
                          radius="sm"
                          src="/images/merge.svg"
                          width={25}
                        />
                      )}
                    >
                      Merge
                    </DropdownItem>
                  </DropdownSection>
                  )}

                  {user.id === job.created_by_id && (
                  <DropdownSection>
                    <DropdownItem
                      onClick={onOpenModalDelete}
                      key="delete"
                      className="text-danger"
                      color="danger"
                      description="Permanently delete job"
                      startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                    >
                      Delete Job
                    </DropdownItem>
                  </DropdownSection>
                  )}

                </DropdownMenu>
              </Dropdown>

              <Switch
                onChange={(e) => { e.preventDefault(); }}
                isSelected={onlyShowUnanotatedData}
                onValueChange={(value) => {
                  setOnlyShowUnanotatedData(value);
                }}

              >
                Only show Un-annotated Data
              </Switch>
              {job.assigned_reviewer_id === user.id && <Chip className="mt-1 ml-2" color="warning">Reviewer</Chip>}

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
              defaultSizes={[50, 200]}
            >
              {mainBody()}
              <MainAnnotationScreen
                data={currentDataToAnnotate}
                user={user}
                projectId={projectId}
                jobId={jobId}
                type={job.type}
                annotatedDataCount={annotatedDataCount}
                setAnnotatedDataCount={setAnnotatedDataCount}
                job={job}
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

  const cookies = context.req.headers.cookie || "";
  const { accessToken } = cookieParse.parse(cookies);

  try {
    const project = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}`, {
      accessToken: accessToken || "",
    })).data;

    const job = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}`, {
      accessToken: accessToken || "",
    })).data;

    const firstAnnotationDataBatch = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations?page=${0}&itemsPerPage=${10}&onlyShowUnanotatedData=${true}`, {
      accessToken: accessToken || "",
    })).data;

    const user = (await AxiosWrapper.get("http://127.0.0.1:8000/currentuser", {
      accessToken: accessToken || "",
    })).data;

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
        user,
      },
    };
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
