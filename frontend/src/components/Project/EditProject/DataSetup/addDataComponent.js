import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@nextui-org/react";
import byteSize from "byte-size";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import LoadingSymbol from "../../../Reusable/loadingSymbol";

export default function AddDataComponent({
  onClose,
  projectId,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchDataSources = async () => {
      const resDataSources = await fetch(`http://localhost:8000/projects/${projectId}/file-data-sources`);
      const dataSources = await resDataSources.json();
      setSelectedFiles(dataSources.map((ds) => ({
        name: ds.file_name,
        type: ds.file_type,
        size: ds.size,
      })));
    };

    fetchDataSources();
  }, []);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    setIsLoading(true);
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("files", e.target.files[0]);

      const response = await axios.post(`http://127.0.0.1:8000/projects/${projectId}/file-data-sources`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const createdFiles = response.data.created_file_data_sources[0];
      const newFile = {
        name: createdFiles.file_name,
        type: createdFiles.file_type,
        size: createdFiles.size,
      };

      const updatedSelectedFiles = [...selectedFiles, newFile];
      setSelectedFiles(updatedSelectedFiles);
      setIsLoading(false);
    }
  };

  return (
    isLoading ? <LoadingSymbol height={200} width={200} /> : (
      <>
        <Table className="mt-3" aria-label="Example empty table">
          <TableHeader>
            <TableColumn>File Name</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Size</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No rows to display.">
            {selectedFiles.map((file) => {
              const { name, size, type } = file;
              return (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell>
                    {byteSize(size).value}
                    {" "}
                    {byteSize(size).unit}
                  </TableCell>
                </TableRow>
              );
            })}

          </TableBody>
        </Table>
        <div className="absolute bottom-0 right-0 mr-5 mb-5">
          <div className="flex space-x-4">

            <Button
              onPress={() => fileInputRef.current.click()}
              style={{ marginBottom: "10px" }}
              variant="bordered"
            >
              Upload File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="border rounded-lg px-4 py-2 mr-5"
                style={{ display: "none" }}
              />

            </Button>
            <Button onPress={() => {
              onClose();
            }}
            >
              Done
            </Button>

          </div>
        </div>

      </>
    )
  );
}
