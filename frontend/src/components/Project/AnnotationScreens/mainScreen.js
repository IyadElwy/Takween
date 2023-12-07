/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { useState } from "react";
import AxiosWrapper from "../../../utils/axiosWrapper";

import TextClassificationAnnotationComponent from "./AnnotationTypes/textClassification";
import PartOfSpeechAnnotationComponent from "./AnnotationTypes/pos";
import NamedEntityRecognitionComponent from "./AnnotationTypes/ner";

export default function MainAnnotationScreen({
  data,
  projectId,
  user,
  jobId,
  type,
  annotatedDataCount,
  setAnnotatedDataCount,
  job,
  setShowDetailedSplit,
}) {
  const getInitialAnnotations = (annotationsArray) => {
    if (annotationsArray.length === 0) return { user };
    const currUserAnnotation = annotationsArray.find((currAnn) => currAnn.user.id === user.id);
    if (!currUserAnnotation) return { user };
    return currUserAnnotation;
  };

  const [currentRow, setCurrentRow] = useState(data);
  const [selectedAnnotations, setSelectedAnnotations] = useState(getInitialAnnotations(currentRow.original.annotations));

  const getNextRow = async () => {
    const nextRowId = Number(currentRow.id) + 1;
    if (data.allRows[nextRowId]) {
      const itemRes = await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations/${data.allRows[nextRowId].original._id}`);
      const item = itemRes.data;
      setSelectedAnnotations(getInitialAnnotations(item.annotations));
      setCurrentRow({
        ...data.allRows[nextRowId],
        original: item,
      });
    } else if (currentRow.original._id + 1 < data.totalRowCount) {
      data.setPagination({ ...data.pagination, pageIndex: data.pagination.pageIndex + 1 });
      data.setShowDetailedSplit(false);
    }
  };

  const getPreviousRow = async () => {
    const nextRowId = Number(currentRow.id) - 1;
    if (data.allRows[nextRowId]) {
      const itemRes = await AxiosWrapper.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations/${data.allRows[nextRowId].original._id}`);
      const item = itemRes.data;
      setSelectedAnnotations(getInitialAnnotations(item.annotations));
      setCurrentRow({
        ...data.allRows[nextRowId],
        original: item,
      });
    } else if (data.pagination.pageIndex > 0) {
      data.setPagination({ ...data.pagination, pageIndex: data.pagination.pageIndex - 1 });
      data.setShowDetailedSplit(false);
    }
  };

  switch (type) {
    case "text_classification":
      return (
        <TextClassificationAnnotationComponent
          currentRow={currentRow}
          selectedAnnotations={selectedAnnotations}
          setSelectedAnnotations={setSelectedAnnotations}
          getPreviousRow={getPreviousRow}
          getNextRow={getNextRow}
          user={user}
          annotatedDataCount={annotatedDataCount}
          setAnnotatedDataCount={setAnnotatedDataCount}
          projectId={projectId}
          jobId={jobId}
          job={job}
          setShowDetailedSplit={setShowDetailedSplit}
        />
      );

    case "part_of_speech":
      return (
        <PartOfSpeechAnnotationComponent
          currentRow={currentRow}
          selectedAnnotations={selectedAnnotations}
          setSelectedAnnotations={setSelectedAnnotations}
          getPreviousRow={getPreviousRow}
          getNextRow={getNextRow}
          user={user}
          annotatedDataCount={annotatedDataCount}
          setAnnotatedDataCount={setAnnotatedDataCount}
          projectId={projectId}
          jobId={jobId}
          job={job}
          setShowDetailedSplit={setShowDetailedSplit}
        />
      );

    case "named_entity_recognition":
      return (
        <NamedEntityRecognitionComponent
          currentRow={currentRow}
          selectedAnnotations={selectedAnnotations}
          setSelectedAnnotations={setSelectedAnnotations}
          getPreviousRow={getPreviousRow}
          getNextRow={getNextRow}
          user={user}
          annotatedDataCount={annotatedDataCount}
          setAnnotatedDataCount={setAnnotatedDataCount}
          projectId={projectId}
          jobId={jobId}
          job={job}
          setShowDetailedSplit={setShowDetailedSplit}
        />
      );
    default:
      return null;
  }
}
