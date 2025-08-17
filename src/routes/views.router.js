import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = Router();


router.get("/home", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("home", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar home");
  }
});


router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar realtimeproducts");
  }
});

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = { limit: parseInt(limit), page: parseInt(page), lean: true };

    let filter = {};
    if (query) {
      filter = { $or: [{ category: query }, { status: query }] };
    }

    let sortOption = {};
    if (sort === "asc") sortOption = { price: 1 };
    if (sort === "desc") sortOption = { price: -1 };

    const products = await Product.paginate(filter, { ...options, sort: sortOption });

    res.render("products", {
      products: products.docs,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      totalPages: products.totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar produtos");
  }
});


router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send("Produto não encontrado");
    res.render("productDetail", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar produto");
  }
});


router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrinho não encontrado");
    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar carrinho");
  }
});

export default router;