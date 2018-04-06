var express = require('express');
var router = express.Router();
var now = new Date();
var comentarioModel = require('../models/Comentario');
var auth = require('../funciones/authentication');


router.post('/empre', function(req, res, next) {
    console.log();
    var reporte = [],a=req.body;
    reporte[0] = [a.reporte,a.body];
    reporte[1] = [0,a.user];
    if(a.isnota==1){
        reporte[0][2] = '1';
    }else{
        reporte[0][2] = '0';
    }
    console.log(reporte[0]);
    console.log(reporte[1]);
    comentarioModel.save(reporte,function (err, data) {
        if (!err){
            console.log(data);
            res.redirect('/reporte_empresa/'+a.reporte+'#msjs')
        }
    });
});

router.post('/local', function(req, res, next) {
    console.log();
    var reporte = [],a=req.body;
    reporte[0] = [a.reporte,a.body];
    reporte[1] = [0,a.user];
    if(a.isnota==1){
        reporte[0][2] = '1';
    }else{
        reporte[0][2] = '0';
    }


    comentarioModel.save(reporte,function (err, data) {
        if (!err){
            console.log(data);
            res.redirect('/reporte_local/'+a.reporte+'#msjs')
        }
    });
});

router.get('/', function(req, res, next) {
    console.log(req.body)
    comentarioModel.getAll(function (err, data) {
        if (!err){
            res.status(200).json(data);
        }
    });
});

router.get('/:id', function(req, res, next) {
    console.log(req.body)
    comentarioModel.findByReporte(req.params.id,function (err, data) {
        if (!err){
            res.status(200).json(data);
        }
    });
});


module.exports = router;
