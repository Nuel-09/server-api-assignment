// documentation for present and future events

# Inventory Management API

A RESTful API for managing inventory items built with Node.js (no framework). This project demonstrates best practices like separation of concerns, modular code, error handling, and file-based persistence.

## Project Structure

```
api/
├── db/
│   └── inventory.json              # Data storage (JSON file)
├── handlers/
│   └── itemHandler.js              # Item CRUD business logic
├── routes/
│   └── router.js                   # HTTP routing & request handling
├── utils/
│   ├── fileHandler.js              # File I/O operations
│   ├── validator.js                # Data validation logic
│   └── responseHandler.js          # Response formatting
├── server.js                       # Entry point (clean & simple)
├── package.json                    # Project dependencies
└── README.md                       # This file
```

## Architecture Overview

The API follows **Separation of Concerns** principle, breaking down functionality into focused modules:

### **server.js** (Entry Point)

- Creates HTTP server
- Listens on port 3000
- Imports router for request handling

### **routes/router.js** (Routing)

- Handles HTTP routing
- Maps requests to appropriate handlers
- Supported endpoints:
  - `GET /api/items` - Get all items
  - `GET /api/items/:id` - Get single item
  - `POST /api/items` - Create item
  - `PUT /api/items/:id` - Update item
  - `DELETE /api/items/:id` - Delete item

### **handlers/itemHandler.js** (Business Logic)

- Contains CRUD operations for items
- Interacts with file handler and validator
- Formats responses using response handler

### **utils/fileHandler.js** (File I/O)

- `readInventory()` - Reads items from inventory.json
- `writeInventory()` - Saves changes to inventory.json
- `getNextId()` - Auto-generates unique IDs

### **utils/validator.js** (Data Validation)

- `validateItemData()` - Validates item before create/update
- Checks for required fields
- Validates data types
- Ensures size is valid (s, m, or l)

### **utils/responseHandler.js** (Response Formatting)

- `sendResponse()` - Generic response sender
- `sendSuccess()` - Formats success responses
- `sendError()` - Formats error responses
- All responses follow consistent JSON structure

### **db/inventory.json** (Data Storage)

- Stores all inventory items as JSON
- Example structure:

```json
[
  {
    "id": 1,
    "name": "T-Shirt",
    "price": 25.99,
    "size": "m"
  },
  {
    "id": 2,
    "name": "Jeans",
    "price": 59.99,
    "size": "l"
  }
]
```

## Item Attributes

Each item must have:

- **id** (number) - Auto-generated unique identifier
- **name** (string) - Item name
- **price** (number) - Item price (must be positive)
- **size** (string) - Item size: `s` (small), `m` (medium), or `l` (large)

## Installation

```bash
cd api
npm install
```

## Running the Server

**Development mode** (with auto-reload using nodemon):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### 1. Get All Items

```bash
GET /api/items
```

**Response:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "T-Shirt", "price": 25.99, "size": "m" },
    { "id": 2, "name": "Jeans", "price": 59.99, "size": "l" }
  ]
}
```

### 2. Get Single Item

```bash
GET /api/items/1
```

**Response:**

```json
{
  "success": true,
  "data": { "id": 1, "name": "T-Shirt", "price": 25.99, "size": "m" }
}
```

### 3. Create Item

```bash
POST /api/items
Content-Type: application/json

{
  "name": "Jacket",
  "price": 79.99,
  "size": "l"
}
```

**Response:**

```json
{
  "success": true,
  "data": { "id": 3, "name": "Jacket", "price": 79.99, "size": "l" }
}
```

### 4. Update Item

```bash
PUT /api/items/1
Content-Type: application/json

{
  "name": "Polo Shirt",
  "price": 35.99,
  "size": "m"
}
```

**Response:**

```json
{
  "success": true,
  "data": { "id": 1, "name": "Polo Shirt", "price": 35.99, "size": "m" }
}
```

### 5. Delete Item

```bash
DELETE /api/items/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Item deleted successfully",
    "data": { "id": 1, "name": "Polo Shirt", "price": 35.99, "size": "m" }
  }
}
```

## Error Handling

All errors follow consistent format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Scenarios

| Status | Error                                       |
| ------ | ------------------------------------------- |
| 400    | Missing required fields (name, price, size) |
| 400    | Invalid size (must be s, m, or l)           |
| 400    | Invalid JSON data                           |
| 404    | Item not found                              |
| 500    | Server error (file write failure)           |

## Testing with cURL

```bash
# Get all items
curl http://localhost:3000/api/items

# Get item by ID
curl http://localhost:3000/api/items/1

# Create new item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Hat\",\"price\":19.99,\"size\":\"m\"}"

# Update item
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Cap\",\"price\":24.99,\"size\":\"s\"}"

# Delete item
curl -X DELETE http://localhost:3000/api/items/1
```

## Design Principles Applied

✅ **Separation of Concerns** - Each module handles one responsibility
✅ **Modularity** - Code is organized into reusable modules
✅ **Error Handling** - Comprehensive validation and error responses
✅ **Data Persistence** - File-based storage using JSON
✅ **Consistency** - Uniform response structure across all endpoints
✅ **Scalability** - Easy to extend with new features or database integration

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Authentication & authorization
- Request logging & monitoring
- Rate limiting
- API documentation (Swagger/OpenAPI)
- Unit tests & integration tests
- Input sanitization

## Technologies Used

- **Node.js** - JavaScript runtime
- **http module** - Built-in Node.js HTTP server
- **fs module** - File system operations
- **JSON** - Data format for storage and API responses

## License

ISC
