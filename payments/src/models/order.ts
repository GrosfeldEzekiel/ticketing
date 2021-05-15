import { OrderStatus } from '@eg-ticketing/common';
import mongoose from 'mongoose';

interface OrderAttrs {
	id: string;
	userId: string;
	price: number;
	status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
	version: number;
	userId: string;
	price: number;
	status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(data: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		version: { type: Number, default: 0 },
		userId: { type: String, required: true },
		price: { type: Number, required: true },
		status: { type: String, required: true },
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order({
		_id: attrs.id,
		...attrs,
	});
};

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
