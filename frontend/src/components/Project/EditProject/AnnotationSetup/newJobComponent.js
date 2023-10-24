import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationSetupTextClassification from "./AnnotationTypes/textClassification";
import PartOfSpeechSetup from "./AnnotationTypes/partOfSpeechTagging";
import NamedEntityRecognitionSetup from "./AnnotationTypes/namedEntityRecognition";

const getSetUpPage = (type, onClose, projectId) => {
  if (type.startsWith("textClassification")) {
    return (
      <AnnotationSetupTextClassification
        onClose={onClose}
        projectId={projectId}
        language={type.split("textClassification")[1]}
      />
    );
  }
  if (type.startsWith("partOfSpeech")) {
    return (
      <PartOfSpeechSetup
        onClose={onClose}
        projectId={projectId}
        language={type.split("partOfSpeech")[1]}
      />
    );
  }
  if (type.startsWith("namedEntityRecognition")) {
    return (
      <NamedEntityRecognitionSetup
        onClose={onClose}
        projectId={projectId}
        language={type.split("namedEntityRecognition")[1]}
      />
    );
  }

  return null;
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
