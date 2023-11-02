import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import AxiosWrapper from "../../utils/axiosWrapper";

export default function Tokenizing({
  onClose,
  projects,
  user,
  setIsLoading,
  setStatus,
  status,
}) {
  const [selectedProject, setSelectedProject] = useState(new Set([]));
  const [selectedDataSource, setSelectedDataSource] = useState(new Set([]));
  const [selectedFieldToProcess, setSelectedFieldToProcess] = useState(new Set([]));

  const [titleError, setTitleError] = useState(false);
  const [selectedProjectError, setSelectedProjectError] = useState(false);
  const [selectedDataSourceError, setSelectedDataSourceError] = useState(false);
  const [selectedFieldToProcessError, setSelectedFieldToProcessError] = useState(false);

  const [jobData, setJobData] = useState({
    processingType: "tokenizing",
    title: null,
    projectId: null,
    dataSourceId: null,
    fieldToProcess: null,
  });

  const getKeysFromExampleData = (exampleData) => {
    let parsedExample = exampleData;
    if (Array.isArray(parsedExample)) {
      [parsedExample] = exampleData;
    }
    return Object.keys(parsedExample);
  };

  return (
    <div>
      <br />
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
        className="mt-5"
        fullWidth
        disallowEmptySelection
        label="Select Project..."
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

      <Select
        className="mt-5 mb-5"
        fullWidth
        disallowEmptySelection
        label="Select Data Source..."
        selectedKeys={selectedDataSource}
        isInvalid={selectedDataSourceError}
        errorMessage={selectedDataSourceError && "Please Select a DataSource"}
        isDisabled={!jobData.projectId}
        onSelectionChange={(e) => {
          setJobData({ ...jobData, dataSourceId: e.currentKey });
          setSelectedDataSource(e);
        }}
      >
        {jobData.projectId
        && projects.find((proj) => proj.id === jobData.projectId).dataSources.map((ds) => (
          <SelectItem key={ds.id} value={ds.id}>
            {ds.file_name}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Field to Process"
        size="lg"
        isDisabled={!jobData.dataSourceId}
        selectedKeys={selectedFieldToProcess}
        onSelectionChange={(e) => {
          setJobData({ ...jobData, fieldToProcess: e.currentKey });
          setSelectedFieldToProcess(e);
        }}
        isInvalid={selectedFieldToProcessError}
        errorMessage={selectedFieldToProcessError && "Please choose a field to process"}
      >
        {jobData.projectId
        && jobData.dataSourceId
         && getKeysFromExampleData(projects.find((proj) => proj.id === jobData.projectId)
           .dataSources.find((ds) => ds.id === jobData.dataSourceId).exampleData).map((option) => (
             <SelectItem key={option} value={option}>
               {`${option}`}
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
              if (!jobData.dataSourceId) return setSelectedDataSourceError(true);
              setSelectedDataSourceError(false);
              if (!jobData.fieldToProcess) return setSelectedFieldToProcessError(true);
              setSelectedFieldToProcessError(false);
              setIsLoading(true);
              try {
                await AxiosWrapper.post(
                  "http://127.0.0.1:8000/data-processing",
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
            Start Processing
          </Button>

        </div>

      </div>
    </div>
  );
}
