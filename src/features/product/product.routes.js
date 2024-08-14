
// manage routes/paths to productController

// import express
import express from 'express';
import ProductController from './product.controller.js';
import { upload } from "../../middlewares/fileUpload.middleware.js"


// initialize express router
const productRouter = express.Router();
const productController =  new ProductController();


// all the paths to controller methods

// localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.post(
    '/rate', 
    (req, res, next) => {
        productController.rateProduct(req, res, next);
    }
);

productRouter.get(
    '/filter',
    (req, res) => {
        productController.filterProducts(req, res);
    }
    
);

// localhost:3200/api/products
productRouter.get(
    '/', 
    (req, res) => {
        productController.getAllProducts(req, res);
    }
);

productRouter.post(
    '/', 
    upload.single('imageUrl'),
    (req, res) => {
        productController.addProduct(req, res);
    }
    
);

productRouter.get(
    '/:id',
    (req, res) => {
        productController.getOneProduct(req, res);
    }
)


export default productRouter;
