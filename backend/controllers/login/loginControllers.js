const users = require('../../model/login/loginModel');

async function loginHandeler(req, res)
{
    const {username, psw} = req.body;
    console.log(username, psw)
    const result = await users.find({'mail': username, 'psw': psw})
    if(result)
    {
        console.log("============")
        console.log(result)
        return res.status(200).json(result)    
    }
    return res.status(401).json({'msg': 'unable to login'})
}

module.exports = {
    loginHandeler
}