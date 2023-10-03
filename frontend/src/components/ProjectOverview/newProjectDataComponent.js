import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@nextui-org/react";
import axios from "axios";

import { useState } from "react";

export default function NewProjectDataComponent({
  project, setProject, selectedFile, setSelectedFile,
  setDataErrorState,
}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(`http://127.0.0.1:8000/projects/upload-file/${project.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.data;
      setUploadedFiles([data.dataFileName]);
      setDataErrorState(true);
      setProject({
        ...project,
        dataFileName: data.dataFileName,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleFileChange}
        className="border rounded-lg px-4 py-2 mr-5"
      />

      <Button
        onPress={handleUpload}
        style={{ marginBottom: "10px" }}
        variant="bordered"
      >
        Upload
      </Button>
      <Table aria-label="Example empty table">
        <TableHeader>
          <TableColumn>File Name</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Size</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No rows to display.">
          {uploadedFiles.map((file) => (
            <TableRow key={file}>
              <TableCell>{file}</TableCell>
              <TableCell>Not Yet</TableCell>
              <TableCell>Not Yet</TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>

    </>

  );
}
