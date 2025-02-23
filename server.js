const express = require("express");
const http = require("http");
const cors = require("cors");
const initializeSocket = require("./socketHandler"); // Import WebSocket logic
const stockRoutes = require("./stockRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Create an HTTP server
const server = http.createServer(app);

// Initialize WebSockets
initializeSocket(server);

// Use stock routes
app.use("/stocks", stockRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
