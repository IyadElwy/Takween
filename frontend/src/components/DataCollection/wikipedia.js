import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Textarea,
} from "@nextui-org/react";
import AxiosWrapper from "../../utils/axiosWrapper";

export default function WikipediaDataCollection(
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

  const [titleError, setTitleError] = useState(false);
  const [selectedProjectError, setSelectedProjectError] = useState(false);
  const [urlsError, setUrlsError] = useState(false);
  const [selectedLanguageError, setSelectedLanguageError] = useState(false);

  const [jobData, setJobData] = useState({
    extractionType: "wikipedia",
    urls: null,
    language: null,
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

      <Textarea
        classNames="mt-5"
        type="text"
        label='Enter Wikipedia URLS separated by a comma ","'
        variant="bordered"
        fullWidth
        isInvalid={urlsError}
        errorMessage={urlsError && "Please Enter Wikipedia Urls"}
        onValueChange={(value) => {
          setJobData({ ...jobData, urls: value });
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
      <br />
      <br />
      {status === "Error" && <p className="text-s text-red-500 mt-3">An Error Ocurred</p>}
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
              if (!jobData.urls) return setUrlsError(true);
              setUrlsError(false);
              if (!jobData.language) return setSelectedLanguageError(true);
              setSelectedLanguageError(false);
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
