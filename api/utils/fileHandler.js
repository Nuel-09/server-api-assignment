const fs = require("fs");
const path = require("path");

const inventoryPath = path.join(__dirname, "..", "db", "inventory.json");

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

module.exports = {
  readInventory,
  writeInventory,
  getNextId,
};
