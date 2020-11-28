const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mysql = require("mysql");
const iconv = require("iconv-lite");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 5000;

const dataBuffer = fs.readFileSync("json_datas.json");

const jwt_key = fs.readFileSync("./jwt_key.json");
const jwt_secret_key = JSON.parse(jwt_key);

// db connection
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});

function handleDisconnect() {
  connection.connect(function(err) {            
    if(err) {                            
      console.log('error when connecting to connection:', err);
      setTimeout(handleDisconnect, 2000); 
    }                                   
  });                                 
                                         
  connection.on('error', function(err) {
    console.log('connection error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      return handleDisconnect();                      
    } else {                                    
      throw err;                              
    }
  });
}

handleDisconnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// datas 전달
app.get("/api/datas", (req, res) => {
  iconv.extendNodeEncodings();
  res.header("Access-Control-Allow-Origin", "*");
  // res.send(iconv.decode(dataBuffer, "EUC-KR").toString());
  res.send(iconv.decode(dataBuffer, "utf-8").toString());
});

// signup
app.post("/api/signup", (req, res) => {

  let sql_usercheck = `SELECT * FROM USER WHERE name='${req.body.username}';`;
  connection.query(sql_usercheck, (err, rows, fields) => {
   
  // original code(line 75): 
  // if (rows.length){  
  
  // you have to change here if you get following undefined error 
  /*
        ~/node_modules/mysql/lib/protocol/Parser.js:437
      throw err; // Rethrow non-MySQL errors 
  */
      if(!(rows.length == "undefined") && rows.length > 0) {
      return res.json({
        code: 400,
        message: 'user exist'
      })
    }
    else {
      let sql = "INSERT INTO USER (name, pw) VALUES(?, ?)";
      let plainPassword = req.body.password;
      bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
        const params = [req.body.username, hash];
        connection.query(sql, params, (err, rows, fields) => {
          if (err) {
            res.send({
              code: 400,
              message: "error",
            });
          } else {
            res.send({
              code: 200,
              message: "success",
            });
          }
        });
      });
    }
  })
});

app.post("/api/signin", (req, res) => {
  
  const name = req.body.username;
  let sql = `SELECT name, pw FROM USER WHERE name='${req.body.username}';`;
  let sql_usercheck = `SELECT * FROM USER WHERE name='${req.body.username}';`;
 
  connection.query(sql_usercheck, (err, rows, fields) => {
    if(!rows.length) {
      return res.send({
        code: 400,
        message: "user does not exist",
      });
    } else {

      connection.query(sql, (err, rows, fields) => {
        bcrypt.compare(req.body.password, rows[0].pw, function (err, result){
            const pw = rows[0].pw;
            if(result) {
                
                try {
                    const token = jwt.sign(
                      {
                        name,
                        pw,
                      },
                      jwt_secret_key.value,
                      {
                        expiresIn: "60m",
                        issuer: "admin",
                      }
                    );
                      
                  
                    return res.json({
                        code: 200,
                        message: 'Token issue',
                        token,
                        username : name
                      });
                    
                    

                  } catch (error) {
                    console.error(error);
                    return res.status(500).json({
                        code: 500,
                        message: 'server error',
                      });
                  }

            } else {
                return res.json({
                    code: 400,
                    message: "invalid password",
                });
            }
        })
    
    })
    }
  })
});


// ?? ???
app.get('/api/auth', (req, res) => {
  
  
  const user = jwt_decode(req.headers.authorization);
  try {

    req.decoded = jwt.verify(req.headers.authorization, jwt_secret_key.value);
    return res.status(200).json({
      code: 200,
      message: 'valid token',
      username: user.name
    });
  }

  
  catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: 'expired token'
      });
    }


    return res.status(401).json({
      code: 401,
      message: 'invalid token'
    });
  }
});

app.get("/api/mypicks", (req, res) => {
  let result = [];
  const user = jwt_decode(req.headers.authorization);
  const username = user.name;
  // let temp = iconv.decode(dataBuffer, "EUC-KR");
  let temp = iconv.decode(dataBuffer, "utf-8");

  connection.query(`SELECT pick FROM USER WHERE NAME='${username}';`, (err, rows, fileds) => {
    if(rows.length === 0) {
      return res.status(401).json({
        code: 401,
        message: 'card 0'
      });
    }
    if(rows[0].pick === null) {
      return res.status(401).json({
        code: 401,
        message: 'card 0'
      });
    }
    
    let user_picks = rows[0].pick.split(',');
      console.log(rows[0].pick);
      temp = JSON.parse(temp);
      user_picks.pop();
      for(let i=0; i<user_picks.length; i++) {
        user_picks[i] = parseInt(user_picks[i]);
      }
      for(let i=0; i<user_picks.length; i++) {
        result.push(temp[user_picks[i]-1]);
    }

      res.send({'datas':result});
  })
});

app.post('/api/pick', (req, res) => {
   
  const user = jwt_decode(req.headers.authorization);
  const username = user.name;
  const cardid = req.body.cardid;

  connection.query(`SELECT pick FROM USER WHERE NAME='${username}';`, (err, rows, fileds)=> {
    if(rows.length === 0) {
      return res.status(401).json({
        code: 401,
        message: 'card exist'
      });
    } 
    else {
      if(rows[0].pick === null || rows[0].pick === '') {
        const newPick = cardid.toString() + ',';
        connection.query(`UPDATE USER SET pick='${newPick}' WHERE NAME='${username}';`, (err, rows, fields) => {
          return res.status(200).json({
            code: 200,
            message: 'insertion success',
          });
        })
      }
      else {
      var flag = true;
      let user_picks = rows[0].pick.split(',');
      user_picks.pop();
      for(let i=0; i<user_picks.length; i++) {
        user_picks[i] = parseInt(user_picks[i]);
        if(user_picks[i] == cardid) {
          flag = false;
        }
      }
      if(flag) {
        const newPick = rows[0].pick + cardid.toString() + ',';
        connection.query(`UPDATE USER SET pick='${newPick}' WHERE NAME='${username}';`, (err, rows, fields) => {
          return res.status(200).json({
            code: 200,
            message: 'insertion success',
          });
        })
      }
      else {
        return res.status(401).json({
          code: 401,
          message: 'card exist'
        });
      }
      } 
    }
  })
});

app.post('/api/delete', (req, res) => {
  const user = jwt_decode(req.headers.authorization);
  const username = user.name;
  const cardid = req.body.cardid;

  connection.query(`SELECT pick FROM USER WHERE NAME='${username}';`, (err, rows, fileds)=> {
    if(rows.length === 0) {
      return res.status(401).json({
        code: 401,
        message: 'card exist'
      });
    } else {
      let flag = false;
      if(rows[0].pick === null) {
        return res.status(401).json({
          code: 401,
          message: 'card 0'
        });
      }
      let user_picks = rows[0].pick.split(',');
      let newPick = '';
      user_picks.pop();
      for(let i=0; i<user_picks.length; i++) {
        if(user_picks[i] == cardid) {
          flag = true;
          continue;
        }
        else newPick = newPick + (user_picks[i] + ',');
      }
      if(flag) {    
        console.log(user_picks, newPick);
        connection.query(`UPDATE USER SET pick='${newPick}' WHERE NAME='${username}';`, (err, rows, fields) => {
          return res.status(200).json({
            code: 200,
            message: 'delete success',
          });
        })
      } else {
        return res.status(401).json({
          code: 401,
          message: 'delete error'
        });
      }

    }
  })

});

app.listen(port, () => console.log(`Listening on port ${port}`));
