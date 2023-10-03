import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationFieldSelection from "./annotationSetup";

export default function NewProjectAnnotationComponent() {
  const [renderedComponent, setRenderedComponent] = useState("default");

  return (
    renderedComponent === "default"
      ? (
        <AnnotationTypeSelection setRenderedComponent={setRenderedComponent} />
      )
      : (
        <AnnotationFieldSelection />
      )
  );
}
