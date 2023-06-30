const jwt = require('jsonwebtoken')

exports.CreateToken = async (data) => {
    const token = await jwt.sign(data, process.env.JWT_KEY, { expiresIn: '24h' })

    return token
}