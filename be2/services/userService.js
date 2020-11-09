/**
 * User database services
 *
 * @type {*|User Service}
 */
const User = require('./../models/user');

module.exports = {
    /**
     *Find all user
     *
     * @param query
     * @param page
     * @param limit
     * @returns {User}
     *
     */
    findAll : async function(query, page = 1, limit =10){
        try{
            var skip = (page - 1) * limit;
            var users = await User.find(query).select("-password").skip(skip).limit(limit);
            return users;
        }catch (e) {
            console.log(e);
        }
    },
    /**
     *
     * @param username
     * @returns {User}
     */
    findByUsername : async function(username) {
        try {
            var user = await User.findOne({username});
            return user;
        } catch (e) {
            console.log(e);
        }
    },
    /**
     *
     * @param id
     * @returns {User}
     */
    findUser : async function (id){
        try{
            var user = await User.findById(id).select("-password");
            return user;
        }catch(e){
            console.log(e);
        }
    },
    /**
     *
     * @param user
     * @returns {User}
     */
    createUser : async function(user){
        const userData = user;
        try {
            let newUser = await new User(userData).save();
            if(newUser){
                return newUser;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    /**
     *
     * @param id
     * @param user
     * @returns {User}
     */
    updateUser : async function(id, user){
        try{
            var updatedUser = await User.findByIdAndUpdate(id, user);
            if(updatedUser){
                return updatedUser
            }else{
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },
    /**
     *
     * @param id
     * @returns {Promise<boolean>}
     */
    deleteUser : async function (id) {
        try {
            var deletedUser = await User.findByIdAndRemove(id);
            if(deletedUser){
                return true
            }else{
                return false
            }

        }catch (e) {
            console.log(e)
        }
    }
};