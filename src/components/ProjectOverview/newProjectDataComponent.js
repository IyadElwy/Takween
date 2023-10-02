import {
  Button, Table, TableHeader, TableColumn, TableBody,
} from "@nextui-org/react";

export default function NewProjectDataComponent() {
  return (
    <>
      <Button style={{ marginBottom: "10px" }} variant="bordered">
        Add Data
      </Button>
      <Table aria-label="Example empty table">
        <TableHeader>
          <TableColumn>File Name</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Size</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No rows to display.">
          {/* <TableRow key="1">
          <TableCell>Tony Reichert</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
        </TableRow> */}
        </TableBody>
      </Table>

    </>

  );
}
