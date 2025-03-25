/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, CircularProgress,
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
  const [dataSources, setDataSources] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileKey, setSelectedFileKey] = useState([]);
  const [dataSourceName, setDataSourceName] = useState("erferf");
  const [error, setError] = useState(false);

  const [value, setValue] = useState(0);

  const dataUploadWorker = new Worker(new URL("../../../../../workers/dataUpload.js", import.meta.url));
  dataUploadWorker.onmessage = (e) => {
    console.log(e.data);
    // if (e.data.progress) {
    setValue(e.data.progress);
    // }
    // setIsLoading(false);
  };

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
  }, [value]);

  const fileInputRef = useRef(null);
  const handleChooseFile = async (e) => {
    try {
      // setIsLoading(true);
      if (e.target.files.length > 0) {
        const formData = new FormData();
        formData.append("project_id", projectId);
        formData.append("user_id", userId);
        formData.append("data_source_name", dataSourceName);

        const { dataSourceId, presignedPutUrl } = await AxiosWrapper.post("http://127.0.0.1:5004/datasource/init", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response) => response.data);

        setDataSources({
          [dataSourceId]: {

          },
        });

        dataUploadWorker.postMessage({ dataSourceId, presignedPutUrl, file: e.target.files[0] });

        // fetch(presignedPutUrl, {
        //   method: "PUT",
        //   body: e.target.files[0],
        // }).then(() => {
        //   console.log("finished");
        // }).catch((the_err) => {
        //   console.log(the_err);
        // });

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
    } catch (err) {
      //   setError(true);
      //   setTimeout(() => {
      //     setError(false);
      //   }, 5000);
    } finally {
      // setIsLoading(false);
    }
  };

  // const getCurrentFile = () => selectedFiles.find((file) => file.id === selectedFileKey.currentKey);

  // const getDataSampleView = () => {
  //   const currentFile = getCurrentFile();
  //   return (
  //     <JsonView src={currentFile.exampleData} />
  //   );
  // };

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
              {/* {Object.entries(dataSources).forEach((file) => { */}
              { /* const {
                  id, data_source_name, user_id_of_owner,
                } = file; */ }
              {/* return ( */}
              <TableRow key={1}>
                <TableCell>
                  {/* {truncate_with_ellipsis(data_source_name, 20)} */}
                  {/* {" "} */}
                  <CircularProgress
                    aria-label="Loading..."
                    color="success"
                    showValueLabel
                    size="lg"
                    value={value}
                  />
                </TableCell>
                <TableCell>
                  {/* {
                        user_id_of_owner
                      } */}
                </TableCell>
              </TableRow>
              {/* ); */}
              {/* })} */}

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
              Choose File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChooseFile}
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
