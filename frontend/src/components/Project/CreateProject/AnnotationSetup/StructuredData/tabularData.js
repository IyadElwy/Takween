import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Select, SelectItem, Button, Input,
} from "@nextui-org/react";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import GhostButton from "../../../../Reusable/ghostButton";
import AxiosWrapper from "../../../../../utils/axiosWrapper";

export default function AnnotationFieldSelection({
  project, onClose,
}) {
  const [newField, setNewField] = useState({ name: "", type: "" });
  const [fields, setFields] = useState([]);

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "delete",
      label: "",
    },
  ];

  const typeOptions = [
    { value: "string", label: "String" },
    { value: "int", label: "Int" },
    { value: "float", label: "Float" }];

  const [errorStateFieldName, setErrorStateFieldName] = useState(false);
  const [errorStateFieldType, setErrorStateFieldType] = useState(false);

  const deleteButton = (name) => (

    <Button
      isIconOnly
      color="danger"
      aria-label="Like"
      onPress={() => {
        const updatedFields = fields.filter((field) => field.name !== name);
        setFields(updatedFields);
      }}
    >
      <DeleteIcon style={{ fontSize: "1rem", color: "white" }} />
    </Button>
  );

  // eslint-disable-next-line max-len
  const doesFieldAlreadyExist = (field) => fields.filter((currField) => currField.name === field.name).length !== 0;

  return (

    <>
      <div className="flex">
        <div className="w-2/5 bg-300 p-4">
          <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Added Fields</h1>
          <Table
            aria-label="Controlled table example with dynamic content"
          >
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{field.type}</TableCell>
                  <TableCell className="text-right">{deleteButton(field.name)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </div>

        <div className="w-3/5 bg-300 p-4">

          <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Add New Field</h1>
          <div className="flex flex-col">
            <div className="bg-300 p-4">
              <Input
                type="text"
                label="Field Name"
                size="lg"
                placeholder="Enter Field Name"
                onValueChange={(name) => setNewField({ ...newField, name })}
                isInvalid={errorStateFieldName}
                errorMessage={errorStateFieldName && "Please enter a field name"}
              />
            </div>
            <div className="bg-300 p-4">
              <Select
                label="Type"
                variant="bordered"
                size="lg"
                onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                isInvalid={errorStateFieldType}
                errorMessage={errorStateFieldType && "Please select a field type"}
              >
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}

              </Select>

              <div className="flex justify-end">
                <GhostButton
                  onPress={() => {
                    if (!newField.name) setErrorStateFieldName(true);
                    if (!newField.type) setErrorStateFieldType(true);
                    if (newField.name) setErrorStateFieldName(false);
                    if (newField.type) setErrorStateFieldType(false);
                    // eslint-disable-next-line max-len
                    if (newField.name && newField.type && !doesFieldAlreadyExist(newField)) setFields([...fields, newField]);
                  }}
                  customStyle={{
                    fontSize: "15px",
                    width: "50px",
                    height: "50px",
                  }}
                >
                  Add Field
                </GhostButton>

              </div>

            </div>
          </div>

        </div>
      </div>

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
          <Button onPress={async () => {
            const finishedProjectObject = {
              ...project,
              newFields: fields,
            };

            const formData = new FormData();
            finishedProjectObject.dataSources.fileUploads.forEach((fileSource) => {
              formData.append("files", fileSource);
            });

            formData.append("data", JSON.stringify(finishedProjectObject));

            const response = await AxiosWrapper.post("http://127.0.0.1:8000/projects", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const projectID = response.data.data.project.id;
            // eslint-disable-next-line no-undef
            window.location = `${window.location.href}/${projectID}`;
          }}
          >
            Finish
          </Button>
        </div>
      </div>
    </>
  );
}
