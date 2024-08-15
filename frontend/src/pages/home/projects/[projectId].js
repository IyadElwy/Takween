import {
  ScrollShadow,
  Divider,
  Card, CardHeader, CardFooter, CardBody,
  Avatar, useDisclosure, Modal, ModalBody, ModalContent, Button,

} from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment-timezone";
import { useState } from "react";
import cookieParse from "cookie-parse";
import Navigation from "../../../components/Reusable/Navigation/navBarSideBar";
import AddDataComponent from "../../../components/Project/EditProject/DataSetup/addDataComponent";
import NewJobComponent from "../../../components/Project/EditProject/AnnotationSetup/newJobComponent";
import AxiosWrapper from "../../../utils/axiosWrapper";
import ManageUsersComponent from "../../../components/Project/EditProject/UserManagement/manageUsersComponent";

export default function ProjectDetailPage({
  projectId, project, jobs, user,
}) {
  const {
    isOpen,
    onOpen,
    onOpenChange,
  } = useDisclosure();

  const {
    isOpen: isOpenModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure();

  const [modalComponent, setModalComponent] = useState(null);

  const getCurrentModalComponent = (onClose) => {
    switch (modalComponent) {
      case "data":
        return <AddDataComponent projectId={projectId} onClose={onClose} />;

      case "newAnnotationJob":
        return <NewJobComponent projectId={projectId} onClose={onClose} />;

      case "manageUsers":
        return (
          <ManageUsersComponent
            projectId={projectId}
            onClose={onClose}
            projectCreatedById={project.created_by_id}
          />
        );

      default:
        return null;
    }
  };

  const getJobImageDependingOnType = (annotationType) => {
    switch (annotationType) {
      case "text_classification":
        return "/images/classification.svg";
      case "part_of_speech":
        return "/images/pos.svg";
      case "named_entity_recognition":
        return "/images/ner.svg";

      default:
        return "";
    }
  };

  return (
    (
      <>
        <Navigation
          showCreateProjectButton={false}
          breadcrumbs={[
            { text: "Projects", href: "/home/projects" },
            { text: project.title, href: `/home/projects/${project.id}` }]}
        />

        <Modal
          style={{
            height: "500px",
          }}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          size="5xl"
          scrollBehavior="inside"
          backdrop="blur"
          hideCloseButton
        >
          <ModalContent>
            {(onClose) => (
              <ModalBody>
                {getCurrentModalComponent(onClose)}
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
                        await AxiosWrapper.delete(`http://localhost:8000/projects/${projectId}`);
                        // eslint-disable-next-line no-undef
                        window.location = "http://localhost:3000/home/projects";
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
        <div className="flex">
          <div className="w-2/6 bg-300 p-4">
            <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>Annotation Jobs</h1>
            <ScrollShadow className="w-[300px] h-[500px]">
              {jobs.map((job) => (
                <Link href={`${project.id}/jobs/${job.id}`} key={job.id}>
                  <div className="mr-2 ml-2">
                    <Card className="mb-4 mt-4 mr-3 w-full" isPressable>
                      <CardHeader className="flex gap-3">
                        <Image
                          height={30}
                          alt="Card background"
                          className="object-cover rounded-xl"
                          src={getJobImageDependingOnType(job.type)}
                          width={30}
                        />
                        <div className="flex flex-col">
                          <p className="text-md text-left">{job.title}</p>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardFooter className="flex justify-between">
                        <span className="text-xs text-gray-500">
                          {moment(job.created_at).tz("America/New_York").format("llll")}
                        </span>
                        <Avatar
                          isBordered
                          className="transition-transform"
                          name={job.user.email}
                          size="sm"
                        />
                      </CardFooter>

                    </Card>
                  </div>
                </Link>
              ))}

              <Divider />
            </ScrollShadow>
          </div>

          <div className="w-5/6 bg-300 p-4">

            <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>{project.title}</h1>
            <h4>{project.description ? project.description : "No description..."}</h4>
            <br />
            <Divider />
            <br />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

              <Card
                className="max-w-[220px] min-w-[220px] min-h-[100px] max-h-[100px]"
                isPressable
                onPress={() => {
                  setModalComponent("data");
                  onOpen();
                }}
              >

                <CardHeader className="flex gap-3">

                  <Image
                    alt="nextui logo"
                    height={60}
                    radius="sm"
                    src="/images/files.svg"
                    width={70}
                  />
                  <div className="flex flex-col">
                    <p className="text-md">
                      Explore your Project&apos;s
                      {" "}
                      <strong>Data</strong>

                    </p>
                  </div>
                </CardHeader>

              </Card>
              <Card
                className="max-w-[220px] min-w-[220px] min-h-[100px] max-h-[100px]"
                isPressable
                onPress={onOpenModalDelete}
              >

                <CardHeader className="flex gap-3">

                  <Image
                    alt="nextui logo"
                    height={60}
                    radius="sm"
                    src="/images/delete.svg"
                    width={70}
                  />
                  <div className="flex flex-col">
                    <p className="text-md" style={{ color: "#bf0d0d" }}>
                      Delete Project
                      {" "}

                    </p>
                  </div>
                </CardHeader>

              </Card>
            </div>

            <br />
            <Divider />
            <br />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card
                className="py-4"
                isPressable
                onPress={() => {
                  setModalComponent("newAnnotationJob");
                  onOpen();
                }}
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">Create New Annotation Job</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <center>
                    <Image
                      height={200}
                      alt="Card background"
                      className="object-cover rounded-xl"
                      src="/images/annotation.svg"
                      width={130}
                    />

                  </center>
                </CardBody>
              </Card>

              <Card
                className="py-4"
                isPressable
                onPress={() => {
                  setModalComponent("manageUsers");
                  onOpen();
                }}
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">Manage All Project Users</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <center>
                    <Image
                      height={200}
                      alt="Card background"
                      className="object-cover rounded-xl"
                      src="/images/users.svg"
                      width={130}
                    />

                  </center>
                </CardBody>
              </Card>

            </div>
          </div>
        </div>
      </>
    )
  );
}

export async function getServerSideProps(context) {
  const { projectId } = context.query;
  const cookies = context.req.headers.cookie || "";
  const { accessToken } = cookieParse.parse(cookies);

  try {
    const project = (await AxiosWrapper.get(`http://localhost:5002/${projectId}`, {
      accessToken: accessToken || "",
    })).data;

    const user = (await AxiosWrapper.get("http://127.0.0.1:5003/currentuser", {
      accessToken: accessToken || "",
    })).data;

    return {
      props: {
        project, jobs: [], projectId, user,
      },
    };
  } catch (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }
}
