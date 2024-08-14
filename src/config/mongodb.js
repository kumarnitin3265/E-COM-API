
import { MongoClient } from "mongodb";

let client;
export const connectToMongoDB = () => {
    MongoClient.connect(process.env.DB_URL)
        .then(clientInstance => {
            client = clientInstance
            console.log("MongoDB is connected");
            createIndexes(client.db());
        })
        .catch(err => {
            console.log(err);
        })
}

export const getDB = () => {
    return client.db();
}

const createIndexes = async(db) => {
    try {
        await db.collection('products').createIndex({price: 1});
        await db.collection('products').createIndex({name: 1, category: -1});
        await db.collection('products').createIndex({desc: "text"});
    } catch(err){
        console.log(err);
    }
    console.log('Indexes are created');
}