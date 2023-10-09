import {
  ScrollShadow,
  Divider,
  Card, CardHeader, CardFooter, CardBody,
  Avatar, useDisclosure, Modal, ModalBody, ModalContent,

} from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment-timezone";
import Navigation from "../../../components/Reusable/Navigation/navBarSideBar";
import AddDataComponent from "../../../components/Project/EditProject/DataSetup/addDataComponent";

export default function ProjectDetailPage({ projectId, project, jobs }) {
  const {
    isOpen,
    onOpen,
    onOpenChange,
  } = useDisclosure();

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
                <AddDataComponent projectId={projectId} onClose={onClose} />
              </ModalBody>
            )}
          </ModalContent>
        </Modal>

        <div className="flex">
          <div className="w-2/6 bg-300 p-4">
            <h1 style={{ fontSize: "25px", marginBottom: "10px" }}>Annotation Jobs</h1>
            <ScrollShadow className="w-[300px] h-[400px]">

              {jobs.map((job) => (
                <Link href={`${project.id}/jobs/${job.id}`} key={job.id}>
                  <div className="mr-2 ml-2">
                    <Card className="mb-4 mt-4 mr-3 w-full" isPressable>
                      <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                          <p className="text-md">{job.title}</p>
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
                          name="Avatar"
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
            <h4>{project.description}</h4>
            <br />
            <Divider />
            <br />
            <Card
              className="max-w-[220px] min-w-[220px] min-h-[100px] max-h-[100px]"
              isPressable
              onPress={onOpen}
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
                    Add data by uploading
                    {" "}
                    <strong>Files</strong>
                  </p>
                </div>
              </CardHeader>

            </Card>
            <br />
            <Divider />
            <br />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card
                className="py-4"
                isPressable
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
              <Card className="py-4" isPressable>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">Edit your Project Settings</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <br />
                  <center>
                    <Image
                      height={50}
                      alt="Card background"
                      className="object-cover rounded-xl"
                      src="/images/settings.svg"
                      width={80}
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

  const resProjectData = await fetch(`http://localhost:8000/projects/${projectId}`);
  const project = await resProjectData.json();
  const resJobData = await fetch(`http://localhost:8000/projects/${projectId}/jobs`);
  const jobs = await resJobData.json();

  return { props: { project: project.project, jobs: jobs.jobs, projectId } };
}
