import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import AxiosWrapper from "../../utils/axiosWrapper";

export default function YoutubeDataCollection(
  {
    onClose,
    projects,
    user,
    setIsLoading,
    setStatus,
    status,
  },
) {
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

  return (
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
}
