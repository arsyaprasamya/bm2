/**
 * User Controller
 */

const { findByUsername, createUser, findUser, findAll, updateUser, deleteUser } = require('../services/userService');
const bcrypt = require('bcryptjs');
const { secret } = require('../config');
const jwt = require('jsonwebtoken');

module.exports = {
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Status [200:(Object) User, 500:(String) internal server error]}
     */
    registerUser : async function (req, res, next) {
        errors = {};
        const user = await findByUsername(req.body.username);
        if(user){
            error = "username exists"
            return res.status(400).json(error);
        }else{
            var passwordSalt = await bcrypt.genSalt(10);
            var passwordHash = await bcrypt.hash(req.body.password, passwordSalt);
            var userData = {
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                username : req.body.username,
                password : passwordHash,
                role : req.body.role
            }
            var newUser = await createUser(userData);
            if(newUser){
                res.status(200).json({status: "success", data: newUser});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Status [200:(Object) User, 500:(String) internal server error]}
     */
    listUser : async function(req, res, next){
        console.log(req.query);
        var query = req.body.filter;
        var page = req.body.page;
        var limit = req.body.limit;
        const user = await findAll(query, page, limit);
        if(user){
            res.status(200).json({items: user, totalCount: user.length});
        }else{
            res.status(500).json({status: "error", data: "internal server error"});
        }
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Status [200:(Object) User, 500:(String) internal server error]}
     */
    findUserId : async function(req, res, next){
        var user = await findUser(req.params.id);
        if(user){
            return res.status(200).json({status: "success", data: user});
        }else{
            return res.status(500).json({status: "error", data: "internal server error"});
        }
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Status [200:(Object) User, 500:(String) internal server error]}
     */
    findUserByToken : async function(req, res, next){
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({status: "unauthorized"})
        }else{
            const decoded = jwt.verify(token, secret);
            var user = await findUser(decoded.id);
            if(user){
                return res.status(200).json({status: "success", data: user});
            }else{
                return res.status(401).json({status: "unauthorized"});
            }
        }
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Status [200:(Object) User, 500:(String) internal server error]}
     */
    updateUser : async function(req, res, next){
        var id = req.params.id;
        var userqry = req.body.user;
        if(userqry.password){
            var passwordSalt = await bcrypt.genSalt(10);
            var passwordHash = await bcrypt.hash(userqry.password, passwordSalt);
            userqry.password = passwordHash;
        }
        var user = await updateUser(id, userqry);
        if(user){
            return res.status(200).json({status: "success", data: user});
        }else{
            return res.status(500).json({status: error, data: "internal server error"});
        }

    },
    /**
     *
     */

    /**
     *
     * @param req
     * @param res
     * @param next
     * @returns {Status [200:(Object) User, 500:(String) internal server error]}
     */
    deleteUser : async function(req, res, next){
        var id = req.params.id;
        var user = await deleteUser(id);
        if(user){
            return res.status(200).json({status: "success", data: "user deleted"});
        }else{
            return res.status(500).json({status: "error", data: "internal server error"});
        }
    }

}