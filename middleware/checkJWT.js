const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //JWTを持っているかを確認->リクエストヘッダの中のx-auth-tokenを確認
    const token = req.header("x-auth-token");

    if(!token){
        return res.status(400).json({errors: [{message: "No JWT"}]});
    }else{
        try{
            //JWTトークンのデコード
            let user = jwt.verify(token, "secret_key");
            console.log(user);
            req.user = user.email;
            //ここまで来ると次のアロー関数が呼ばれる
            next();
        }
        catch(err){
            return res.status(400).json({errors: [{message: "JWT token is incorrect"}]});
        }

    }
}