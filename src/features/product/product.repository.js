import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

class ProductRepository {
    constructor(){
        this.collection = 'products';
    }
    async add(newProduct) {
        try {
            // 1. get the db
            const db = getDB();
            const collection = db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct;
        } catch(err){
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }

    async getAll() {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            return products;
        } catch(err){
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }

    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const product = await collection.findOne({_id: new ObjectId(id)});
            return product;
        } catch(err){
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }

    // products should have min price specified and category
    async filter(minPrice, category) {
    // async filter(minPrice, categories) {

        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {};

            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }

            // ['Cat1', 'Cat2']
            // categories = JSON.parse(categories.replace(/'/g, '"'));
            // if(categories)
            if(category){
                filterExpression = {$and: [{category: category}, filterExpression]}
                // filterExpression = {$or: [{category: {$in: categories}}, filterExpression]}
            }

            return await collection.find(filterExpression).toArray();
        } catch(err){
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }


    // async filter(maxPrice, minPrice, category) {
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         let filterExpression = {};

    //         if(minPrice){
    //             filterExpression.price = {$gte: parseFloat(minPrice)}
    //         }
    //         if(maxPrice){
                
    //             filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
    //         }
    //         if(category){
    //             filterExpression.category = category
    //         }

    //         return await collection.find(filterExpression).toArray();
    //     } catch(err){
    //         throw new ApplicationError("Something went wrong with database", 503);
    //     }
    // }

    // nitin

    // async rate(userID, productID, rating){
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);

    //         // 1.  find the product
    //         const product = await collection.findOne({_id: new ObjectId(productID)});

    //         // 2. Find the rating
    //         const userRating = product?.ratings?.find(r => r.userID == userID);
    //         console.log("userat", userRating);
    //         console.log("userid", userID);
    //         if(userRating) {
    //             // 3. update the rating
    //             await collection.updateOne({
    //                 _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //             }, {
    //                 $set: {
    //                     "ratings.$.rating": rating
    //                 }
    //             })
    //         } else {
    //             await collection.updateOne({
    //                 _id: new ObjectId(productID)
    //             },{
    //                 $push: {ratings: {userID: new ObjectId(userID), rating}}
    //             })
    //         }
            
    //     } catch(err){
    //         throw new ApplicationError("Something went wrong with database", 503);
    //     }
    // }



    async rate(userID, productID, rating){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            // 1. removes existing entry
            await collection.updateOne({
                    _id: new ObjectId(productID)
                },{
                    $pull: {ratings: {userID: new ObjectId(userID)}}
                }
            );

            // 2. add new entry
            await collection.updateOne({
                _id: new ObjectId(productID)
            },{
                $push: {ratings: {userID: new ObjectId(userID), rating}}
            })
            
        } catch(err){
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }
}

export default ProductRepository;