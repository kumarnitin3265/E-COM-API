import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

class UserRepository {
    async signUp(newUser){

        try {

            // 1.  Get the database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection("users");

            // 3. Insert the document
            await collection.insertOne(newUser);
            return newUser;
        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }

    // signin method
    async findByEmail(email){

        try {

            // 1.  Get the database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection("users");
            // 3. Find the document
            return await collection.findOne({email});

        } catch (err) {
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }

}

export default UserRepository;