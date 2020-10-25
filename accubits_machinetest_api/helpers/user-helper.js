var db = require('../config/connection')
var collections = require('../Config/collection')
const { resolve } = require('promise')
var bcrypt = require('bcrypt')
var uuid = require('uuid');

module.exports = {
    /* Creating new user */
    addUser: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    /* Login user */
    userLogin: (loginData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ Email: loginData.Email })
            user.uniqID = uuid.v1();
            console.log(user)
            if (user) {
                db.get().collection(collections.USER_AUTHTOKEN).insertOne(user).then((data) => {
                    resolve(data.ops[0])
                })
                await bcrypt.compare(loginData.Password, user.Password).then((status) => {
                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    /*Getting auth tokken details */
    getAuthTokens: (userLoginDetails) => {
        return new Promise(async (resolve, reject) => {
            let userToken = await db.get().collection(collections.USER_AUTHTOKEN).find().toArray()
            resolve(userToken)
        })
    }

}