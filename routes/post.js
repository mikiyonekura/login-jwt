const router = require('express').Router();
const {publicPosts, privatePosts } = require('../db/Post');
const jwt = require('jsonwebtoken');
const checkJWT = require('../middleware/checkJWT');

//誰でも閲覧可能なAPI
router.get("/public", (req, res) => {
    res.json(publicPosts);
});

//JWT認証が必要なAPI
router.get(
    "/private",
    //middlewareを呼び出す
    checkJWT
    ,(req, res) => {
        console.log(privatePosts);
        res.json(privatePosts);
});


module.exports = router;

