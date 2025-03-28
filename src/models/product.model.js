import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, index: true },  // indexado
  stock: { type: Number, default: 0 },
  category: { type: String, index: true },               // indexado
  status: { type: Boolean, default: true, index: true }, // indexado
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);

