import { useState, useRef } from "react";
import {
  Button,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import AxiosWrapper from "../../utils/axiosWrapper";
import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function Ocr(
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

  const [titleError, setTitleError] = useState(false);
  const [selectedProjectError, setSelectedProjectError] = useState(false);

  const [jobData, setJobData] = useState({
    extractionType: "ocr",
    projectId: null,
    title: null,
  });

  //   const [files, setFiles] = useState([]);
  const filePondRef = useRef(null);
  const handleFileUpload = async () => {
    const files = filePondRef.current.getFiles();
    if (!jobData.projectId) return;

    try {
      setIsLoading(true);
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("jobData", JSON.stringify(jobData));

        formData.append("files", files.map((f) => f.file)[0]);

        await AxiosWrapper.post(`http://127.0.0.1:8000/projects/${jobData.projectId}/file-data-sources/ocr`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    } catch (err) {
      setStatus("Error");
      setTimeout(() => {
        setStatus("Success");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div>
        <FilePond
          ref={filePondRef}
          maxFiles={1}
          files={[]}
          acceptedFileTypes={["image/png", "image/jpeg"]} // Allow only PNG and JPG images
        />
      </div>

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
              setIsLoading(true);
              try {
                await handleFileUpload();
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
