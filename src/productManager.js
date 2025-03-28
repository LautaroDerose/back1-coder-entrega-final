import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'products.json');

class ProductManager {
    static async getProducts() {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    static async addProduct(product) {
        const products = await this.getProducts();
        product.id = products.length ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return product;
    }
    static async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            const newProducts = products.filter(p => p.id !== id);
            if (products.length === newProducts.length) return false;
    
            await fs.writeFile(filePath, JSON.stringify(newProducts, null, 2));
            return true;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return false;
        }
    }
}

export default ProductManager;
