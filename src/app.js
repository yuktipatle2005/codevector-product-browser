
const path = require("path");
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.get("/", (req, res) => {
    res.send("CodeVector Backend is Running 🚀");
});

module.exports = app;