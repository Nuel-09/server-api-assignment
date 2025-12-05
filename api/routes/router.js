const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../handlers/itemHandler");
const { sendError } = require("../utils/responseHandler");

const handleRequest = (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // GET /api/items - Get all items
  if (req.method === "GET" && req.url === "/api/items") {
    return getAllItems(res);
  }

  // GET /api/items/:id - Get item by id
  if (req.method === "GET" && req.url.startsWith("/api/items/")) {
    const id = req.url.split("/")[3];
    return getItemById(res, id);
  }

  // POST /api/items - Create item
  if (req.method === "POST" && req.url === "/api/items") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      createItem(res, body);
    });
    return;
  }

  // PUT /api/items/:id - Update item
  if (req.method === "PUT" && req.url.startsWith("/api/items/")) {
    const id = req.url.split("/")[3];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      updateItem(res, id, body);
    });
    return;
  }

  // DELETE /api/items/:id - Delete item
  if (req.method === "DELETE" && req.url.startsWith("/api/items/")) {
    const id = req.url.split("/")[3];
    return deleteItem(res, id);
  }

  // 404 - Route not found
  sendError(res, 404, "Route not found");
};

module.exports = {
  handleRequest,
};
