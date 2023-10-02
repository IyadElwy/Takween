import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue,
  Select, SelectItem,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import GhostButton from "../Reusable/ghostButton";

export default function AnnotationFieldSelection() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["0"]));
  const [newField, setNewField] = useState({ name: "", type: "string" });
  const [fields, setFields] = useState([
    {
      name: "id",
      type: "int",
    },
    {
      name: "author",
      type: "string",
    },
    {
      name: "tweet",
      type: "string",
    },
  ]);
  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "type",
      label: "Type",
    },
  ];

  const typeOptions = [
    { value: "string", label: "String" },
    { value: "int", label: "Int" },
    { value: "float", label: "Float" }];

  return (
    <div className="flex">
      <div className="w-2/5 bg-300 p-4">
        <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Fields</h1>
        <Table
          aria-label="Controlled table example with dynamic content"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={fields}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
              </TableRow>
            )}
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
            />
          </div>
          <div className="bg-300 p-4">
            <Select
              label="Type"
              variant="bordered"
              size="lg"
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
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
                  setFields([...fields, newField]);
                  // setNewField({ name: "", type: "string" });
                }}
                text="Add Field"
                customStyle={{
                  fontSize: "15px",
                  width: "50px",
                  height: "50px",
                }}
              />

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
