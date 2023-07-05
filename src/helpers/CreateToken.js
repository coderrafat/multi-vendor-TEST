const jwt = require('jsonwebtoken')

exports.CreateToken = async (data, expireToken) => {
    try {
        const token = await jwt.sign(data, process.env.JWT_KEY, { expiresIn: expireToken })

        return token
    } catch (error) {
        console.log(error)
    }
}