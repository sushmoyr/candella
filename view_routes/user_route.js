const {loginUser, registerUser, hashPassword} = require("../controllers/auth_controller");
const router = require('express').Router();
const Error = require('../models/utils/error');
const Success = require('../models/utils/success');
const {isTokenBlocked} = require("../utils/token_manager");
const jwt = require("jsonwebtoken");
const User = require("../models/data/user");

//default
router.get('/', (req, res, next) => {
    //req.url = '/login'
    const token = req.cookies['auth-token'];
    //res.render('welcome');
    if (token && !isTokenBlocked(token)) {
        jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
            if (err) {
                req.url = req.url + 'login';
                next('route');
            } else {
                console.log("user is ", user);
                req.user = user;
                res.user = user;
                res.render('welcome');
            }

        });
    } else {
        req.url = req.url + 'login';
        next('route');
    }
})

router.get('/login', (req, res) => {
    res.render('login', {data: null});
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    loginUser(email, password).then((data) => {
        console.log(data);
        if (data instanceof Success) {
            const token = data.body;
            res.cookie('auth-token', token);
            res.redirect('/');
        } else {
            res.render('login', {data: data})
        }
    })
})

router.get('/register', (req, res) => {
    res.render('register', {data: null});
});

router.post('/register', async (req, res) => {
    let {name, email, password} = req.body;
    if (name && email && password) {
        password = await hashPassword(password);
        await User.create({
            name: name,
            email: email,
            password: password
        }).then((data) => {
            res.render('login', {data: new Success(201, 'Account Created Successfully')});

        })
            .catch(err => {
                const kp = err["keyPattern"];
                if (kp && kp['email'] === 1)
                    res.render('register', {data: new Error(404, "Email already exists!!")});

                else
                    res.render('register', {data: new Error(500, "There was an error")});
            })
    } else {
        let message = "Field(s) ";
        if (!name)
            message += 'name, ';
        if (!email)
            message += 'email, ';
        if (!password)
            message += 'password, ';
        message += 'is missing';

        res.render('register', {data: new Error(404, message)})
    }

});


//login
/*
router.get('')*/
module.exports = router;