import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // referencia al modelo Product
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

export const CartModel = mongoose.model('Cart', cartSchema);

// import mongoose from 'mongoose';

// const cartSchema = new mongoose.Schema({
//   products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product', // referencia al modelo Product
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true
//       }
//     }
//   ]
// }, { timestamps: true });

// export const CartModel = mongoose.model('Cart', cartSchema);
