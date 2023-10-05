import {
  Modal, ModalContent, ModalBody, ModalFooter, Button,
  Tabs, Tab,
} from "@nextui-org/react";

import { useState } from "react";
import { useRouter } from "next/router";

import NewProjectInfoComponent from "./ProjectSetup/infoTab";
import NewProjectDataComponent from "./DataSetup/dataTab";
import NewProjectAnnotationComponent from "./AnnotationSetup/annotationTab";

export default function CreateNewProjectModal({ isOpen, onOpenChange }) {
  const [selectedTab, setSelectedTab] = useState("information");
  const [project, setProject] = useState({});
  const [info, setInfo] = useState({ title: "", description: "" });
  const [infoErrorState, setInfoErrorState] = useState(false);
  const [infoDescriptionErrorState, setInfoDescriptionErrorState] = useState(false);
  const [dataErrorState, setDataErrorState] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const [chosenAnnotationType, setChosenAnnotationType] = useState("");

  return (
    <Modal
      style={{
        height: "500px",
      }}
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
                  <NewProjectInfoComponent
                    info={info}
                    infoDescriptionErrorState={infoDescriptionErrorState}
                    setInfo={setInfo}
                    error={infoErrorState}
                  />
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
                  if (!info.title || info.description.length >= 400) {
                    if (!info.title) setInfoErrorState(true);
                    if (info.description.length >= 400) setInfoDescriptionErrorState(true);
                  } else {
                    setInfoDescriptionErrorState(false);
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
                  if (chosenAnnotationType) {
                    router.push({
                      pathname: "projects/[projectId]",
                      query: { projectId: project.id },
                    });
                  }
                }
              }}
              >
                {selectedTab === "annotation" && chosenAnnotationType ? "Finish" : "Next"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
