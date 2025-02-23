const { Server } = require("socket.io");
const db = require("./dbConnection");

let io; // WebSocket instance

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send initial stock prices when a client connects
    db.query("SELECT price FROM stock_prices WHERE id = 1", (err, results) => {
      if (!err) {
        socket.emit("stockPricesUpdated", results);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Poll stock prices with an optimized query
  setInterval(checkStockPrices, 5000);

  return io;
};

// Optimized query to check only updated stock prices
const checkStockPrices = () => {
  db.query("SELECT price FROM stock_prices WHERE id = 1", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return;
    }
    if (results.length > 0) {
      io.emit("stockPricesUpdated", results); // Send to all clients
    }
  });
};

module.exports = initializeSocket;
