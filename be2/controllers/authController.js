/**
 * Auth Controller
 */
const { findByUsername } = require('../services/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = {
    /**
     *
     * @param req { username, password }
     * @param res
     * @param next
     * @returns { Status [200: (Object) Jwt Token, 401: (String) Unathorized]}
     */
    login : async function (req, res, next) {
        errors = {};
        const username = req.body.username;
        const password = req.body.password;
        const user = await findByUsername(username);
        if(!user){
            errors.username = "can't found your credential";
            res.status(401).json(errors);
        }
        
        var match = await bcrypt.compare(password, user.password);
        if(match) {
            const payload = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            };
            jwt.sign(payload, secret, {expiresIn: 36000},
                (err, token) => {
                    if (err) res.status(500)
                        .json({
                            error: "Error signing token",
                            raw: err
                        });
                    res.json({
                        success: true,
                        token: `${token}`,
                        role: user.role,
                        id: user.id
                    });
                });
        } else {
            errors.password = "can't found your credential";
            res.status(401).json(errors);
        }

    },
}