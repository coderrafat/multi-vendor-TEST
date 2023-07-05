const { Schema, model } = require("mongoose");


const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
    {
        products: [{ type: ObjectId, ref: "Product" }],
        payment: {},
        buyer: { type: ObjectId, ref: "User" },
        status: {
            type: String,
            default: "Not processed",
            enum: [
                "Not processed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
        },
    },
    { timestamps: true, versionKey: false }
);

const OrderModel = model("orders", orderSchema);
module.exports = OrderModel;