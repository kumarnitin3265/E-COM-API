import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res) {
        const {name, email, password, type} = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new UserModel(
            name, 
            email, 
            hashedPassword, 
            type
        );

        await this.userRepository.signUp(user);
        res.status(201).send(user);
    };

    async signIn(req, res, next) {
        try {
            // 1. find user by email
            const user = await this.userRepository.findByEmail(req.body.email);
            if(!user){
                return res
                    .status(400)
                    .send('Incorrect Credentials');
            } else {
                // 2. compare password with hash passowrd
                const result = await bcrypt.compare(req.body.password, user.password);
                if(result) {
                    // 3. create token
                    const token = jwt.sign(
                        {
                            userID: user._id, 
                            email: user.email
                        }, 
                        process.env.JWT_SECRET, 
                        {
                            expiresIn: '500h',
                        }
                    );

                    // 4. send token
                    return res.status(200).send(token);
                } else {
                    return res
                    .status(400)
                    .send('Incorrect Credentials');
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(503).send("Something went wrong");
        }
    };
}