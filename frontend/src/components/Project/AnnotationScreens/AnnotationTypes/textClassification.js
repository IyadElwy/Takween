/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */

import { Allotment } from "allotment";
import "allotment/dist/style.css";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import Image from "next/image";
import {
  CheckboxGroup, Checkbox, RadioGroup, Radio,
  Button, Select, SelectItem, Tooltip,
} from "@nextui-org/react";
import { useState } from "react";
import AxiosWrapper from "../../../../utils/axiosWrapper";

import GhostButton from "../../../Reusable/ghostButton";
import buttonStyles from "../../../../styles/components/Reusable/navbar.module.css";
import TableIcon from "../../../Icons/tableIcon";

export default function TextClassificationAnnotationComponent({
  currentRow,
  selectedAnnotations,
  setSelectedAnnotations,
  getPreviousRow,
  getNextRow,
  user,
  annotatedDataCount,
  setAnnotatedDataCount,
  projectId,
  jobId,
  job,
  setShowDetailedSplit,
}) {
  const allUserAnnotations = currentRow.original.annotations;
  const [selectedUserId, setSelectedUserId] = useState(new Set([user.id]));

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
        <div>
          <div className="p-2">
            <div style={{
              display: "flex", gap: "16px",
            }}
            >

              <div className="flex gap-2">
                <Button
                  color="warning"
                  onPress={() => {
                    setShowDetailedSplit(false);
                  }}
                  startContent={<TableIcon />}
                >
                  View Table
                </Button>
                <Tooltip color="warning" content="Shows the current Id of the record" delay={1000}>
                  <Button color="warning" variant="flat">
                    {`Id ${currentRow.original._id}`}
                  </Button>
                </Tooltip>
                <Tooltip color="warning" closeDelay={2000} content="Shows the conflict status">
                  <Button color="warning" variant="flat">
                    {currentRow.original?.conflict ? "Existing Conflict" : "No Conflict"}
                  </Button>
                </Tooltip>
              </div>

              <Select
                fullWidth
                disallowEmptySelection
                label="Annotated by"
                variant=""
                selectedKeys={selectedUserId}
                defaultSelectedKeys={selectedUserId}
                onSelectionChange={(e) => {
                  const userId = e.currentKey;
                  const currUserAnnotation = allUserAnnotations.find((currAnn) => currAnn.user.id === userId);

                  if (currUserAnnotation) {
                    setSelectedAnnotations(currUserAnnotation);
                  } else {
                    setSelectedAnnotations({ user });
                  }
                  setSelectedUserId(e);
                }}
              >

                <SelectItem key={user.id} value={user.id}>
                  {user.email}
                </SelectItem>
                {job.assigned_reviewer_id === user.id && allUserAnnotations.filter((currUserAnnotation) => currUserAnnotation.user.id !== user.id).map((currUserAnnotation) => (
                  <SelectItem key={currUserAnnotation.user.id} value={currUserAnnotation.user.id}>
                    {currUserAnnotation.user.email}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
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
        </div>
        <div className="relative h-full">
          <div className="overflow-y-auto" style={{ height: "150px" }}>
            <div className="mr-3 ml-3 mt-3">

              {currentRow.original.allowMultiClassification
                ? (
                  <CheckboxGroup
                    isDisabled={selectedAnnotations.user.id !== user.id}
                    label="Select Classes"
                    orientation="horizontal"
                    onChange={(newClasses) => {
                      setSelectedAnnotations({
                        user: allUserAnnotations.find((currAnn) => currAnn.user.id === selectedAnnotations.user.id)?.user || user,
                        classes: newClasses,
                      });
                    }}
                    value={selectedAnnotations.classes || []}
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
                    isDisabled={selectedAnnotations.user.id !== user.id}
                    label="Select Class"
                    orientation="horizontal"
                    onValueChange={(newClasses) => {
                      setSelectedAnnotations({
                        user: allUserAnnotations.find((currAnn) => currAnn.user.id === selectedAnnotations.user.id)?.user || user,
                        classes: newClasses,
                      });
                    }}
                    value={selectedAnnotations.classes || ""}
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
              onClick={() => {
                setSelectedUserId(new Set([user.id]));
                getPreviousRow();
              }}
              alt="nextui logo"
              height={60}
              radius="sm"
              src="/images/left-arrow.svg"
              width={60}
            />
            <GhostButton
              isDisabled={selectedAnnotations.user.id !== user.id}
              customStyle={{
                fontSize: "25px",
                width: "500px",
                height: "50px",
              }}
              onPress={async () => {
                const annotationsWithoutCurrent = [...currentRow.original.annotations].filter((ann) => ann.user.id !== selectedAnnotations.user.id);
                const newAnnotations = [...annotationsWithoutCurrent];
                if (selectedAnnotations.classes && selectedAnnotations.classes.length > 0) {
                  newAnnotations.push({
                    user: selectedAnnotations.user,
                    classes: selectedAnnotations.classes,
                  });
                  setAnnotatedDataCount(annotatedDataCount + 1);
                }

                const { _id } = currentRow.original;
                await AxiosWrapper.post(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations`, JSON.stringify({
                  _id,
                  annotations: newAnnotations,
                }));

                setSelectedUserId(new Set([user.id]));
                getNextRow();
              }}
            >
              Submit
            </GhostButton>
            <Image
              className={buttonStyles.burgerMenu}
              onClick={() => {
                setSelectedUserId(new Set([user.id]));
                getNextRow();
              }}
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
