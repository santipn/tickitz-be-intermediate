const Auth = require('../model/Auth')

module.exports = {
    login: async (req, res)=> {
        try {
            const results = await Auth.login(req, res)
            res.status(200).send(results)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    register: async (req, res)=> {
        try {
            const results = await Auth.register(req, res)
            res.status(200).send(results)
        } catch (error) {
            res.status(500).send(error)
        }
    },
}