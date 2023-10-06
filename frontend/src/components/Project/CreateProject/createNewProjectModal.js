import {
  Modal, ModalContent, ModalBody,
  Tabs, Tab,
} from "@nextui-org/react";

import { useState } from "react";

import NewProjectInfoComponent from "./ProjectSetup/infoTab";
import NewProjectDataComponent from "./DataSetup/dataTab";
import NewProjectAnnotationComponent from "./AnnotationSetup/annotationTab";

export default function CreateNewProjectModal({ isOpen, onOpenChange }) {
  const [selectedTab, setSelectedTab] = useState("information");
  const [project, setProject] = useState({});

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
        {(onClose) => {
          const closeModal = () => {
            setSelectedTab("information");
            setProject({});
            onClose();
          };
          return (
            <ModalBody>
              <Tabs
                aria-label="Options"
                fullWidth
                selectedKey={selectedTab}
              >
                <Tab key="information" title="Information">
                  <NewProjectInfoComponent
                    project={project}
                    setProject={setProject}
                    onClose={closeModal}
                    setSelectedTab={setSelectedTab}
                  />
                </Tab>
                <Tab key="data" title="Data">
                  <NewProjectDataComponent
                    project={project}
                    setProject={setProject}
                    onClose={closeModal}
                    setSelectedTab={setSelectedTab}
                  />
                </Tab>
                <Tab key="annotation" title="Annotation">
                  <NewProjectAnnotationComponent
                    project={project}
                    setProject={setProject}
                    onClose={closeModal}
                    setSelectedTab={setSelectedTab}
                  />
                </Tab>
              </Tabs>
            </ModalBody>
          );
        }}
      </ModalContent>
    </Modal>
  );
}
