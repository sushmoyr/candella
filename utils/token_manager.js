const jwt = require('jsonwebtoken');
const blackListTokens = [];

const blockToken = (token)=>{
    blackListTokens.push(token);
}

const isTokenBlocked = (token) => {
    return blackListTokens.includes(token);
}


const verifyToken = async (req, res, next) => {
    const token = req.headers.token;

    if(token && !isTokenBlocked(token)){
        jwt.verify(token, process.env.JWT_KEY, {}, (err, user)=> {
            if(err){
                return res.status(401).json({
                    code: 401,
                    message: "Invalid token. Login to get a new token"
                });
            }
            console.log("user is ", user);
            req.user = user;
            next();
        });

    } else {
        return res.status(401).json({
            code: 401,
            message: "Not Authenticated"
        });
    }
}

const verifyTokenFromCookie = async (req, res, next) => {
    const token = req.cookies['auth-token'];

    if(token && !isTokenBlocked(token)){
        jwt.verify(token, process.env.JWT_KEY, {}, (err, user)=> {
            if(err){
                req.url = req.url + 'login';
                next('route');
            }
            console.log("user is ", user);
            req.user = user;
            next();
        });

    } else {
        req.url = '/login';
        next('route');
    }
}

const destroyToken = (req, res, next)=>{
    const token = req.headers.token;

}

module.exports = {verifyToken, blockToken, isTokenBlocked, verifyTokenFromCookie};