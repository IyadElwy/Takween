import TextField from "@mui/material/TextField";

export default function NewProjectInfoComponent() {
  return (
    <>
      <p className="text-sm">Please enter any required information</p>
      <div className="flex flex-col">
        <div className="bg-300 p-4">
          <TextField
            id="outlined-error"
            label="Title"
            helperText="Enter your project's title"
            fullWidth
          />
        </div>
        <div className="bg-300 p-4">
          <TextField
            id="outlined-error-helper-text"
            label="Description "
            helperText="Enter your project's description (optional)"
            multiline
            rows={5}
            fullWidth
          />
        </div>
      </div>

    </>
  );
}
