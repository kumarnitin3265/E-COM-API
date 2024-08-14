
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {

    // 1. read the token
    const token = req.headers["authorization"];

    // 2. if no token, return error
    if(!token) {
        console.log("before try");
        return res.status(401).send("Unauthorized: Authorization header is missing");
    }

    // 3. check if token is valid
    try {
        const payload = jwt.verify(
            token, 
            process.env.JWT_SECRET
        );
        req.userID = payload.userID;
        console.log("payload", payload);
    } catch (err) {
        // 4. return error
        console.log("in catch");
        console.log(err);
        return res.status(401).send("Unauthorized");
    }
    
    // 5. call next middleware
    next();
}

export default jwtAuth;