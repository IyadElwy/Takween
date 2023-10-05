import {
  Input, Textarea,
} from "@nextui-org/react";

export default function NewProjectInfoComponent({
  info,
  setInfo,
  error,
  infoDescriptionErrorState,
}) {
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
            value={info.title}
            onValueChange={(value) => setInfo({ ...info, title: value })}
            isInvalid={error}
            errorMessage={error && "Please enter a title"}
          />
        </div>
        <div className="bg-300 p-4">
          <Textarea
            label="Description (optional)"
            size="lg"
            placeholder="Enter your description"
            value={info.description}
            onValueChange={(value) => setInfo({ ...info, description: value })}
            isInvalid={infoDescriptionErrorState}
            errorMessage={infoDescriptionErrorState && "Description too long, stick to a maximum of 400 characters"}
          />
        </div>
      </div>

    </>
  );
}
