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
                // onSelectionChange={(key) => setSelectedTab(key)}
              >
                <Tab key="information" title="Information">
                  <NewProjectInfoComponent info={info} setInfo={setInfo} error={infoErrorState} />
                </Tab>
                <Tab key="data" title="Data">
                  <NewProjectDataComponent />
                </Tab>
                <Tab key="annotation" title="Annotation">
                  <NewProjectAnnotationComponent />
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
                  setInfo({ title: "", description: "" });
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button onPress={() => {
                if (selectedTab === "information") {
                  if (!info.title) {
                    setInfoErrorState(true);
                  } else {
                    setInfoErrorState(false);
                    setSelectedTab("data");
                  }
                }
                if (selectedTab === "data") {
                  setSelectedTab("annotation");
                }
                if (selectedTab === "annotation") {
                  // setSelectedTab('annotation')
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
