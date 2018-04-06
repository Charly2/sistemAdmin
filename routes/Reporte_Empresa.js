/**
 * Created by Juan Carlos on 10/03/2018.
 */
var express = require('express');
var router = express.Router();
var auth = require('../funciones/authentication');
var reporteEmpresa = require('../models/Reporte_EmpresaModel');
var comentarioModel = require('../models/Comentario');
var categoria = require('../models/CategoriaModel');
var empresa = require('../models/EmpresaModel');
var now = new Date();
var dateFormat = require('dateformat');

var reporteLcal = require('../models/Reportes_LocalModel');

var Archivos = require('../models/Archivo_Mensaje');
var path = require('path');
var categoria = require('../models/CategoriaModel');
var file = require('../models/Archivo_Mensaje');
var fileUser = require('../models/Archivo_MensajeUser');
router.get('/', function(req, res, next) {
    //console.log(req.body)
    auth.mach(req,res,
        function (req,res) {

            categoria.findEmpresa(function (ere,data) {
                if (!ere) {
                    //Recibe datos del wizard
                    categoria.getAll(function (er,da) {
                        if (!er) {
                            res.render('new_report_e', { title: 'Sicty report system',user:req.session.nombre,cat:da,emp:data });
                        }
                    });


                }
            });


        }
    );
});





router.get('/:id', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        var datos ={};
        var id = req.params.id;
        reporteEmpresa.findById(id,function (err, data) {
            if (!err){

                datos.info = data[0];
                //console.log("esto->>>"+  datos.info.propiedades);
                if(datos.info.propiedades != null) {
                    datos.propiedades = datos.info.propiedades.split(',');
                    //console.log(datos.info.propiedades)
                }else{
                    datos.propiedades = [];
                }


                comentarioModel.clientefindByReporteAux(id,function (errC,dataC) {
                    if(!errC){
                        datos.comentariosC = dataC;

                        comentarioModel.usariofindByReporteAux(id,function (errU,dataU) {
                            if(!errU){
                                datos.comentariosU = dataU;
                                //
                                // res.status(200).json(datos);
                                Archivos.findByReporteU(id,function (e,d) {
                                    datos.fiAdd = d;
                                    //console.log(datos);
                                    res.render('report_e',{title: 'Sicty report system', data:datos, user:req.session.nombre});
                                    //res.status(200).json(datos);
                                });

                            }
                        });
                    }
                });
            }
        });
    });
});

router.post('/', function(req, res, next) {
    console.log("SE enrtro")
    var reporte  = [],
        a        = req.body,
        now      = dateFormat(now, "yyyy-mm-dd"),
        operador = req.session.nombre.idusuario;

    reporte[0] = ["Reporte Empresarial", a.descripcion,now,now,"Abierto",a.categoria,operador,0];
    reporte[1] = [0, a.empresa,a.correo,a.telefono];
    console.log(reporte);
    reporteEmpresa.save(reporte,function (err, data) {
        if (!err){
            console.log(data)
            res.redirect('/reporte_empresa/'+data)
            //res.redirect('reporte_empresa/'+data)
        }
    });
});

router.post('/files/:id', function(req, res, next) {
    console.log("HOla")
    var archivo = req.files.file;
    var auxq = archivo.name.split('.');
    var reporte = [auxq[1],req.params.id,archivo.name];

    Archivos.saveReport(reporte,function (err, data) {
        if (!err){
            console.log(data);
            var name = data+'.'+auxq[1];
            var aux = 'files/'+ name;
            console.log(aux);
            archivo.mv(aux , function(err) {
                if (err)
                    res.status(500).send(err);
                res.send(''+data+'');
            });
        }
    });
});

router.post('/filescomentario/:id/:rep', function(req, res, next) {
    console.log(req.files);
    var archivo = req.files.file;
    var auxq = archivo.name.split('.');
    var reporte = [auxq[1],req.params.id,archivo.name];


    Archivos.saveComen(reporte,function (err, data) {
        if (!err){
            var name = data+'.'+auxq[1];
            var aux = 'files_c/'+ name;

            archivo.mv(aux , function(err) {
                if (err)
                    res.status(500).send(err);
                res.redirect('/reporte_empresa/'+req.params.rep+'#inputImage'+req.params.id)
            });

        }
        else{
            console.log("Error Aqui")
        }
    });
});


module.exports = router;