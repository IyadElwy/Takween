import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationSetupTabular from "./StructuredData/tabularData";

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
        <AnnotationSetupTabular
          project={project}
        />
      )
  );
}
