import express from "express";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import { productsRouter } from './routes/products.router.js';
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"
import ProductManager from "./manager/ProductManager.js";
import __dirname from "./utils.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const httpServer = app.listen(8080)
const io = new Server(httpServer)

io.on("connection", socket => {
    console.log("New client connected");
    socket.on("new-product", async data => {
        const productManager = new ProductManager("./products.json");
        await productManager.addProduct(data);

        const products_realtime = await productManager.getProducts();
        socket.emit("reload-table", products_realtime);
    });

    socket.on("delete-product", async productId => {
        const productManager = new ProductManager("./products.json");
        await productManager.deleteProduct(parseInt(productId));
        const products_realtime = await productManager.getProducts();
        io.emit("reload-table", products_realtime);
    });
});

export default app;
