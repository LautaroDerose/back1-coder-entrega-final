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


// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
//   thumbnail: String,
//   code: { type: String, required: true, unique: true },
//   stock: { type: Number, default: 0 },
//   category: String,
//   status: { type: Boolean, default: true }, // para disponibilidad
// }, { timestamps: true });

// export const ProductModel = mongoose.model('Product', productSchema);
