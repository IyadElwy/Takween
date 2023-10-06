import {
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Popover, PopoverTrigger, PopoverContent,
} from "@nextui-org/react";
import byteSize from "byte-size";
import { useState, useRef } from "react";

export default function NewProjectDataComponent({
  project, setProject, onClose, setSelectedTab,
}) {
  const [error, setError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFiles([...selectedFiles, e.target.files[0]]);
    }
  };

  return (
    <>

      <Button
        onPress={() => fileInputRef.current.click()}
        style={{ marginBottom: "10px" }}
        variant="bordered"
      >
        Add File
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="border rounded-lg px-4 py-2 mr-5"
          style={{ display: "none" }}
        />

      </Button>
      <Table aria-label="Example empty table">
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
            color="danger"
            variant="light"
            onPress={() => {
              // if
              onClose();
            }}
          >
            Cancel
          </Button>

          <Popover placement="left">
            <PopoverTrigger>
              <Button onPress={async () => {
                if (selectedFiles.length === 0) {
                  setError("Please add one or more data sources");
                } else {
                  setProject({ ...project, dataSources: { fileUploads: selectedFiles } });
                  setSelectedTab("annotation");
                }
              }}
              >
                Next
              </Button>
            </PopoverTrigger>
            {error ? (
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold text-red-500">{error}</div>
                </div>
              </PopoverContent>
            )
              : ""}
          </Popover>

        </div>
      </div>

    </>
  );
}
