import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationSetupTabular from "./AnnotationTypes/tabular";
import AnnotationSetupTextClassification from "./AnnotationTypes/textClassification";

const getSetUpPage = (type, onClose, projectId) => {
  switch (type) {
    case "tabular":
      return (
        <AnnotationSetupTabular onClose={onClose} />
      );
    case "textClassification":
      return <AnnotationSetupTextClassification onClose={onClose} projectId={projectId} />;
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
      : getSetUpPage(ChosenAnnotationType, onClose, projectId)

  );
}
