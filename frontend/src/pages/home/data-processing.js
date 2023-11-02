/* eslint-disable max-len */
import { useState } from "react";
import {
  useDisclosure, Modal, ModalBody, ModalContent, CardFooter,
  Tabs, Tab, Card,
} from "@nextui-org/react";
import Image from "next/image";
import cookieParse from "cookie-parse";
import Navigation from "../../components/Reusable/Navigation/navBarSideBar";
import LoadingSymbol from "../../components/Reusable/loadingSymbol";
import AxiosWrapper from "../../utils/axiosWrapper";
import DuplicateRemoval from "../../components/DataProcessing/duplicateRemoval";
import Merging from "../../components/DataProcessing/merging";
import Flattening from "../../components/DataProcessing/flattening";
import DiacriticsRemoval from "../../components/DataProcessing/diacriticsRemoval";
import PunctuationRemoval from "../../components/DataProcessing/punctuationRemoval";
import StopWordRemoval from "../../components/DataProcessing/stopWordRemoval";
import TextAnonymization from "../../components/DataProcessing/textAnonymization";
import Tokenizing from "../../components/DataProcessing/tokenizing";

export default function DataProcessing({ projects, user }) {
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
          <p className="text-4xl text-center">Data Processing Successful!</p>
        </div>
      );
    }

    if (isLoading) return <LoadingSymbol height={200} width={200} />;

    switch (modalComponent) {
      case "duplicateRemoval":
        return (
          <DuplicateRemoval
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );
      case "flattening":
        return (
          <Flattening
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );

      case "merging":
        return (
          <Merging
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );
      case "stopWordRemoval":
        return (
          <StopWordRemoval
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );
      case "punctuationRemoval":
        return (
          <PunctuationRemoval
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );
      case "textAnonymization":
        return (
          <TextAnonymization
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );

      case "diacriticsRemoval":
        return (
          <DiacriticsRemoval
            onClose={onClose}
            projects={projects}
            user={user}
            setIsLoading={setIsLoading}
            setStatus={setStatus}
            status={status}
          />
        );

      case "tokenizing":
        return (
          <Tokenizing
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
          { text: "Data Processing", href: "/home/data-processing" },
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
      <div className="flex w-full flex-col">
        <Tabs
          fullWidth
          aria-label="Options"
          size="lg"
          radius="none"
        >
          <Tab key="Arabic" title="Arabic">
            <div
              style={{ margin: "20px" }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <div key="duplicateRemoval" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("duplicateRemoval");
                    onOpen();
                  }}
                >
                  <Image
                    alt="Youtube"
                    className="object-cover"
                    height={200}
                    style={{ padding: "33px" }}
                    src="/images/duplicates.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Duplicate Removal</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              <div key="flattening" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("flattening");
                    onOpen();
                  }}
                >
                  <Image
                    style={{ padding: "33px" }}
                    alt="flattening"
                    className="object-cover"
                    height={200}
                    src="/images/bulldozer.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Flatten Data</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              <div key="merging" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("merging");
                    onOpen();
                  }}
                >
                  <Image
                    alt="merging"
                    className="object-cover"
                    height={200}
                    style={{ padding: "33px" }}
                    src="/images/merge.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Merge Data Sources</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div key="stopWordRemoval" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("stopWordRemoval");
                    onOpen();
                  }}
                >
                  <Image
                    alt="stopWordRemoval"
                    style={{ padding: "10px" }}
                    className="object-cover"
                    height={200}
                    src="/images/stopword.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Remove Stop-words</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div key="punctuationRemoval" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("punctuationRemoval");
                    onOpen();
                  }}
                >
                  <Image
                    alt="punctuationRemoval"
                    style={{ padding: "33px" }}
                    className="object-cover"
                    height={200}
                    src="/images/punctuation.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Remove Punctuations</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              <div key="textAnonymization" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("textAnonymization");
                    onOpen();
                  }}
                >
                  <Image
                    alt="textAnonymization"
                    className="object-cover"
                    style={{ padding: "40px" }}
                    height={200}
                    src="/images/anonymous.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Text Anonymization</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div key="diacriticsRemoval" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("diacriticsRemoval");
                    onOpen();
                  }}
                >
                  <Image
                    alt="diacriticsRemoval"
                    className="object-cover"
                    style={{ padding: "20px" }}
                    height={200}
                    src="/images/arabic.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Diacritics Removal</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div key="tokenizing" className="p-4">
                <Card
                  isFooterBlurred
                  radius="lg"
                  isPressable
                  className="border-none"
                  onPress={() => {
                    setModalComponent("tokenizing");
                    onOpen();
                  }}
                >
                  <Image
                    alt="tokenizing"
                    className="object-cover"
                    style={{ padding: "40px" }}
                    height={200}
                    src="/images/tokenizing.svg"
                    width={200}
                  />
                  <CardFooter className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="items-center justify-center">
                      <p className="text-black/80 text-center">Tokenizing Data</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>

            </div>
          </Tab>
          <Tab key="English" title="English" />
        </Tabs>
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

    const projectsWithUsersDataSources = await Promise.all(projects.map(async (project) => {
      const userCreatedProject = (await AxiosWrapper.get(`http://localhost:8000/users/${project.created_by_id}`, {
        accessToken: accessToken || "",
      })).data;
      const fileDataSources = (await AxiosWrapper.get(`http://localhost:8000/projects/${project.id}/file-data-sources`, {
        accessToken: accessToken || "",
      })).data;
      return { ...project, user: userCreatedProject, dataSources: fileDataSources };
    }));

    const user = (await AxiosWrapper.get("http://127.0.0.1:8000/currentuser", {
      accessToken: accessToken || "",
    })).data;

    return { props: { projects: projectsWithUsersDataSources, user } };
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
