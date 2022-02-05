const express = require('express');
const app = express();
const Router = express.Router();
const cors = require('cors');
const Joi = require('joi')
const PORT = process.env.port || 5050;
let mysql = require('./connection');
const conn = mysql.mysqlConnection();
const token = require('./token');
const { json } = require('express');
const validator = require('express-joi-validation').createValidator({})
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        callback(null, true)
    },
    allowedHeaders: "Accept, Origin, X-Requested-With, X-Auth-Token, X-Auth-Userid, Authorization, Content-Type, Cache-Control, X-Session-ID, Access-Control-Allow-Origin, x-app-version, X-GEO-TOKEN, X-Geo-Token, x-geo-token, x-device-token",
};

app.use(cors(corsOptions));
app.options("*", cors());

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    age: Joi.string().length(2).pattern(/^[0-9]+$/).required(),
    gender: Joi.string().required(),
    password: Joi.string().required(),
})

Router.get('/user',(req,res,next) => {
    if(req.headers.authorization){
        next();
    }else{
        res.status(401).send({
            "status":"401",
            "message" : "invalid token credential"
        })
    }
}, (req, res) => {
    conn.query('select * from user', function (err, data) {
        if (err) throw err;
        console.log("Result: " + data);
        res.json(data);
    })
});

Router.post('/register', validator.body(registerSchema), (req, res) => {
    const { email, password, phone, age, gender, name } = req.body;
    let sql = `INSERT INTO user (email, password, phone, age, gender,name) VALUES ('${email}', '${password}', '${phone}','${age}','${gender}','${name}')`
    conn.query(sql, function (err, data) {
        if (err) throw err;
        console.log("Result: " + data);
        data['accessToken'] = token.generateAccessToken(data);
        res.json(data);
    })
});

Router.post('/login', validator.body(loginSchema), (req, res) => {
    const { email, password } = req.body;
    let sql = `SELECT * FROM user WHERE email ="${email}"`
    conn.query(sql, function (err, data) {
        if (err) throw err;
        let user = data[0]
        console.log("Result: " , user);
        if(user.password === password){
            user['accessToken'] = token.generateAccessToken(user);
            delete user.password
            res.json(user);
        }else {
            console.log("Error: Invalid Login")
            // return error code of invalid auth
            res.status(401).send({
                "status":"401",
                "message" : "invalid email and password"
            });
        }
        
    })
});

app.use(Router)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
