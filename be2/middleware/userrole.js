const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { secret } = require('../config');

module.exports = {
    isAdmin : (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message : "access denied"});
        }else{
            const decoded = jwt.verify(token, secret);
            User.findOne({_id: decoded.id}).select("-password").then(user => {
                if(!user){
                    res.status(401).json({error:"invalid user"});
                }else{
                    if(user.role == "administrator"){
                        return next();
                    }else{
                        res.status(401).json({error:"midd unauthorized"});
                    }

                }
            });
        }
    },
    isOperator : (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message : "access denied"});
        }else{
            const decoded = jwt.verify(token, secret);
            User.findOne({_id: decoded.id}).select("-password").then(user => {
                if(!user){
                    res.status(401).json({error:"invalid user"});
                }else{
                    if(user.role == "administrator" || user.role == "operator"){
                        return next();
                    }else{
                        res.status(401).json({error:"midd unauthorized"});
                    }

                }
            });
        }
    },
    isUser : (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message : "access denied"});
        }else{
            const decoded = jwt.verify(token, secret);
            User.findOne({_id: decoded.id}).select("-password").then(user => {
                if(!user){
                    res.status(401).json({error:"invalid user"});
                }else{
                    if(user.role == "administrator" || user.role == "operator" || user.role == "user"){
                        return next();
                    }else{
                        res.status(401).json({error:"midd unauthorized"});
                    }
                }
            });
        }
    },
    isEngineer : (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({message : "access denied"});
        }else{
            const decoded = jwt.verify(token, secret);
            User.findOne({_id: decoded.id}).select("-password").then(user => {
                if(!user){
                    res.status(401).json({error:"invalid user"});
                }else{
                    if(user.role == "administrator" || user.role == "operator" || user.role == "engineer"){
                        return next();
                    }else{
                        res.status(401).json({error:"midd unauthorized"});
                    }
                }
            });
        }
    }

}
