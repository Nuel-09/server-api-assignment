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

module.exports = {
  validateItemData,
};
