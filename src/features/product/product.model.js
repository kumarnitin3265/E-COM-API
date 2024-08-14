
import ApplicationError from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
    
    constructor ( name, desc, price, imageUrl, category, sizes, id) {
        this._id = id,
        this.name = name,
        this.desc = desc,
        this.price = price,
        this.imageUrl = imageUrl,
        this.category = category,
        this.sizes = sizes
    }

    static get(id){
        const product = products.find(p => p.id == id);
        return product;
    }

    static getAll(){
        return products;
    }

    static add(product){
        product.id = products.length + 1;
        products.push(product);
        return product;
    }

    static filter(minPrice, maxPrice, category){
        const result = products.filter((product) => {
            return ( 
                (!minPrice || 
                    product.price >= minPrice) && 
                (!maxPrice || 
                    product.price <= maxPrice) &&
                (!category || 
                    product.category == category)
            );
        });
        return result;
    }

    static rateProduct(userID, productID, rating){
        // 1. Validate user and product
        const user = UserModel.getAll().find(
            (u) => u.id == userID
        );

        // user defined error
        if(!user){
            throw new ApplicationError('User not found', 404);
        }

        // Validate the product
        const product = products.find(
            (p) => p.id == productID
        );

        if(!product){
            throw new ApplicationError('Product not found', 400);
        }

        // 2. check if there are any ratings and if not then add the rating array
        if(!product.ratings){
            product.ratings = [];
            product.ratings.push({
                userID: userID, 
                rating: rating,
            });
        } else {
            // 3. check if user rating is already available
            const existingRatingIndex = product.ratings.findIndex(
                (r) => r.userID == userID
            );
            if(existingRatingIndex >= 0) {
                product.ratings[existingRatingIndex] = {
                    userID: userID, 
                    rating: rating,
                };
            } else {
                // 4. if no existing rating, then add new rating
                product.ratings.push({
                    userID: userID, 
                    rating: rating,
                });
            }
        }
    }
    
}

var products = [
    new ProductModel(
        1, 
        'Product 1',
        'Description for Product 10',
        19.99,
        'https://m.media-amazon.com/images/I/71k6-iUZLYL._SX679_.jpg',
        'Category1'
    ),
    new ProductModel(
        2,
        'Product 2',
        'Description for Product 11',
        29.99,
        'https://m.media-amazon.com/images/I/71NbZHZFdGL._SX679_.jpg',
        'Category2',
        ['M', 'XL']
    ),
    new ProductModel(
        3,
        'Product 3',
        'Description for Product 12',
        39.99,
        'https://m.media-amazon.com/images/I/91UeXvNW72L._SY879_.jpg',
        'Category3',
        ['M', 'XL', 'S']
    )
]