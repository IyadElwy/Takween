/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@nextui-org/react";
import byteSize from "byte-size";
import { useState, useRef, useEffect } from "react";
import SplitPane from "react-split-pane-v2";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import Image from "next/image";
import AxiosWrapper from "../../../../utils/axiosWrapper";
import LoadingSymbol from "../../../Reusable/loadingSymbol";
import closerLookButtonStyles from "../../../../styles/components/Reusable/navbar.module.css";

export default function AddDataComponent({
  onClose,
  projectId,
  userId,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileKey, setSelectedFileKey] = useState([]);
  const [dataSourceName, setDataSourceName] = useState("erferf");
  const [chosenField, setChosenField] = useState("erfef");
  const [error, setError] = useState(false);

  useEffect(() => {
    // const fetchDataSources = async () => {
    //   setIsLoading(true);
    //   const dataSources = (await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/file-data-sources`)).data;
    //   setSelectedFiles(dataSources.map((ds) => ({
    //     id: ds.id,
    //     name: ds.file_name,
    //     type: ds.file_type,
    //     size: ds.size,
    //     exampleData: ds.exampleData,
    //   })));
    //   setIsLoading(false);
    // };

    // fetchDataSources();
  }, []);

  const fileInputRef = useRef(null);
  const handleFileChange = async (e) => {
    // try {
    //   setIsLoading(true);
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("project_id", projectId);
      formData.append("user_id", userId);
      formData.append("data_source_name", dataSourceName);
      formData.append("chosen_field", chosenField);

      const response = await AxiosWrapper.post("http://127.0.0.1:5004", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
        // const createdFile = response.data.created_file_data_sources;
        // const newFile = {
        //   id: createdFile.id,
        //   name: createdFile.file_name,
        //   type: createdFile.file_type,
        //   size: createdFile.size,
        //   exampleData: createdFile.exampleData,
        // };

      // const updatedSelectedFiles = [...selectedFiles, newFile];
      // setSelectedFiles(updatedSelectedFiles);
    }
    // } catch (err) {
    //   setError(true);
    //   setTimeout(() => {
    //     setError(false);
    //   }, 5000);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const getCurrentFile = () => selectedFiles.find((file) => file.id === selectedFileKey.currentKey);

  const getDataSampleView = () => {
    const currentFile = getCurrentFile();
    return (
      <JsonView src={currentFile.exampleData} />
    );
  };

  function truncate_with_ellipsis(s, maxLength) {
    if (s.length > maxLength) {
      return `${s.substring(0, maxLength)}...`;
    }
    return s;
  }

  return (
    isLoading ? <LoadingSymbol height={200} width={200} /> : (
      <>
        <div>
          <Table
            className="mt-3"
            aria-label="Example empty table"
            selectionMode="single"
            selectedKeys={selectedFileKey}
            onSelectionChange={setSelectedFileKey}
          >
            <TableHeader>
              <TableColumn>Data Source Name</TableColumn>
              <TableColumn>Owner</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No rows to display.">
              {selectedFiles.map((file) => {
                const {
                  id, data_source_name, user_id_of_owner,
                } = file;
                return (
                  <TableRow key={id}>
                    <TableCell>
                      {truncate_with_ellipsis(data_source_name, 20)}
                      {" "}
                    </TableCell>
                    <TableCell>
                      {
                      user_id_of_owner
                      }
                    </TableCell>
                  </TableRow>
                );
              })}

            </TableBody>
          </Table>
        </div>

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

        {error && (
        <p className="text-s text-red-500 mt-3">
          File type not supported
        </p>
        )}
        <div className="absolute bottom-0 left-5 mr-5 mb-5">
          <p className="text-xs text-gray-500 mt-3">
            Permitted file types are: csv, tsv, json | Files will be converted to Json
          </p>
        </div>
      </>
    )
  );
}
