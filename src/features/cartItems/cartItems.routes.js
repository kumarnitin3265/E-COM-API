
// manage routes/paths to productController

// import express
import express from 'express';
import CartItemController from './cartItems.controller.js';


// initialize express router
const cartRouter = express.Router();
const cartItemController = new CartItemController();

cartRouter.post(
    '/',
    (req, res) => {
        cartItemController.add(req, res)
    }
);

cartRouter.get(
    '/',
    (req, res) => {
        cartItemController.get(req, res)
    }
);

cartRouter.delete(
    '/:id',
    (req, res) => {
        cartItemController.delete(req, res)
    }
);

export default cartRouter;