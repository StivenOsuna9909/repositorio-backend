import { Schema, model, Document } from 'mongoose';

const cartItemSchema = new Schema({
    titulo: { type: String, required: true },
    cantidad: { type: Number, required: true, min: 1 },
    precio: { type: Number, required: true }
});

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    items: [cartItemSchema],
    status: {
        type: String,
        enum: ['active', 'pending', 'completed'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export interface ICartItem extends Document {
    titulo: string;
    cantidad: number;
    precio: number;
}

export interface ICart extends Document {
    userId: string;
    items: ICartItem[];
    status: 'active' | 'pending' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

export const Cart = model<ICart>('Cart', cartSchema);
