import { useState } from "react";

import AnnotationTypeSelection from "./annotationTypeSelection";
import AnnotationSetupTabular from "./StructuredData/tabularData";

const getSetUpPage = (type, {
  project, setProject, onClose, setSelectedTab,
}) => {
  switch (type) {
    case "tabular":
      return (
        <AnnotationSetupTabular
          project={project}
          setProject={setProject}
          onClose={onClose}
          setSelectedTab={setSelectedTab}
        />
      );
    default:
      return <h1>No page</h1>;
  }
};

export default function NewProjectAnnotationComponent(
  {
    project,
    setProject,
    onClose,
    setSelectedTab,
  },
) {
  const [showAnnotationSelectionPage, setShowAnnotationSelectionPage] = useState(true);
  const [ChosenAnnotationType, setChosenAnnotationType] = useState("");

  return (
    showAnnotationSelectionPage
      ? (
        <AnnotationTypeSelection
          setChosenAnnotationType={setChosenAnnotationType}
          setShowAnnotationSelectionPage={setShowAnnotationSelectionPage}
        />
      )
      : getSetUpPage(ChosenAnnotationType, {
        project, setProject, onClose, setSelectedTab,
      })
  );
}
