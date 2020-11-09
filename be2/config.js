/**
 *
 * Configuration for application
 *
 * @param
 */
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

module.exports = {
    dbUrl : process.env.DATABASE_URL || 'mongodb://backendnode:kimcil123@ds033419.mlab.com:33419/heroku_dzk1pffl',
    secret : process.env.SECRET || 'mexWb02isI',
    port : process.env.PORT || 3000,
};