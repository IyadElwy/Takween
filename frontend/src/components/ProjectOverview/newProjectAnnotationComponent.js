import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationFieldSelection from "./annotationSetup";

export default function NewProjectAnnotationComponent(
  {
    project,
    setChosenAnnotationType,
  },
) {
  const [renderedComponent, setRenderedComponent] = useState("default");

  return (
    renderedComponent === "default"
      ? (
        <AnnotationTypeSelection
          setChosenAnnotationType={setChosenAnnotationType}
          setRenderedComponent={setRenderedComponent}
        />
      )
      : (
        <AnnotationFieldSelection
          project={project}
        />
      )
  );
}
