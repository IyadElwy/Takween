import {
  Input, Textarea,
} from "@nextui-org/react";

export default function NewProjectInfoComponent() {
  return (
    <>
      <p style={{ fontSize: "25px", marginBottom: "10px" }} className="text-sm">Please enter any required information</p>
      <div className="flex flex-col">
        <div className="bg-300 p-4">
          <Input
            type="text"
            label="Project Title"
            size="lg"
            placeholder="Enter your project's title"
          />
        </div>
        <div className="bg-300 p-4">
          <Textarea
            label="Description (optional)"
            size="lg"
            placeholder="Enter your description"
          />
        </div>
      </div>

    </>
  );
}
