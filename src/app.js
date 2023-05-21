const express = require("express");
const ProductRouter = require("./routes/ProductRouter");
const CartRouter = require("./routes/CartRouter");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
