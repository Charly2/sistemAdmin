/**
 * Created by Juan Carlos on 12/03/2018.
 */
/**
 * Created by Juan Carlos on 08/03/2018.
 */
/**
 * Created by Juan Carlos on 06/03/2018.
 */
/**
 * Created by Juan Carlos on 02/03/2018.
 */

var connection = require('../connection/connection');
var Categoria = {};


Categoria.getAll = function (callback) {
    if (connection){
        var sql = "select COUNT(idreporte) as repor, categoria.* from reporte inner join categoria on reporte.idcategoria = categoria.idcategoria group by reporte.idcategoria ;";
        connection.query(sql, function (error,data) {
            console.log(data);
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};

Categoria.getAllExt = function (callback) {
    if (connection){
        var sql = "SELECT * FROM `categoria`";
        connection.query(sql, function (error,data) {
            console.log(data);
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};


Categoria.findEmpresa = function (callback) {
    if (connection){
        var sql = "SELECT * FROM `empresa";
        connection.query(sql, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};

Categoria.findById = function (id,callback) {
    if (connection){
        var sql = "SELECT * FROM `categoria` WHERE `idcategoria` = ?";
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};


Categoria.edit = function (id,callback) {
    if (connection){
        var sql = "UPDATE `categoria` SET `nombre_cat`=?,`prioridad_cat`=? WHERE idcategoria= ?";
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};




Categoria.userCat = function (id,callback) {
    if (connection){
        var sql = "SELECT * FROM `cat_user` INNER JOIN categoria on cat_user.idcat = categoria.idcategoria INNER JOIN usuario on usuario.idusuario = cat_user.iduser WHERE idcat = ?;";
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};


Categoria.save=function(archivo,callback){
    if (connection){
        connection.query("INSERT INTO `categoria` VALUES (null, ?, ?)",archivo, function (error, results, fields) {
            if (error) {
                return connection.rollback(function() {
                    callback(true,{"er":"log","cod":error});
                });
            }else{
                connection.commit(function(err) {
                    if (err) {
                        return connection.rollback(function() {
                            callback(true,{"er":"comit","cod":error});
                        });
                    }
                    console.log('success!');
                    callback(false,results.insertId);
                });
            }
        });
    }
};



/*ReporteLocalModel.delete = function (id,callback) {
 if (connection){
 var sql = "select * from reporte inner join reporte_local on reporte.idreporte = reporte_local.idreporte_local where idreporte = ?";
 connection.query(sql,id, function (error,data) {
 if (error)
 throw error;
 else{
 callback(null,data);
 }
 });
 }
 };*/

module.exports= Categoria;