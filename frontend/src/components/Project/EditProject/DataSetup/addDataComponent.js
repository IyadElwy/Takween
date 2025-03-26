/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Progress, ButtonGroup,
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
import DeleteDocumentIcon from "@/components/Icons/DeleteDocument";
import EditDocumentIcon from "@/components/Icons/EditDocumentIcons";

export default function AddDataComponent({
  onClose,
  projectId,
  userId,
}) {
  const [dataSources, setDataSources] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileKey, setSelectedFileKey] = useState([]);
  const [error, setError] = useState(false);

  const dataUploadWorker = new Worker(new URL("../../../../../workers/dataUpload.js", import.meta.url));
  dataUploadWorker.onmessage = (e) => {
    if (e.data.status === "done") {
      setDataSources((prevDataSources) => ({
        ...prevDataSources,
        [e.data.dataSourceId]: {
          ...prevDataSources[e.data.dataSourceId],
          status: "ready",
          loadingValue: 100,
        },
      }));
    }
  };

  useEffect(() => {
    const fetchDataSources = async () => {
      setIsLoading(true);
      const fetchedDataSources = (await AxiosWrapper.get(`http://127.0.0.1:5004/datasource/project/${projectId}`)).data;
      setDataSources({
        ...dataSources,
        ...fetchedDataSources.reduce((obj, v) => ({
          ...obj,
          [v.id]: {
            name: v.data_source_name,
            status: v.status,
            creationTime: v.creation_time,
            size: v.size,
            type: v.type,
            userIdOfOwner: v.user_id_of_owner,
            loadingValue: v.status === "ready" ? 100 : 0,
          },
        }), {}),
      });
      setIsLoading(false);
    };

    fetchDataSources();
  }, []);

  useEffect(() => () => {
    dataUploadWorker.terminate();
  }, []);

  const fileInputRef = useRef(null);
  const handleChooseFile = async (e) => {
    try {
      if (e.target.files.length > 0) {
        const formData = new FormData();
        formData.append("project_id", projectId);
        formData.append("user_id", userId);
        formData.append("data_source_name", e.target.files[0].name);

        const { dataSourceId, presignedPutUrl } = await AxiosWrapper.post("http://127.0.0.1:5004/datasource/init", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response) => response.data);
        setDataSources((prevDataSources) => ({
          ...prevDataSources,
          [dataSourceId]: {
            name: e.target.files[0].name,
            status: "processing",
            loadingValue: 0,
          },
        }));

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
      <div className="flex flex-col max-h-[90vh] w-full overflow-hidden">

        {/* Table Container (Scrolls inside) */}
        <div className="flex-1 overflow-auto">
          <Table
            className="p-2 bg-white rounded-lg shadow-md"
            aria-label="Example empty table"
            selectionMode="single"
            selectedKeys={selectedFileKey}
            onSelectionChange={setSelectedFileKey}
          >
            <TableHeader>
              <TableColumn className="text-center">Data Source Name</TableColumn>
              <TableColumn className="text-center">Owner</TableColumn>
              <TableColumn className="text-center">Created</TableColumn>
              <TableColumn className="text-center">Type</TableColumn>
              <TableColumn className="text-center">Size</TableColumn>
              <TableColumn className="text-center">Edit</TableColumn>
              <TableColumn className="text-center">Status</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No rows to display.">
              {Object.entries(dataSources).map(([id, {
                name, status, loadingValue, creationTime, size, type, userIdOfOwner,
              }]) => (
                <TableRow key={id}>
                  <TableCell className="text-center">{truncate_with_ellipsis(name, 20)}</TableCell>
                  <TableCell className="text-center">{userIdOfOwner}</TableCell>
                  <TableCell className="text-center">{creationTime}</TableCell>
                  <TableCell className="text-center">{type}</TableCell>
                  <TableCell className="text-center">{size}</TableCell>
                  <TableCell className="text-center">
                    <Button color="danger" startContent={<DeleteDocumentIcon />} variant="bordered">
                      Delete Datasource
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Progress
                      isIndeterminate={status === "processing"}
                      aria-label="Uploading..."
                      className="max-w-md"
                      color="success"
                      showValueLabel
                      size="sm"
                      value={loadingValue}
                      label={status === "processing" ? "Uploading..." : "Ready"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Section (Fixed, No Extra Scroll) */}
        <div className="py-2 flex items-center justify-between px-5 border-t">
          <p className="text-xs text-gray-500">
            Permitted file types: csv, tsv, json | Files will be converted to Json
          </p>
          <div className="flex space-x-4">
            <Button onPress={() => fileInputRef.current.click()} variant="bordered">
              Choose File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChooseFile}
                className="hidden"
              />
            </Button>
            <Button onPress={onClose}>Done</Button>
          </div>
        </div>

        {error && (
          <p className="text-s text-red-500 text-center mt-1">
            File type not supported
          </p>
        )}
      </div>
    )
  );
}
