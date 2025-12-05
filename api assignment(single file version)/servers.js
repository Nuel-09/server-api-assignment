const http = require("http");
const { handleRequest } = require("./routes/router");

const PORT = 3000;
const HOST_NAME = "localhost";

// Utility functions
const readInventory = () => {
  try {
    const data = fs.readFileSync(inventoryPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading inventory:", error);
    return [];
  }
};

const writeInventory = (data) => {
  try {
    fs.writeFileSync(inventoryPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing inventory:", error);
    return false;
  }
};

const getNextId = (items) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
};

const validateItemData = (data) => {
  if (!data.name || !data.price || !data.size) {
    return {
      valid: false,
      error: "Missing required fields: name, price, size",
    };
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    return { valid: false, error: "Name must be a non-empty string" };
  }

  if (typeof data.price !== "number" || data.price <= 0) {
    return { valid: false, error: "Price must be a positive number" };
  }

  if (!["s", "m", "l"].includes(data.size)) {
    return {
      valid: false,
      error: "Size must be one of: s (small), m (medium), l (large)",
    };
  }

  return { valid: true };
};

// Response handlers
const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
};

const sendError = (res, statusCode, message) => {
  sendResponse(res, statusCode, {
    success: false,
    error: message,
  });
};

const sendSuccess = (res, statusCode, data) => {
  sendResponse(res, statusCode, {
    success: true,
    data: data,
  });
};

// API route handlers
const getAllItems = (res) => {
  const items = readInventory();
  sendSuccess(res, 200, items);
};

const getItemById = (res, id) => {
  const items = readInventory();
  const item = items.find((i) => i.id === parseInt(id));

  if (!item) {
    return sendError(res, 404, `Item with id ${id} not found`);
  }

  sendSuccess(res, 200, item);
};

const createItem = (res, body) => {
  try {
    const newItemData = JSON.parse(body);
    const validation = validateItemData(newItemData);

    if (!validation.valid) {
      return sendError(res, 400, validation.error);
    }

    const items = readInventory();
    const newItem = {
      id: getNextId(items),
      name: newItemData.name,
      price: newItemData.price,
      size: newItemData.size,
    };

    items.push(newItem);
    const success = writeInventory(items);

    if (!success) {
      return sendError(res, 500, "Failed to save item");
    }

    sendSuccess(res, 201, newItem);
  } catch (error) {
    sendError(res, 400, "Invalid JSON data");
  }
};

const updateItem = (res, id, body) => {
  try {
    const updateData = JSON.parse(body);
    const validation = validateItemData(updateData);

    if (!validation.valid) {
      return sendError(res, 400, validation.error);
    }

    const items = readInventory();
    const itemIndex = items.findIndex((i) => i.id === parseInt(id));

    if (itemIndex === -1) {
      return sendError(res, 404, `Item with id ${id} not found`);
    }

    const updatedItem = {
      id: parseInt(id),
      name: updateData.name,
      price: updateData.price,
      size: updateData.size,
    };

    items[itemIndex] = updatedItem;
    const success = writeInventory(items);

    if (!success) {
      return sendError(res, 500, "Failed to update item");
    }

    sendSuccess(res, 200, updatedItem);
  } catch (error) {
    sendError(res, 400, "Invalid JSON data");
  }
};

const deleteItem = (res, id) => {
  const items = readInventory();
  const itemIndex = items.findIndex((i) => i.id === parseInt(id));

  if (itemIndex === -1) {
    return sendError(res, 404, `Item with id ${id} not found`);
  }

  const deletedItem = items[itemIndex];
  items.splice(itemIndex, 1);
  const success = writeInventory(items);

  if (!success) {
    return sendError(res, 500, "Failed to delete item");
  }

  sendSuccess(res, 200, {
    message: "Item deleted successfully",
    data: deletedItem,
  });
};

// Request handler
const requestHandler = (req, res) => {
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

// Create and start server
const server = http.createServer(requestHandler);

server.listen(PORT, HOST_NAME, () => {
  console.log(`Inventory API server is running on http://${HOST_NAME}:${PORT}`);
});
