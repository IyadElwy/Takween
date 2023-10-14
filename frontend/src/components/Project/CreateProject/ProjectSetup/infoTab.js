import {
  Input, Textarea, Button,
} from "@nextui-org/react";

import { useState } from "react";
import axios from "axios";

export default function NewProjectInfoComponent({
  onClose,
  project,
  setProject,
}) {
  const [error, setError] = useState({ title: "", description: "" });

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
            value={project.title}
            onValueChange={(value) => setProject({ ...project, title: value })}
            isInvalid={Boolean(error.title)}
            errorMessage={error.title}
          />
        </div>
        <div className="bg-300 p-4">
          <Textarea
            label="Description (optional)"
            size="lg"
            placeholder="Enter your description"
            value={project.description}
            onValueChange={(value) => setProject({ ...project, description: value })}
            isInvalid={Boolean(error.description)}
            errorMessage={error.description}
          />
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
            if (!project.title) {
              setError({ ...error, title: "Please enter a title" });
            } else if (project.description && project.description.length >= 2000) {
              setError({ ...error, description: "Description too long, stick to a maximum of 400 characters" });
            } else {
              const response = await axios.post("http://127.0.0.1:8000/projects", project);
              const projectID = response.data.data.project.id;
              // eslint-disable-next-line no-undef
              window.location = `${window.location.href}/${projectID}`;
            }
          }}
          >
            Finish
          </Button>
        </div>
      </div>

    </>
  );
}
