import {
  Listbox,
  ListboxItem, Button,
  Card, CardBody, CardFooter, Image,
} from "@nextui-org/react";

export default function AnnotationTypeSelection({
  setShowAnnotationSelectionPage,
  setChosenAnnotationType,
  onClose,
}) {
  return (
    <>
      <div className="flex">
        <div className="w-1/4 bg-300 p-4">
          <Listbox
            aria-label="Actions"
    // onAction={(key) => {}}
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={["structuredData"]}
          >
            <ListboxItem key="structuredData" isSe>Structured Data</ListboxItem>
          </Listbox>

        </div>
        <div className="w-3/4 bg-300 p-4">

          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            <Card
              shadow="sm"
              isPressable
              onPress={() => {
                setChosenAnnotationType("tabular");
                setShowAnnotationSelectionPage(false);
              }}
            >
              <CardBody className="overflow-visible p-0">
                <Image
                  width="100%"
                  height="auto"
                  alt="Tabular Data"
                  className="w-full object-cover h-[140px]"
                  src="/images/structured_data.svg"
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>Tabular Data</b>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 right-0 mr-5 mb-5">
        <div className="flex space-x-4">
          <Button
            color="danger"
            variant="light"
            onPress={() => {
              onClose();
            }}
          >
            Cancel
          </Button>

        </div>
      </div>
    </>

  );
}
