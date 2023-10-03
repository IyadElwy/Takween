import {
  Modal, ModalContent, ModalBody, ModalFooter, Button,
  Tabs, Tab,
} from "@nextui-org/react";

import { useState } from "react";

import NewProjectInfoComponent from "./newProjectInfoComponent";
import NewProjectDataComponent from "./newProjectDataComponent";
import NewProjectAnnotationComponent from "./newProjectAnnotationComponent";

export default function CreateNewProjectModal({ isOpen, onOpenChange }) {
  const [selectedTab, setSelectedTab] = useState("information");
  const [info, setInfo] = useState({ title: "", description: "" });
  const [infoErrorState, setInfoErrorState] = useState(false);
  const [dataErrorState, setDataErrorState] = useState(false);
  const [project, setProject] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [chosenAnnotationType, setChosenAnnotationType] = useState("");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      size="5xl"
      scrollBehavior="inside"
      backdrop="blur"
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <Tabs
                aria-label="Options"
                fullWidth
                selectedKey={selectedTab}
              >
                <Tab key="information" title="Information">
                  <NewProjectInfoComponent info={info} setInfo={setInfo} error={infoErrorState} />
                </Tab>
                <Tab key="data" title="Data">
                  <NewProjectDataComponent
                    dataErrorState={dataErrorState}
                    setDataErrorState={setDataErrorState}
                    project={project}
                    setProject={setProject}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                  />
                </Tab>
                <Tab key="annotation" title="Annotation">
                  <NewProjectAnnotationComponent
                    project={project}
                    setChosenAnnotationType={setChosenAnnotationType}
                  />
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  setSelectedTab("information");
                  setInfoErrorState(false);
                  setDataErrorState(false);
                  setInfo({ title: "", description: "" });
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button onPress={async () => {
                if (selectedTab === "information") {
                  if (!info.title) {
                    setInfoErrorState(true);
                  } else {
                    setInfoErrorState(false);
                    const res = await fetch("http://127.0.0.1:8000/projects", {
                      method: "POST",
                      body: JSON.stringify(info),
                    });
                    let data = await res.json();
                    data = data.data;
                    setProject({ ...data });
                    setSelectedTab("data");
                  }
                }
                if (selectedTab === "data") {
                  if (dataErrorState) setSelectedTab("annotation");
                }
                if (selectedTab === "annotation") {
                  if (chosenAnnotationType) onClose();
                }
              }}
              >
                Next
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
