import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationSetupTabular from "./StructuredData/tabular";

const getSetUpPage = (type, onClose) => {
  switch (type) {
    case "tabular":
      return (
        <AnnotationSetupTabular onClose={onClose} />
      );
    default:
      return <h1>No page</h1>;
  }
};

export default function NewJobComponent({
  onClose,
  projectId,
}) {
  const [showAnnotationSelectionPage, setShowAnnotationSelectionPage] = useState(true);
  const [ChosenAnnotationType, setChosenAnnotationType] = useState("");

  return (
    showAnnotationSelectionPage
      ? (
        <AnnotationTypeSelection
          setChosenAnnotationType={setChosenAnnotationType}
          setShowAnnotationSelectionPage={setShowAnnotationSelectionPage}
          onClose={onClose}
        />
      )
      : getSetUpPage(ChosenAnnotationType, onClose)

  );
}
