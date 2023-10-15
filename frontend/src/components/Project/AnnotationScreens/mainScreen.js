import { Allotment } from "allotment";
import "allotment/dist/style.css";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import Image from "next/image";
import { useState } from "react";
import GhostButton from "../../Reusable/ghostButton";
import buttonStyles from "../../../styles/components/Reusable/navbar.module.css";

export default function MainAnnotationScreen({ data }) {
  const [currentRow, setCurrentRow] = useState(data);

  const getNextRow = () => {
    // eslint-disable-next-line no-underscore-dangle
    const nextRowId = Number(currentRow.id) + 1;
    if (data.allRows[nextRowId]) {
      setCurrentRow(data.allRows[nextRowId]);
    // eslint-disable-next-line no-underscore-dangle
    } else if (currentRow.original._id + 1 < data.totalRowCount) {
      data.setPagination({ ...data.pagination, pageIndex: data.pagination.pageIndex + 1 });
      data.setShowDetailedSplit(false);
    }
  };

  const getPreviousRow = () => {
    // eslint-disable-next-line no-underscore-dangle
    const nextRowId = Number(currentRow.id) - 1;
    if (data.allRows[nextRowId]) {
      setCurrentRow(data.allRows[nextRowId]);
    } else if (data.pagination.pageIndex - 1 > 0) {
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
        <div
          className="flex flex-col space-y-4"
        >
          <div className="p-4 h-16">
            Upper Div
          </div>

          <div className="p-4 h-8">
            <div className="flex justify-center items-end">
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
                  width: "150px",
                  height: "50px",
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
        </div>
      </Allotment>
      <Allotment
        vertical
        minSize={200}
      >
        <div className="m-4" style={{ maxHeight: "400px", maxWidth: "1000px", overflow: "auto" }}>
          <JsonView src={currentRow.original.data} />
        </div>
        <h1>Hi</h1>
      </Allotment>
    </Allotment>
  );
}
