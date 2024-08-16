import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  ScrollShadow,
  Divider,
  Card, CardHeader, CardFooter, CardBody,
  Avatar, useDisclosure, Modal, ModalBody, ModalContent, Button, CircularProgress,
  Accordion, AccordionItem,
} from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment-timezone";
import { useState } from "react";
import cookieParse from "cookie-parse";
import Slider from "react-slick";
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
  };

  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const filteredJobs = jobs
    .filter((job) => job.title.toLowerCase().includes(searchInput));

  const sliderSettingsJobs = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
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
          <div className="w-3/6 bg-300 p-4">
            <div className="p-3">
              <h1 style={{
                fontSize: "35px", paddingTop: "10px", paddingRight: "20px",
              }}
              >
                <strong>{project.title}</strong>
              </h1>
              <Accordion disabledKeys={["2"]}>
                <AccordionItem key="1" aria-label="Project Description" subtitle="Press to expand" title="Project Description">
                  <h4>{project.description ? project.description : "No description..."}</h4>
                </AccordionItem>
              </Accordion>

            </div>

          </div>
          <div className="w-3/6 bg-300 p-2">

            <div className="slider-container m-10">

              <Slider {...sliderSettings}>
                <Card
                  isHoverable
                  className="max-w-[220px] min-w-[220px] min-h-[100px] max-h-[100px] m-4"
                  isPressable
                  onPress={() => {
                    setModalComponent("data");
                    onOpen();
                  }}
                >

                  <CardHeader className="flex gap-3">

                    <Image
                      alt="nextui logo"
                      height={40}
                      radius="sm"
                      src="/images/files.svg"
                      width={50}
                    />
                    <div className="flex flex-col">
                      <p className="text-sm">
                        Explore your Project&apos;s
                        {" "}
                        <strong>Data</strong>

                      </p>
                    </div>
                  </CardHeader>

                </Card>
                <Card
                  isHoverable
                  className="max-w-[220px] min-w-[220px] min-h-[100px] max-h-[100px] m-4"
                  isPressable
                  onPress={onOpenModalDelete}
                >

                  <CardHeader className="flex gap-3">

                    <Image
                      alt="nextui logo"
                      height={40}
                      radius="sm"
                      src="/images/delete.svg"
                      width={50}
                    />
                    <div className="flex flex-col">
                      <p className="text-md" style={{ color: "#bf0d0d" }}>
                        Delete Project
                        {" "}

                      </p>
                    </div>
                  </CardHeader>

                </Card>
                <Card
                  isHoverable
                  className="max-w-[220px] min-w-[220px] min-h-[100px] max-h-[100px] m-4"
                  isPressable
                  onPress={() => {
                    setModalComponent("newAnnotationJob");
                    onOpen();
                  }}
                >

                  <CardHeader className="flex gap-3">

                    <Image
                      alt="nextui logo"
                      height={60}
                      radius="sm"
                      src="/images/annotation.svg"
                      width={70}
                    />
                    <div className="flex flex-col">
                      <p className="text-md">
                        Create New Job
                        {" "}

                      </p>
                    </div>
                  </CardHeader>

                </Card>
                <Card
                  isHoverable
                  className="max-w-[220px] min-w-[220px] min-h-[100px] max-h-[100px] m-4"
                  isPressable
                  onPress={() => {
                    setModalComponent("newAnnotationJob");
                    onOpen();
                  }}
                >

                  <CardHeader className="flex gap-3">

                    <Image
                      alt="nextui logo"
                      height={60}
                      radius="sm"
                      src="/images/users.svg"
                      width={70}
                    />
                    <div className="flex flex-col">
                      <p className="text-md">
                        Manage  Users
                        {" "}

                      </p>
                    </div>
                  </CardHeader>

                </Card>
              </Slider>

            </div>

          </div>
        </div>

        <div className="p-3 m-3">

          <h1 style={{ fontSize: "25px", marginBottom: "10px" }}><strong>Active Jobs</strong></h1>
          <input
            type="search"
            placeholder="Search jobs"
            value={searchInput}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded"
            style={{ width: "100%" }}
          />
          {filteredJobs.length > 0 && (
          <Slider {...sliderSettingsJobs}>
            {filteredJobs.map((job) => (
              <div key={job.id}>
                <Link href={`${project.id}/jobs/${job.id}`} key={job.id}>
                  <div className="">
                    <Card
                      className="mb-4 mt-4 mr-2 ml-2 max-w-[300px] min-w-[300px]"
                      isPressable
                      isHoverable
                    >
                      <CardHeader className="flex gap-3">
                        {/* <Image
                  height={30}
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src={getJobImageDependingOnType(job.type)}
                  width={30}
                /> */}
                        <CircularProgress
                          aria-label="Loading..."
                          size="sm"
                  // value={value}
                          value={50}
                          color="warning"
                          showValueLabel
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
                  // name={job.user.email}
                          name="email"
                          size="sm"
                        />
                      </CardFooter>

                    </Card>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
          )}

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

    const jobs = (await AxiosWrapper.get(`http://127.0.0.1:5000/search?project_id=${projectId}`, {
      accessToken: accessToken || "",
    })).data;

    return {
      props: {
        project, jobs, projectId, user,
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
