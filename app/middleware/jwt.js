var jwt = require('jsonwebtoken');


module.exports = {
    generateToken:async (data, next)=> {
        try {
            const userId = data.user_id
            var token = await jwt.sign({ user_id: userId }, process.env.TOKEN_KEY);
            console.log(token);
            return token;
            
        } catch (error) {
            console.log(error);            
        }
    },
    verifyToken:async (req, res, next) => {
        try {
            const token = req.headers['x-access-token']
            
            var decoded = await jwt.verify(token, process.env.TOKEN_KEY);
            req.userId = decoded.user_id;
            next();
        } catch (error) {
            console.log(error);            
        }
    }
}
