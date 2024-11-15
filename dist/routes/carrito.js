"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const carrito_model_1 = require("../models/carrito.model"); // Asegúrate de que este archivo apunta al modelo de carrito
const cartRoutes = (0, express_1.Router)();
cartRoutes.post('/add', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('Usuario en req:', req.usuario); // Verifica el contenido de req.usuario
    const { titulo, cantidad, precio } = req.body;
    try {
        // Buscar carrito activo del usuario
        let cart = yield carrito_model_1.Cart.findOne({ userId: req.usuario._id, status: 'active' });
        if (!cart) {
            // Crear un nuevo carrito si no existe
            cart = new carrito_model_1.Cart({ userId: req.usuario._id, items: [] });
        }
        // Verificar si el libro ya está en el carrito
        const itemIndex = cart.items.findIndex(item => item.titulo === titulo);
        if (itemIndex > -1) {
            // Actualizar la cantidad del libro si ya está en el carrito
            cart.items[itemIndex].cantidad += cantidad;
        }
        else {
            // Agregar el libro como nuevo elemento si no está en el carrito
            cart.items.push({ titulo, cantidad, precio });
        }
        yield cart.save();
        res.json({ ok: true, cart });
    }
    catch (error) {
        console.error("Error al agregar al carrito: ", error); // Agrega un log detallado
        res.status(500).json({
            ok: false,
            mensaje: 'Error al agregar al carrito',
            error: error.message || error // Devuelve el mensaje del error
        });
    }
}));
// Eliminar libro del carrito
cartRoutes.delete('/remove/:titulo', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo } = req.params;
    try {
        const cart = yield carrito_model_1.Cart.findOne({ userId: req.usuario._id, status: 'active' });
        if (!cart)
            return res.json({ ok: false, mensaje: 'Carrito no encontrado' });
        // Filtrar el libro a eliminar
        cart.items = cart.items.filter(item => item.titulo !== titulo);
        yield cart.save();
        res.json({ ok: true, cart });
    }
    catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar del carrito', error });
    }
}));
// Actualizar cantidad de un libro en el carrito
cartRoutes.patch('/update', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, cantidad } = req.body;
    try {
        const cart = yield carrito_model_1.Cart.findOne({ userId: req.usuario._id, status: 'active' });
        if (!cart)
            return res.json({ ok: false, mensaje: 'Carrito no encontrado' });
        const item = cart.items.find(item => item.titulo === titulo);
        if (!item)
            return res.json({ ok: false, mensaje: 'Libro no encontrado en el carrito' });
        item.cantidad = cantidad;
        yield cart.save();
        res.json({ ok: true, cart });
    }
    catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar la cantidad', error });
    }
}));
// Obtener carrito del usuario
cartRoutes.get('/infocarrito', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield carrito_model_1.Cart.findOne({ userId: req.usuario._id, status: 'active' }).populate('userId', 'nombre email');
        if (!cart)
            return res.json({ ok: false, mensaje: 'Carrito no encontrado' });
        res.json({ ok: true, cart });
    }
    catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al obtener el carrito', error });
    }
}));
// Procesar el checkout del carrito
cartRoutes.post('/checkout', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield carrito_model_1.Cart.findOne({ userId: req.usuario._id, status: 'active' });
        if (!cart)
            return res.json({ ok: false, mensaje: 'Carrito no encontrado' });
        // Cambiar el estado del carrito a "completed" después del checkout
        cart.status = 'completed';
        yield cart.save();
        res.json({ ok: true, mensaje: 'Compra completada', cart });
    }
    catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al procesar el checkout', error });
    }
}));
exports.default = cartRoutes;
