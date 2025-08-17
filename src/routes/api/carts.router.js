import { Router } from "express";
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

const router = Router();


router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Erro ao criar carrinho" });
  }
});


router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", message: "Carrinho não encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Erro ao buscar carrinho" });
  }
});


router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrinho não encontrado" });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: "error", message: "Produto não encontrado" });

    const itemIndex = cart.products.findIndex((p) => p.product.toString() === pid);
    if (itemIndex !== -1) {
      cart.products[itemIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Erro ao adicionar produto ao carrinho" });
  }
});


router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrinho não encontrado" });

    const itemIndex = cart.products.findIndex((p) => p.product.toString() === pid);
    if (itemIndex === -1) return res.status(404).json({ status: "error", message: "Produto não encontrado no carrinho" });

    cart.products[itemIndex].quantity = quantity;
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Erro ao atualizar quantidade" });
  }
});


router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrinho não encontrado" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Erro ao remover produto" });
  }
});


router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrinho não encontrado" });

    cart.products = [];
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Erro ao limpar carrinho" });
  }
});

export default router;