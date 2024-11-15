import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Cart, ICartItem } from '../models/carrito.model';  // Asegúrate de que este archivo apunta al modelo de carrito

const cartRoutes = Router();

cartRoutes.post('/add', verificaToken, async (req: any, res: Response) => {
    //console.log('Usuario en req:', req.usuario); // Verifica el contenido de req.usuario
    const { titulo, cantidad, precio } = req.body;

    try {
        // Buscar carrito activo del usuario
        let cart = await Cart.findOne({ userId: req.usuario._id, status: 'active' });

        if (!cart) {
            // Crear un nuevo carrito si no existe
            cart = new Cart({ userId: req.usuario._id, items: [] });
        }

        // Verificar si el libro ya está en el carrito
        const itemIndex = cart.items.findIndex(item => item.titulo === titulo);

        if (itemIndex > -1) {
            // Actualizar la cantidad del libro si ya está en el carrito
            cart.items[itemIndex].cantidad += cantidad;
        } else {
            // Agregar el libro como nuevo elemento si no está en el carrito
            cart.items.push({ titulo, cantidad, precio } as ICartItem);
        }

        await cart.save();
        res.json({ ok: true, cart });

    } catch (error: any) {
        console.error("Error al agregar al carrito: ", error); // Agrega un log detallado
        res.status(500).json({
            ok: false,
            mensaje: 'Error al agregar al carrito',
            error: error.message || error // Devuelve el mensaje del error
        });
    }
});


// Eliminar libro del carrito
cartRoutes.delete('/remove/:titulo', verificaToken, async (req: any, res: Response) => {
    const { titulo } = req.params;

    try {
        const cart = await Cart.findOne({ userId: req.usuario._id, status: 'active' });

        if (!cart) return res.json({ ok: false, mensaje: 'Carrito no encontrado' });

        // Filtrar el libro a eliminar
        cart.items = cart.items.filter(item => item.titulo !== titulo);

        await cart.save();
        res.json({ ok: true, cart });

    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar del carrito', error });
    }
});

// Actualizar cantidad de un libro en el carrito
cartRoutes.patch('/update', verificaToken, async (req: any, res: Response) => {
    const { titulo, cantidad } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.usuario._id, status: 'active' });

        if (!cart) return res.json({ ok: false, mensaje: 'Carrito no encontrado' });

        const item = cart.items.find(item => item.titulo === titulo);

        if (!item) return res.json({ ok: false, mensaje: 'Libro no encontrado en el carrito' });

        item.cantidad = cantidad;
        await cart.save();

        res.json({ ok: true, cart });

    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar la cantidad', error });
    }
});

// Obtener carrito del usuario
cartRoutes.get('/infocarrito', verificaToken, async (req: any, res: Response) => {
    try {
        const cart = await Cart.findOne({ userId: req.usuario._id, status: 'active' }).populate('userId', 'nombre email');

        if (!cart) return res.json({ ok: false, mensaje: 'Carrito no encontrado' });

        res.json({ ok: true, cart });

    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al obtener el carrito', error });
    }
});

// Procesar el checkout del carrito
cartRoutes.post('/checkout', verificaToken, async (req: any, res: Response) => {
    try {
        const cart = await Cart.findOne({ userId: req.usuario._id, status: 'active' });

        if (!cart) return res.json({ ok: false, mensaje: 'Carrito no encontrado' });

        // Cambiar el estado del carrito a "completed" después del checkout
        cart.status = 'completed';
        await cart.save();

        res.json({ ok: true, mensaje: 'Compra completada', cart });

    } catch (error) {
        res.status(500).json({ ok: false, mensaje: 'Error al procesar el checkout', error });
    }
});

export default cartRoutes;
