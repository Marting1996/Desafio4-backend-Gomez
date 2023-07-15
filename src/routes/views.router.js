import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router()
const productManager = new ProductManager("./products.json")

router.get("/", (req, res) => {
    res.render("index", {})
})

router.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});
router.get('/form-products', async (req, res) => {
    try {
        res.render("form", {});
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});
router.post('/form-products', async (req, res) => {
    try {
        const data = req.body
        const create = await productManager.addProduct(data)
        res.redirect("/products");
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});


export default router