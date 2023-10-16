/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import Image from "next/image";
import { useState } from "react";
import {
  CheckboxGroup, Checkbox, RadioGroup, Radio,
} from "@nextui-org/react";
import axios from "axios";

import GhostButton from "../../Reusable/ghostButton";
import buttonStyles from "../../../styles/components/Reusable/navbar.module.css";

const getInitialAnnotations = (annotationsArray) => {
  if (annotationsArray.length === 0) return [];

  // until we setup collaboration
  const firstAnnotation = annotationsArray[0].classes;
  return firstAnnotation;
};

export default function MainAnnotationScreen({
  data,
  projectId,
  jobId,
  annotatedDataCount,
  setAnnotatedDataCount,
}) {
  const [currentRow, setCurrentRow] = useState(data);
  const [selectedClasses, setSelectedClasses] = useState(getInitialAnnotations(currentRow.original.annotations));

  const getNextRow = async () => {
    const nextRowId = Number(currentRow.id) + 1;
    if (data.allRows[nextRowId]) {
      const itemRes = await axios.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations/${data.allRows[nextRowId].original._id}`);
      const item = itemRes.data;
      setSelectedClasses(getInitialAnnotations(item.annotations));
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
      const itemRes = await axios.get(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations/${data.allRows[nextRowId].original._id}`);
      const item = itemRes.data;
      setSelectedClasses(getInitialAnnotations(item.annotations));
      setCurrentRow({
        ...data.allRows[nextRowId],
        original: item,
      });
    } else if (data.pagination.pageIndex > 0) {
      data.setPagination({ ...data.pagination, pageIndex: data.pagination.pageIndex - 1 });
      data.setShowDetailedSplit(false);
    }
  };

  return (
    <Allotment
      minSize={300}
      defaultSizes={[200, 50]}
    >

      <Allotment
        vertical
        minSize={300}
        defaultSizes={[200, 50]}
      >
        <div
          style={{
            height: "100vh", width: "100vw", backgroundColor: "#FAFAFA", padding: "20px",
          }}
        >
          <div style={{ maxWidth: "700px" }}>
            <h1 style={{
              whiteSpace: "pre-line",
              wordBreak: "break-all",
            }}
            >
              {JSON.stringify(currentRow.original.data[currentRow.original.fieldToAnnotate])}

            </h1>
          </div>
        </div>
        <div className="relative h-full">
          <div className="overflow-y-auto">
            <div className="mr-3 ml-3 mt-3">

              {currentRow.original.allowMultiClassification
                ? (
                  <CheckboxGroup
                    label="Select Classes"
                    orientation="horizontal"
                    onChange={(newClasses) => {
                      setSelectedClasses(newClasses);
                    }}
                    value={selectedClasses}
                  >
                    {currentRow.original.classes.map((currClass) => (
                      <Checkbox
                        value={currClass}
                      >
                        {currClass}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                )
                : (
                  <RadioGroup
                    label="Select Class"
                    orientation="horizontal"
                    onValueChange={(newClasses) => {
                      setSelectedClasses(newClasses);
                    }}
                    value={selectedClasses}
                  >
                    {currentRow.original.classes.map((currClass) => (
                      <Radio value={currClass}>{currClass}</Radio>
                    ))}

                  </RadioGroup>
                )}

            </div>
          </div>
          <div className="absolute bottom-20 left-0 w-full p-3 flex justify-between">
            <Image
              className={buttonStyles.burgerMenu}
              onClick={getPreviousRow}
              alt="nextui logo"
              height={60}
              radius="sm"
              src="/images/left-arrow.svg"
              width={60}
            />
            <GhostButton
              customStyle={{
                fontSize: "25px",
                width: "500px",
                height: "50px",
              }}
              onPress={async () => {
                const annotationsWithoutCurrent = [...currentRow.original.annotations].filter((ann) => ann.user !== "admin");
                const newAnnotations = [...annotationsWithoutCurrent];
                if (selectedClasses.length > 0) {
                  newAnnotations.push({
                    user: "admin",
                    classes: selectedClasses,
                  });
                  setAnnotatedDataCount(annotatedDataCount + 1);
                }

                const { _id } = currentRow.original;
                await axios.post(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations`, JSON.stringify({
                  _id,
                  annotations: newAnnotations,
                }));

                getNextRow();
              }}
            >
              Submit
            </GhostButton>
            <Image
              className={buttonStyles.burgerMenu}
              onClick={getNextRow}
              alt="nextui logo"
              height={60}
              radius="sm"
              src="/images/right-arrow.svg"
              width={60}
            />
          </div>
        </div>

      </Allotment>
      <Allotment
        vertical
        minSize={200}
      >
        <div className="m-4" style={{ maxHeight: "400px", maxWidth: "1000px", overflow: "auto" }}>
          <JsonView src={currentRow.original.data} />
        </div>
        <div />
      </Allotment>
    </Allotment>
  );
}
