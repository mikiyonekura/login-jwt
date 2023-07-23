const router = require('express').Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../db/User');
const jwt = require('jsonwebtoken');

router.get("/", (req, res) => {
    res.send("Helloo Authjs");
});    

//ユーザ新規登録用のAPI
router.post('/register', 
    body("email").isEmail(), 
    body("password").isLength({min: 5}),
    async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //バリデーションチェック
    const errors = validationResult(req);
    //エラーが空じゃなかったら
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //3:DBにユーザが存在しているか確認（ここではダミーDB）
    const user = User.find((user) => user.email === email);
    if(user){
        return res.status(400).json({errors: [{message: "User already exists"}]});
    }

    //4:パスワードの暗号化(bcrypt使う)
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(email);
    console.log(password);
    console.log(hashedPassword);

    //5:ユーザをDBに登録
    User.push({
        email: email,
        password: hashedPassword
    });

    //6:jwt tokenを作成
    const token = await jwt.sign(
        {
            email,
        },
        "secret_key",
        {
            expiresIn: "1h"
        }
    );

    return res.json(
        {
            token
        }
    );
    
    
});


//ログイン用のAPI
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = User.find((user) => user.email === email);
    if(!user){
        return res.status(400).json({errors: [{message: "User is not already exists"}]});
    }


    //passの複合,照会
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({errors: [{message: "Password is incorrect"}]});

    }

       //6:jwt tokenを作成
    const token = await jwt.sign(
        {
            email,
        },
        "secret_key",
        {
            expiresIn: "1h"
        }
    );

    return res.json(
        {
            token
        }
    );

    
});


router.get('/users',(req, res) => {
    return res.json(User)
});




module.exports = router;

