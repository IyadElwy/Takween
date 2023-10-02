import {
  Modal, ModalContent, ModalBody, ModalFooter, Button,
  Tabs, Tab,
} from "@nextui-org/react";

import NewProjectInfoComponent from "./newProjectInfoComponent";
import NewProjectDataComponent from "./newProjectDataComponent";
import NewProjectAnnotationComponent from "./newProjectAnnotationComponent";

export default function CreateNewProjectModal({ isOpen, onOpenChange }) {
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
              <Tabs aria-label="Options" fullWidth>
                <Tab key="information" title="Information">
                  <NewProjectInfoComponent />
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
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button onPress={onClose}>
                Next
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
