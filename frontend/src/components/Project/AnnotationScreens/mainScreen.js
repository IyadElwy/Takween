import { Allotment } from "allotment";
import "allotment/dist/style.css";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export default function MainAnnotationScreen({ data }) {
  return (
    <Allotment
      minSize={300}
      defaultSizes={[200, 50]}
    >

      <Allotment
        vertical
        minSize={300}
        defaultSizes={[200, 50]}
        // maxSize={500}
      >
        <div
          style={{ height: "100vh", width: "100vw", backgroundColor: "#FAFAFA" }}
        >
          <h1>2ded</h1>
        </div>
        <h1>Hi</h1>
      </Allotment>
      <Allotment
        vertical
        minSize={200}
      >
        <div className="m-4" style={{ maxHeight: "400px", maxWidth: "1000px", overflow: "auto" }}>
          <JsonView src={data.data} />
        </div>
        <h1>Hi</h1>
      </Allotment>
    </Allotment>
  );
}
