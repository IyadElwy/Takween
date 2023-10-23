import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationSetupTextClassification from "./AnnotationTypes/textClassification";
import PartOfSpeechSetup from "./AnnotationTypes/partOfSpeechTagging";
import NamedEntityRecognitionSetup from "./AnnotationTypes/namedEntityRecognition";

const getSetUpPage = (type, onClose, projectId) => {
  switch (type) {
    case "textClassification":
      return <AnnotationSetupTextClassification onClose={onClose} projectId={projectId} />;
    case "partOfSpeech":
      return <PartOfSpeechSetup onClose={onClose} projectId={projectId} />;
    case "namedEntityRecognition":
      return <NamedEntityRecognitionSetup onClose={onClose} projectId={projectId} />;
    default:
      return null;
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
