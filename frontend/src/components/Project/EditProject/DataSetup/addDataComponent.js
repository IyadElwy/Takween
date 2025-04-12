/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow,
  TableCell, Progress, Modal, ModalBody, ModalContent, useDisclosure, Tooltip, Avatar,
} from "@nextui-org/react";
import byteSize from "byte-size";
import { useState, useRef, useEffect } from "react";
import SplitPane from "react-split-pane-v2";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import AxiosWrapper from "../../../../utils/axiosWrapper";
import LoadingSymbol from "../../../Reusable/loadingSymbol";
import closerLookButtonStyles from "../../../../styles/components/Reusable/navbar.module.css";
import DeleteDocumentIcon from "@/components/Icons/DeleteDocument";
import EditDocumentIcon from "@/components/Icons/EditDocumentIcons";

export default function AddDataComponent({
  onClose,
  projectId,
  userId,
  projectOwnerUserId,
}) {
  const [dataSources, setDataSources] = useState({});
  const [currentDataSourceToDeleteId, setCurrentDataSourceToDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileKey, setSelectedFileKey] = useState([]);
  const [error, setError] = useState(false);

  const {
    isOpen: isOpenModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure();

  const fetchDataSources = async () => {
    setIsLoading(true);
    const fetchedDataSources = (await AxiosWrapper.get(`http://127.0.0.1:5004/datasource/project/${projectId}`)).data;
    setDataSources({
      ...fetchedDataSources.reduce((obj, v) => ({
        ...obj,
        [v.id]: {
          name: v.data_source_name,
          status: v.status,
          creationTime: v.creation_time,
          size: v.size,
          type: v.type,
          userIdOfOwner: v.user_id_of_owner,
          ownerEmail: v.owner_email,
          loadingValue: v.status === "ready" ? 100 : 0,
        },
      }), {}),
    });
    setIsLoading(false);
  };

  const dataUploadWorker = new Worker(new URL("../../../../../workers/dataUpload.js", import.meta.url));
  dataUploadWorker.onmessage = async (e) => {
    if (e.data.status === "done") {
      setDataSources((prevDataSources) => ({
        ...prevDataSources,
        [e.data.dataSourceId]: {
          ...prevDataSources[e.data.dataSourceId],
          status: "processing",
          loadingValue: 100,
        },
      }));

      const checkIfDataSourceIsReady = async () => {
        const fetchedDataSources = (await AxiosWrapper.get(`http://127.0.0.1:5004/datasource/project/${projectId}`)).data;
        const dsArray = Object.entries(fetchedDataSources);
        for (let i = 0; i < dsArray.length; i++) {
          const ds = dsArray[i][1];
          if (Number(ds.id) === Number(e.data.dataSourceId) && ds.status === "ready") {
            fetchDataSources();
            return;
          }
        }
        setTimeout(checkIfDataSourceIsReady, 5000);
      };
      checkIfDataSourceIsReady();
    }
  };

  useEffect(() => {
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

  const isoToPrettyDate = (isoDate) => {
    if (isoDate === undefined || isoDate === null) {
      return "None";
    }
    const date = new Date(isoDate);
    const options = {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    };
    return date.toLocaleString("en-US", options);
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
        <Modal
          style={{
            height: "150px",
          }}
          isOpen={isOpenModalDelete}
          onOpenChange={onOpenChangeModalDelete}
          isDismissable={false}
          size="sm"
          scrollBehavior="inside"
          backdrop="blur"
          hideCloseButton
        >
          <ModalContent>
            {(onCloseDeleteModal) => (
              <ModalBody>

                <div className="text-4xl">Are you sure?</div>
                <p className="text-xs text-gray-500">This action cannot be undone</p>

                <div className="absolute bottom-0 right-0 mr-5 mb-5 pt-3">
                  <div className="flex space-x-4">
                    <Button
                      color="default"
                      variant="solid"
                      onPress={() => {
                        onCloseDeleteModal();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="danger"
                      variant="ghost"
                      onPress={async () => {
                        await AxiosWrapper.delete(`http://localhost:5004/datasource/project/${projectId}/${currentDataSourceToDeleteId}`);
                        fetchDataSources();
                        onCloseDeleteModal();
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>

              </ModalBody>
            )}
          </ModalContent>
        </Modal>

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
                {Object.entries(dataSources).map(([dataSourceId, {
                  name, status, loadingValue, creationTime, size, type, userIdOfOwner,
                  ownerEmail,
                }]) => (
                  <TableRow key={dataSourceId}>
                    <TableCell className="text-center">
                      <Tooltip content={`${name}`}>
                        <span className="cursor-pointer">{truncate_with_ellipsis(name, 40)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`${ownerEmail}`}>
                        <span className="cursor-pointer">
                          <Avatar
                            key={userIdOfOwner}
                            name={ownerEmail}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">{isoToPrettyDate(creationTime)}</TableCell>
                    <TableCell className="text-center">{type || "Unknown"}</TableCell>
                    <TableCell className="text-center">{prettyBytes(size || 0)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        color="danger"
                        startContent={<DeleteDocumentIcon />}
                        variant="bordered"
                        isDisabled={userId !== userIdOfOwner && userId !== projectOwnerUserId}
                        onPress={() => {
                          setCurrentDataSourceToDeleteId(dataSourceId);
                          onOpenModalDelete();
                        }}
                      >
                        Delete
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
              Permitted file types: csv, json, parquet
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
      </>
    )
  );
}
