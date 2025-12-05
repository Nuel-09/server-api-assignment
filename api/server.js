const http = require("http");
const { handleRequest } = require("./routes/router");

const PORT = 3000;
const HOST_NAME = "localhost";

const server = http.createServer(handleRequest);

server.listen(PORT, HOST_NAME, () => {
  console.log(`Inventory API server is running on http://${HOST_NAME}:${PORT}`);
});
