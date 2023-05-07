const express = require('express');

const Customer = require('../../models/Users');
const Product = require('../../models/Products');
const Cart = require('../../models/Cart')

const AddToCart = async (req, res) => {
    const { quantity } = req.body;
    const productId = req.params.id;
    const convertQuantity = parseInt(quantity);

    if(req.session.user) {
        let cart = await Cart.findOne({ user: req.session.user.id });
        if(!cart){
            cart = await Cart.create({ user: req.session.user.id, products: [] })
        }

        const existingProduct = cart.products.find(product => product.product.equals(productId));
        if(existingProduct)
        {
            existingProduct.quantity += convertQuantity;
        }
        else
        {
            cart.products.push({ product: productId, quantity: convertQuantity });
        }

        await cart.save();
        res.status(200).json({ cart });
    }
    else
    {
        let cart = req.session.cart || [];

        console.log('cart:', cart);
        console.log('productId:', productId);

        const existingProduct = cart.find(product => product.productId === productId);

        if (existingProduct) {
            existingProduct.quantity += convertQuantity;
        } else {
            cart.push({ productId, quantity: convertQuantity });
        }
        req.session.cart = cart;
        res.status(201).json({ cart });
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

module.exports = {
    AddToCart,
    RemoveItem
}