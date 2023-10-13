/* eslint-disable max-len */
import {
  Button, Select, SelectItem, Input, Chip,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";
import JsonView from "react18-json-view";
import GhostButton from "../../../../Reusable/ghostButton";
import "react18-json-view/src/style.css";

export default function TextClassificationSetup({ onClose, projectId }) {
  const [jobData, setJobData] = useState({
    name: null,
    projectId,
    dataSource: null,
    fieldToAnnotate: null,
    classes: [],
  });
  const [dataSources, setDataSources] = useState([]);
  const [selectedDSKey, setSelectedDSKey] = useState([]);
  const [currClassInput, setCurrClassInput] = useState("");
  const [classes, setClasses] = useState([]);

  // error states
  const [jobNameError, setJobNameErrorState] = useState(false);
  const [dataSourceError, setDataSourceErrorState] = useState(false);
  const [chosenFieldError, setChosenFieldErrorState] = useState(false);
  const [addedClassesError, setAddedClassesErrorErrorState] = useState(false);

  useEffect(() => {
    const retrieveDataSources = async () => {
      const dataSourcesRes = await axios.get(`http://localhost:8000/projects/${projectId}/file-data-sources`);
      setDataSources(dataSourcesRes.data);
    };
    retrieveDataSources();
  }, []);

  const getCurrentDataSource = () => dataSources.find((file) => file.id === selectedDSKey.currentKey);

  const getKeysFromExampleData = (exampleData) => {
    let parsedExample = exampleData;
    if (Array.isArray(parsedExample)) {
      [parsedExample] = exampleData;
    }
    return Object.keys(parsedExample);
  };

  return (
    <>
      <div>
        <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Enter Job Name</h1>
        <Input
          type="text"
          label="Job Name"
          size="lg"
          placeholder="Enter Job Name"
          onValueChange={(value) => {
            setJobData({ ...jobData, name: value });
          }}
          isInvalid={jobNameError}
          errorMessage={jobNameError && "Please enter a job name"}
        />

      </div>
      <div>
        <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Select Data-Source</h1>
        <Select
          label="Data-Source"
          variant="bordered"
          size="lg"
          selectedKeys={selectedDSKey}
          onSelectionChange={(key) => {
            setSelectedDSKey(key);
            setJobData({ ...jobData, dataSource: dataSources.find((file) => file.id === key.currentKey) });
          }}
          isInvalid={dataSourceError}
          errorMessage={dataSourceError && "Please choose a data-source"}
        >
          {dataSources.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {`${option.file_name}`}
            </SelectItem>
          ))}
        </Select>

      </div>
      <div className="flex">
        <div className="w-2/5 bg-300 p-4">
          <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Choose Field to Annotate</h1>
          {selectedDSKey.length === 0 ? <div />
            : (
              <>
                <JsonView src={getCurrentDataSource().exampleData} />
                <br />
                <Select
                  label="Field to Annotate"
                  variant="bordered"
                  size="lg"
                  onSelectionChange={(key) => {
                    setJobData({ ...jobData, fieldToAnnotate: key.currentKey });
                  }}
                  isInvalid={chosenFieldError}
                  errorMessage={chosenFieldError && "Please choose a field to annotate"}
                >
                  {getKeysFromExampleData(getCurrentDataSource().exampleData).map((option) => (
                    <SelectItem key={option} value={option}>
                      {`${option}`}
                    </SelectItem>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-3">If you can&apos;t see some fields, you might need to flatten your data-source</p>

              </>
            )}

        </div>

        <div className="w-3/5 bg-300 p-4">

          <h1 style={{ fontSize: "25px", marginBottom: "15px" }}>Add Classes</h1>
          <div className="flex flex-col">
            <div className="bg-300 p-4">
              <Input
                type="text"
                label="Class Name"
                size="lg"
                placeholder="Enter Class Name"
                value={currClassInput}
                onValueChange={(name) => setCurrClassInput(name)}
                isInvalid={addedClassesError}
                errorMessage={addedClassesError && "Please choose at least 2 classes"}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {classes.map((classChip) => (
                  <Chip
                    key={classChip}
                    onClose={() => {
                      setClasses(classes.filter((currClass) => currClass !== classChip));
                      setJobData({ ...jobData, classes: classes.filter((currClass) => currClass !== classChip) });
                    }}
                    variant="flat"
                  >
                    {classChip}
                  </Chip>
                ))}
              </div>
              <div className="bg-300 p-4">
                <div className="flex justify-end">
                  <GhostButton
                    onPress={() => {
                      if (currClassInput && !classes.includes(currClassInput)) {
                        setClasses([...classes, currClassInput]);
                        setCurrClassInput("");
                        setJobData({ ...jobData, classes: [...classes, currClassInput] });
                      }
                    }}
                    customStyle={{
                      fontSize: "15px",
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    Add Class
                  </GhostButton>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
      <br />
      <div className="absolute bottom-0 right-0 mr-5 mb-5">
        <div className="flex space-x-4 ">
          <Button
            color="danger"
            variant="light"
            onPress={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="default"
            onPress={async () => {
              if (!jobData.name) {
                return setJobNameErrorState(true);
              }
              setJobNameErrorState(false);

              if (!jobData.dataSource) {
                return setDataSourceErrorState(true);
              }
              setDataSourceErrorState(false);
              if (!jobData.fieldToAnnotate) {
                return setChosenFieldErrorState(true);
              }
              setChosenFieldErrorState(false);
              if (classes.length <= 1) {
                return setAddedClassesErrorErrorState(true);
              }
              setAddedClassesErrorErrorState(false);
            }}
          >
            Finish
          </Button>
        </div>
      </div>
    </>
  );
}
