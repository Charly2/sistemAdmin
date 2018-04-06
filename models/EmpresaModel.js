var connection = require('../connection/connection');
var randomstring = require("randomstring");

var Empresa = {};


Empresa.getTodos = function (callback) {
    if (connection){
       
        var sql = "SELECT * FROM `empresa`";
        connection.query(sql, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};

Empresa.findById = function (id,callback) {
    if (connection){
        
        var sql = "SELECT * FROM `empresa` WHERE `idempresa` = ?";
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};

Empresa.save = function (id,callback) {
    if (connection){
        var sql = "INSERT INTO `empresa`  VALUES (null, ?,?);";
        var token= randomstring.generate({
            length: 6,
            charset: 'alphabetic'
          });
          console.log(token);
          id[1]=token;
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data.insertId);
            }
        });
    }
};

module.exports= Empresa;