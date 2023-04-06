const express = require('express');

const Customer = require('../../models/Users');
const Product = require('../../models/Products');
const Cart = require('../../models/Cart')

const AddToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    if(req.user) {
        let cart = await Cart.findOne({ user: req.uesr._id });
        if(!cart){
            cart = await Cart.create({ user: req.user._id, products: [] })
        }

        const existingProduct = cart.products.find(product => product.product.equals(productId));
        if(existingProduct)
        {
            existingProduct.quantity += quantity;
        }
        else
        {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.json({ cart });
    }
    else
    {
        let cart = req.session.cart || [];

        const existingProduct = cart.find(product => product.productId === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
        req.session.cart = cart;
        res.json({ cart });
    }
}

const RemoveItem = async (req, res) => {
    const productId = req.body.productId;
    const username = req.user ? req.username : null;

    if(username)
    {
        const cart = await Cart.findOne({ username }).populate('product');
        const productIndex = cart.product.findIndex((product) => product._id.toString() === productId);
        if (productIndex === -1) {
          return res.status(400).json({ error: 'Product not found in cart' });
        }
        const product = cart.product[productIndex];
        cart.product.splice(productIndex, 1);
        await cart.save();
        res.json({ success: true, message: 'Product removed from cart' });
    }
    else
    {
        const cart = req.session.cart || [];
        const productIndex = cart.findIndex((product) => product.productId === productId)
        if(productIndex === -1)
        {
            return res.status(400).json({ error: 'product not found in cart' });
        }
        const product = cart[productIndex];
        cart.splice(productIndex, 1);
        req.session.cart = cart;
        res.json({ success: true, message: 'Product removed from cart' })
    }
}