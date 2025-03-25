/* eslint-disable no-undef */
onmessage = (e) => {
  const { dataSourceId, presignedPutUrl, file } = e.data;

  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener("progress", (progress) => {
    const progFormatted = parseInt((progress.loaded / progress.total * 100));
    postMessage({ dataSourceId, status: "loading", progress: progFormatted });
  }, false);
  xhr.upload.addEventListener("error", (error) => {
    postMessage({
      dataSourceId, status: "error", error, progress: 0,
    });
  });
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4) {
      postMessage({ dataSourceId, status: "done", progress: 100 });
    }
  };
  xhr.open("PUT", presignedPutUrl);
  xhr.send(file);
};
