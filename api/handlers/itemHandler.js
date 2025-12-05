const {
  readInventory,
  writeInventory,
  getNextId,
} = require("../utils/fileHandler");
const { validateItemData } = require("../utils/validator");
const { sendError, sendSuccess } = require("../utils/responseHandler");

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

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
