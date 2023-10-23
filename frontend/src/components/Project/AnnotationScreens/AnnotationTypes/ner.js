/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */

import { Allotment } from "allotment";
import "allotment/dist/style.css";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import Image from "next/image";
import {
  RadioGroup, Radio,

  Select, SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import randomColor from "randomcolor";
import AxiosWrapper from "../../../../utils/axiosWrapper";

import GhostButton from "../../../Reusable/ghostButton";
import buttonStyles from "../../../../styles/components/Reusable/navbar.module.css";

export default function NamedEntityRecognitionComponent({
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
}) {
  const allUserAnnotations = currentRow.original.annotations;
  const [selectedUserId, setSelectedUserId] = useState(new Set([user.id]));

  // const [highlightedText, setHighlightedText] = useState(selectedAnnotations?.tags || []);
  const [tags] = useState(currentRow.original.tags.map((currTag) => ({ tagName: currTag, color: randomColor({ luminosity: "light" }) })));

  console.log(tags);

  const [currentTag, setCurrentTag] = useState(tags[0]);

  const handleTextHighlight = () => {
    try {
      if (selectedAnnotations.user.id !== user.id) return;

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      if (range && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
        const clonedRange = range.cloneRange();
        if (clonedRange.toString() === "") return;

        const highlightData = {
          text: clonedRange.toString(),
          tag: currentTag.tagName,
        };

        // setHighlightedText([...highlightedText, highlightData]);
        setSelectedAnnotations({ ...selectedAnnotations, tags: selectedAnnotations?.tags ? [...selectedAnnotations.tags, highlightData] : [highlightData] });

        // const span = document.createElement("span");
        // span.style.color = tags[currentTag];
        // clonedRange.surroundContents(span);

        // Create a new element with the specified background color
        const highlightedTextElement = document.createElement("span");
        highlightedTextElement.style.backgroundColor = currentTag.color;
        highlightedTextElement.appendChild(document.createTextNode(highlightData.text));

        // Replace the selected range with the new element
        clonedRange.deleteContents();
        clonedRange.insertNode(highlightedTextElement);

        // Clear the selection
        selection.removeAllRanges();
      }
    } catch (error) {
      console.log(error);
      /* empty */ }
  };

  const clearSelections = () => {
    const spans = document.querySelectorAll("span[style*=\"background-color\"]");
    spans.forEach((currSpan) => {
      // eslint-disable-next-line no-param-reassign
      currSpan.outerHTML = currSpan.innerHTML;
    });

    setSelectedAnnotations({ ...selectedAnnotations, tags: [] });
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
        <div>
          <div className="p-2">
            <Select
              fullWidth
              disallowEmptySelection
              label="Annotated by"
              variant="underlined"
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
              {allUserAnnotations.filter((currUserAnnotation) => currUserAnnotation.user.id !== user.id).map((currUserAnnotation) => (
                <SelectItem key={currUserAnnotation.user.id} value={currUserAnnotation.user.id}>
                  {currUserAnnotation.user.email}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div
            style={{
              height: "100vh", width: "100vw", backgroundColor: "#FAFAFA", padding: "20px",
            }}
          >
            <div style={{ maxWidth: "700px" }}>
              <div
                id="theText"
                onKeyDown={handleTextHighlight}
                onClick={handleTextHighlight}
                style={{ minHeight: "300px", padding: "10px" }}
              >
                {JSON.stringify(currentRow.original.data[currentRow.original.fieldToAnnotate]).replace(/"/g, "")}

              </div>
            </div>
            <button
              onClick={clearSelections}
              type="button"
              className="clear-button"
              style={{
                color: "red",
                position: "absolute",
                bottom: "10px", // Adjust the vertical position
                right: "10px", // Adjust the horizontal position
              }}
            >
              Clear Selections
            </button>

          </div>
        </div>
        <div className="relative h-full">
          <div className="overflow-y-auto">
            <div className="mr-3 ml-3 mt-3">

              <RadioGroup
                isDisabled={selectedAnnotations.user.id !== user.id}
                label="Select Tag"
                orientation="horizontal"
                onValueChange={(value) => {
                  setCurrentTag(tags.find((tag) => value === tag.tagName));
                }}
                value={currentTag.tagName}
              >
                {tags.map((tag) => (
                  <Radio key={tag.tagName} value={tag.tagName}>{tag.tagName}</Radio>
                ))}

              </RadioGroup>

            </div>
          </div>
          <div className="absolute bottom-20 left-0 w-full p-3 flex justify-between">
            <Image
              className={buttonStyles.burgerMenu}
              onClick={() => {
                setSelectedUserId(new Set([user.id]));
                getPreviousRow();
                clearSelections();
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
                let newAnnotations = [...annotationsWithoutCurrent];
                if (selectedAnnotations.tags && selectedAnnotations.tags.length > 0) {
                  newAnnotations.push({
                    user: selectedAnnotations.user,
                    tags: selectedAnnotations.tags,
                  });
                  setAnnotatedDataCount(annotatedDataCount + 1);
                } else if (selectedAnnotations.tags && selectedAnnotations.tags.length === 0) {
                  newAnnotations = newAnnotations.filter((ann) => ann.user.id !== selectedAnnotations.user.id);
                  setAnnotatedDataCount(annotatedDataCount - 1);
                }

                const { _id } = currentRow.original;
                await AxiosWrapper.post(`http://localhost:8000/projects/${projectId}/jobs/${jobId}/annotations`, JSON.stringify({
                  _id,
                  annotations: newAnnotations,
                }));

                setSelectedUserId(new Set([user.id]));
                getNextRow();
                clearSelections();
              }}
            >
              Submit
            </GhostButton>
            <Image
              className={buttonStyles.burgerMenu}
              onClick={() => {
                setSelectedUserId(new Set([user.id]));
                getNextRow();
                clearSelections();
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
        <div>

          <div style={{ height: "260px" }} className="overflow-y-auto">
            <JsonView src={selectedAnnotations?.tags || []} />
          </div>

        </div>
      </Allotment>
    </Allotment>
  );
}
