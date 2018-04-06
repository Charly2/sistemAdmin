/**
 * Created by Juan Carlos on 02/03/2018.
 */

var connection = require('../connection/connection');
var ComentarioModel = {};


ComentarioModel.getAll = function (callback) {
    if (connection){
        var sql = "SELECT * FROM `mensaje` INNER JOIN msjusuario on mensaje.idmensaje = msjusuario.idmensaje where mensaje.isnota =0";
        connection.query(sql, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};

ComentarioModel.findById = function (id,callback) {
    if (connection){
        var sql = "SELECT * FROM `mensaje` INNER JOIN msjusuario on mensaje.idmensaje = msjusuario.idmensaje WHERE mensaje.idmensaje = ? ";
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};



ComentarioModel.usariofindByReporte = function (id,callback) {
    if (connection){
        var sql = "SELECT mensaje.*,msjusuario.*,usuario.nombre,usuario.idrol FROM `mensaje` INNER JOIN msjusuario on mensaje.idmensaje = msjusuario.idmensaje INNER JOIN usuario on msjusuario.idusuario = usuario.idusuario  WHERE mensaje.idreporte = ? ";
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};






ComentarioModel.usariofindByReporteAux = function (id , callback) {
    if (connection){
        connection.beginTransaction(function(err) {
            if (err) { callback(true,{"er":"connection","cod":error}); }
            var sqlA = "SELECT mensaje.*,msjusuario.*,usuario.nombre,usuario.idrol FROM `mensaje` INNER JOIN msjusuario on mensaje.idmensaje = msjusuario.idmensaje INNER JOIN usuario on msjusuario.idusuario = usuario.idusuario  WHERE mensaje.idreporte = ? ";
            connection.query(sqlA,id,function (error, results) {
                if (error) {
                    return connection.rollback(function() {
                        callback(true,{"er":"usr","cod":error});
                    });
                }else{
                    //console.log(results);
                    var aux = results;
                    results.forEach(function (e) {
                        console.log(e.idmensaje)
                        connection.query("SELECT * FROM `archivo` WHERE `idmensaje` = ?",e.idmensaje, function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function() {
                                    callback(true,{"er":"log","cod":error});
                                });
                            }else{
                                e.archivos = results
                            }
                        });
                    });
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback(true,{"er":"comit","cod":error});
                            });
                        }
                        console.log('success!');
                        callback(false,results);
                    });
                }

            });
        });
    }
};

ComentarioModel.clientefindByReporteAux = function (id , callback) {
    if (connection){
        connection.beginTransaction(function(err) {
            if (err) { callback(true,{"er":"connection","cod":error}); }
            var sqlA = "SELECT * FROM `mensaje` INNER JOIN msjcliente on mensaje.idmensaje = msjcliente.idmensajecliente WHERE mensaje.idreporte = ? ";
            connection.query(sqlA,id,function (error, results) {
                if (error) {
                    return connection.rollback(function() {
                        callback(true,{"er":"usr","cod":error});
                    });
                }else{
                    //console.log(results);
                    var aux = results;
                    results.forEach(function (e) {
                        console.log(e.idmensaje)
                        connection.query("SELECT * FROM `archivo` WHERE `idmensaje` = ?",e.idmensaje, function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function() {
                                    callback(true,{"er":"log","cod":error});
                                });
                            }else{
                                e.archivos = results
                            }
                        });
                    });
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                callback(true,{"er":"comit","cod":error});
                            });
                        }
                        console.log('success!');
                        callback(false,results);
                    });
                }

            });
        });
    }
};


ComentarioModel.clientefindByReporte = function (id,callback) {
    if (connection){
        var sql = "SELECT * FROM `mensaje` INNER JOIN msjcliente on mensaje.idmensaje = msjcliente.idmensajecliente WHERE mensaje.idreporte = ? ";
        connection.query(sql,id, function (error,data) {
            if (error)
                throw error;
            else{
                callback(null,data);
            }
        });
    }
};



ComentarioModel.save=function(reporte,callback){

    connection.beginTransaction(function(err) {
        if (err) { callback(true,{"er":"connection","cod":error}); }

        connection.query("INSERT INTO `mensaje`  VALUES (NULL, ?,NOW(), ?,?)",reporte[0],function (error, results) {
            if (error) {
                return connection.rollback(function() {
                    callback(true,{"er":"usr","cod":error});
                });
            }else{
                reporte[1][0] = results.insertId;
                connection.query("INSERT INTO `msjusuario`  VALUES (?, ?);",reporte[1], function (error, results, fields) {
                    if (error) {
                        return connection.rollback(function() {
                            callback(true,{"er":"log","cod":error});
                        });
                    }else{

                        connection.query("UPDATE `reporte` SET `fechamod`=NOW() WHERE `idreporte` = ?",reporte[0][0], function (ert, ret, fields){
                            if (ert) {
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
                                    callback(false,results);
                                });
                            }
                        })




                    }
                });
            }

        });
    });
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


module.exports= ComentarioModel;