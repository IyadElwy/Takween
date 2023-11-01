/* eslint-disable max-len */
import { useState } from "react";
import {
  Card, useDisclosure, Modal, ModalBody, ModalContent,
} from "@nextui-org/react";
import Image from "next/image";
import cookieParse from "cookie-parse";
import Navigation from "../../components/Reusable/Navigation/navBarSideBar";
import LoadingSymbol from "../../components/Reusable/loadingSymbol";
import AxiosWrapper from "../../utils/axiosWrapper";
import YoutubeDataCollection from "../../components/DataCollection/youtube";
import WikipediaDataCollection from "../../components/DataCollection/wikipedia";

export default function DataCollectionPage({ projects, user }) {
  const {
    isOpen,
    onOpen,
    onOpenChange,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [modalComponent, setModalComponent] = useState(null);

  const getCurrentModalComponent = (onClose) => {
    if (status === "Done") {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-4xl text-center">Data Extraction Successful!</p>
        </div>
      );
    }

    if (isLoading) return <LoadingSymbol height={200} width={200} />;

    switch (modalComponent) {
      case "youtube":
        return (
          <YoutubeDataCollection
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );

      case "wikipedia":
        return (
          <WikipediaDataCollection
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navigation
        showCreateProjectButton={false}
        breadcrumbs={[
          { text: "Data Collection", href: "/home/data-collection" },
        ]}
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

      <div
        style={{ margin: "20px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >

        <div key="youtube" className="p-4">
          <Card
            isFooterBlurred
            radius="lg"
            isPressable
            className="border-none"
            onPress={() => {
              setModalComponent("youtube");
              onOpen();
            }}
          >
            <Image
              alt="Youtube"
              className="object-cover"
              height={200}
              src="/images/youtube.svg"
              width={200}
            />
          </Card>
        </div>
        <div key="wikipedia" className="p-4">
          <Card
            isFooterBlurred
            radius="lg"
            isPressable
            className="border-none"
            onPress={() => {
              setModalComponent("wikipedia");
              onOpen();
            }}
          >
            <Image
              alt="wikipedia"
              className="object-cover"
              height={220}
              style={{ padding: "20px" }}
              src="/images/wikipedia.png"
              width={220}
            />
          </Card>
        </div>

      </div>

    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie || "";
  const { accessToken } = cookieParse.parse(cookies);

  try {
    const projects = (await AxiosWrapper.get("http://127.0.0.1:8000/projects", {
      accessToken: accessToken || "",
    })).data;

    const projectsWithUsers = await Promise.all(projects.map(async (project) => {
      const userCreatedProject = (await AxiosWrapper.get(`http://localhost:8000/users/${project.created_by_id}`, {
        accessToken: accessToken || "",
      })).data;
      return { ...project, user: userCreatedProject };
    }));

    const user = (await AxiosWrapper.get("http://127.0.0.1:8000/currentuser", {
      accessToken: accessToken || "",
    })).data;

    return { props: { projects: projectsWithUsers, user } };
  } catch (error) {
    if (error.response && error.response.status === 401) {
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
