const express = require("express");
const cors = require("cors");
const resourceRoutes = require("./routes/resourceRoutes");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use("/api/resource", resourceRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Resource Service running on port ${PORT}`);
});
