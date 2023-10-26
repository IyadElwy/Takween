/* eslint-disable max-len */
import { useState } from "react";
import {
  Card, useDisclosure, Modal, ModalBody, ModalContent,
  Button,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import Image from "next/image";
import cookieParse from "cookie-parse";
import Navigation from "../../components/Reusable/Navigation/navBarSideBar";
import LoadingSymbol from "../../components/Reusable/loadingSymbol";
import AxiosWrapper from "../../utils/axiosWrapper";

export default function DataCollectionPage({ projects, user }) {
  const {
    isOpen,
    onOpen,
    onOpenChange,
  } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [modalComponent, setModalComponent] = useState(null);

  const [selectedProject, setSelectedProject] = useState(new Set([]));
  const [selectedLanguage, setSelectedLanguage] = useState(new Set([]));
  const [selectedOrder, setSelectedOrder] = useState(new Set([]));
  const [selectedNumberOfPages, setSelectedNumberOfPages] = useState(new Set([]));
  const [selectedCommentsPerVideo, setSelectedCommentsPerVideo] = useState(new Set([]));

  const [titleError, setTitleError] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [selectedProjectError, setSelectedProjectError] = useState(false);
  const [queryError, setQueryError] = useState(false);
  const [selectedLanguageError, setSelectedLanguageError] = useState(false);
  const [selectedOrderError, setSelectedOrderError] = useState(false);
  const [selectedNumberOfPagesError, setSelectedNumberOfPagesError] = useState(false);
  const [selectedCommentsPerVideoError, setSelectedCommentsPerVideoError] = useState(false);

  const [jobData, setJobData] = useState({
    extractionType: "youtube",
    apiKey: null,
    query: null,
    language: null,
    order: null,
    numberOfPages: null,
    commentsPerVideo: null,
    projectId: null,
    title: null,
  });

  const getCurrentModalComponent = (onClose) => {
    if (status === "Done") {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-4xl text-center">Data Extraction Successful!</p>
        </div>
      );
    }

    switch (modalComponent) {
      case "youtube":
        return isLoading ? <LoadingSymbol height={200} width={200} /> : (
          <div>
            <Input
              type="text"
              label="Data Source Title"
              variant="bordered"
              fullWidth
              isInvalid={titleError}
              errorMessage={titleError && "Please Enter a title"}
              onValueChange={(value) => {
                setJobData({ ...jobData, title: value });
              }}
            />

            <Select
              className="mt-5 mb-5"
              fullWidth
              disallowEmptySelection
              label="Save to Project..."
              selectedKeys={selectedProject}
              isInvalid={selectedProjectError}
              errorMessage={selectedProjectError && "Please Select a Project"}
              onSelectionChange={(e) => {
                setJobData({ ...jobData, projectId: e.currentKey });
                setSelectedProject(e);
              }}
            >
              {projects.filter((project) => {
                const foundUser = project.assigned_users.find((currUser) => currUser.id === user.id);
                if (foundUser) {
                  return true;
                }
                return false;
              }).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="text"
              label="Youtube API Key"
              variant="bordered"
              fullWidth
              isInvalid={apiKeyError}
              errorMessage={apiKeyError && "Please Enter an API KEY"}
              onValueChange={(value) => {
                setJobData({ ...jobData, apiKey: value });
              }}
            />
            <br />
            <Input
              classNames="mt-5"
              type="text"
              label="Query"
              variant="bordered"
              fullWidth
              isInvalid={queryError}
              errorMessage={queryError && "Please Enter Query"}
              onValueChange={(value) => {
                setJobData({ ...jobData, query: value });
              }}
            />
            <Select
              className="mt-5"
              fullWidth
              disallowEmptySelection
              label="Language"
              selectedKeys={selectedLanguage}
              isInvalid={selectedLanguageError}
              errorMessage={selectedLanguageError && "Please Select a Language"}
              onSelectionChange={(e) => {
                setJobData({ ...jobData, language: e.currentKey });
                setSelectedLanguage(e);
              }}
            >
              {["Arabic", "English"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="mt-5"
              fullWidth
              disallowEmptySelection
              label="Order"
              selectedKeys={selectedOrder}
              isInvalid={selectedOrderError}
              errorMessage={selectedOrderError && "Please Select an Order"}
              onSelectionChange={(e) => {
                setJobData({ ...jobData, order: e.currentKey });
                setSelectedOrder(e);
              }}
            >
              {["viewCount", "date", "rating", "relevance"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="mt-5"
              fullWidth
              disallowEmptySelection
              label="Pages"
              selectedKeys={selectedNumberOfPages}
              isInvalid={selectedNumberOfPagesError}
              errorMessage={selectedNumberOfPagesError && "Please Select Number of Pages"}
              onSelectionChange={(e) => {
                setJobData({ ...jobData, numberOfPages: e.currentKey });
                setSelectedNumberOfPages(e);
              }}
            >
              {["5", "10", "15", "20", "50", "100", "Until Pages Or Quota Exceeded"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="mt-5"
              fullWidth
              disallowEmptySelection
              label="Comments Pages Per Video"
              selectedKeys={selectedCommentsPerVideo}
              isInvalid={selectedCommentsPerVideoError}
              errorMessage={selectedCommentsPerVideoError && "Please Select Comments Per Video"}
              onSelectionChange={(e) => {
                setJobData({ ...jobData, commentsPerVideo: e.currentKey });
                setSelectedCommentsPerVideo(e);
              }}
            >
              {["5", "10", "15", "20", "50", "100", "Until Comments Or Quota Exceeded"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </Select>
            <br />
            <br />
            {status === "Error" && <p className="text-s text-red-500 mt-3">An Error Ocurred, please check your API Key</p>}
            <br />
            <br />
            <br />

            <div className="absolute bottom-0 right-0 mr-5 mb-5">
              <div className="flex space-x-4">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  // eslint-disable-next-line consistent-return
                  onPress={async () => {
                    if (!jobData.title) return setTitleError(true);
                    setTitleError(false);
                    if (!jobData.projectId) return setSelectedProjectError(true);
                    setSelectedProjectError(false);
                    if (!jobData.apiKey) return setApiKeyError(true);
                    setApiKeyError(false);
                    if (!jobData.query) return setQueryError(true);
                    setQueryError(false);
                    if (!jobData.language) return setSelectedLanguageError(true);
                    setSelectedLanguageError(false);
                    if (!jobData.order) return setSelectedOrderError(true);
                    setSelectedOrderError(false);
                    if (!jobData.numberOfPages) return setSelectedNumberOfPagesError(true);
                    setSelectedNumberOfPagesError(false);
                    if (!jobData.commentsPerVideo) return setSelectedCommentsPerVideoError(true);
                    setSelectedCommentsPerVideoError(false);

                    setIsLoading(true);
                    try {
                      await AxiosWrapper.post(
                        "http://127.0.0.1:8000/data-collection",
                        jobData,
                      );
                    } catch (err) {
                      setStatus("Error");
                    }
                    setIsLoading(false);
                    setStatus("Done");
                    setTimeout(() => {
                      onClose();
                      setStatus("");
                      setSelectedProject({
                        extractionType: "youtube",
                        apiKey: null,
                        query: null,
                        language: null,
                        order: null,
                        numberOfPages: null,
                        commentsPerVideo: null,
                        projectId: null,
                        title: null,
                      });

                      setSelectedProject(new Set([]));
                      setSelectedLanguage(new Set([]));
                      setSelectedOrder(new Set([]));
                      setSelectedNumberOfPages(new Set([]));
                      setSelectedCommentsPerVideo(new Set([]));
                    }, 3000);
                  }}
                  style={{ marginBottom: "10px" }}
                  variant="bordered"
                >
                  Start Job
                </Button>

              </div>

            </div>
          </div>
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
              alt="Woman listing to music"
              className="object-cover"
              height={200}
              src="/images/youtube.svg"
              width={200}
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
    console.log(error);
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
