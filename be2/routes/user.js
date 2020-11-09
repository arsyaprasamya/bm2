/**
 *
 * @type {Router}
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require("../middleware/userrole");
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// get user by token
router.get('/', [passport.authenticate('jwt', {session: false}), middleware.isAdmin, middleware.isOperator, middleware.isUser], userController.findUserByToken);
// list user
router.get('/list', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], userController.listUser);
// get user by id
router.get('/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], userController.findUserId);
// update user
router.patch('/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], userController.updateUser);
// delete
router.delete('/:id', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], userController.deleteUser);
// add user
router.post('/add', [passport.authenticate('jwt', {session: false}), middleware.isAdmin], userController.registerUser);
// login user
router.post('/login', authController.login);
module.exports = router;