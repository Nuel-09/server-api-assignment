const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4000;
const HOST_NAME = "localhost";

const server = http.createServer(requestHandler);

server.listen(PORT, HOST_NAME, () => {
  console.log(`server is up&running on ${HOST_NAME}:${PORT}`);
});

function requestHandler(req, res) {
  console.log(req.url);

  if (req.url === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const indexPath = path.join(__dirname, "index.html");
    res.end(fs.readFileSync(indexPath, "utf8"));
  }
  // passing the route error into error template file
   else {
    res.writeHead(404, { "Content-Type": "text/html" });
    const errorTemplate = fs.readFileSync(
      path.join(__dirname, "error_temp.html"),
      "utf8"
    );
    // debugged status code before and after replacing
    console.log("Before replace:", errorTemplate.includes("{{statusCode}}"));
    let errorPage = errorTemplate
      .replace(/\{\{statusCode\}\}/g, "404")
      .replace(/\{\{errorTitle\}\}/g, "Page Not Found")
      .replace(
        /\{\{errorMessage\}\}/g,
        "The resource you requested could not be found on this server."
      );
    console.log("After replace:", errorPage.includes("{{statusCode}}"));
    res.end(errorPage);
  }
}
