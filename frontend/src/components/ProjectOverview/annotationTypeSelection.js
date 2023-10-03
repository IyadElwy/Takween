import {
  Listbox,
  ListboxItem,
  Card, CardBody, CardFooter, Image,
} from "@nextui-org/react";

export default function AnnotationTypeSelection({
  setRenderedComponent,
  setChosenAnnotationType,
}) {
  return (
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
            key="dededfrefkm"
            isPressable
            onPress={() => {
              setChosenAnnotationType("tabular");
              setRenderedComponent("tabular");
            }}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                width="100%"
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
  );
}
