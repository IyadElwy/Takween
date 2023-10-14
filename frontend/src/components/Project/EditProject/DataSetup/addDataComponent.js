/* eslint-disable max-len */
import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@nextui-org/react";
import byteSize from "byte-size";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import SplitPane from "react-split-pane-v2";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

import LoadingSymbol from "../../../Reusable/loadingSymbol";

export default function AddDataComponent({
  onClose,
  projectId,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileKey, setSelectedFileKey] = useState([]);

  useEffect(() => {
    const fetchDataSources = async () => {
      setIsLoading(true);
      const resDataSources = await fetch(`http://localhost:8000/projects/${projectId}/file-data-sources`);
      const dataSources = await resDataSources.json();
      setSelectedFiles(dataSources.map((ds) => ({
        id: ds.id,
        name: ds.file_name,
        type: ds.file_type,
        size: ds.size,
        exampleData: ds.exampleData,
      })));
      setIsLoading(false);
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
      const createdFile = response.data.created_file_data_sources;
      const newFile = {
        id: createdFile.id,
        name: createdFile.file_name,
        type: createdFile.file_type,
        size: createdFile.size,
        exampleData: createdFile.exampleData,
      };

      const updatedSelectedFiles = [...selectedFiles, newFile];
      setSelectedFiles(updatedSelectedFiles);
      setIsLoading(false);
    }
  };

  const getCurrentFile = () => selectedFiles.find((file) => file.id === selectedFileKey.currentKey);

  const getDataSampleView = () => {
    const currentFile = getCurrentFile();
    return (
      <JsonView src={currentFile.exampleData} />
    );
  };

  return (
    isLoading ? <LoadingSymbol height={200} width={200} /> : (
      <>
        <SplitPane
          split="vertical"
          minSize={100}
          maxSize={-100}
          defaultSize="50%"

        >

          <div
            className="m-1"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <Table
              className="mt-3"
              aria-label="Example empty table"
              selectionMode="single"
              selectedKeys={selectedFileKey}
              onSelectionChange={setSelectedFileKey}
            >
              <TableHeader>
                <TableColumn>File Name</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Size</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No rows to display.">
                {selectedFiles.map((file) => {
                  const {
                    id, name, size, type,
                  } = file;
                  return (
                    <TableRow key={id}>
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
          </div>

          <div
            className="m-1"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {selectedFileKey.length === 0 ? (
              <center>
                {" "}
                <div className="min-h-screen flex items-center justify-center">
                  <h1 className="text-2xl  text-center">Choose a file to see more</h1>
                </div>

              </center>
            )
              : (
                getDataSampleView()
              )}
          </div>
        </SplitPane>

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
