var express = require('express');
var router = express.Router();

var empresa = require('../models/EmpresaModel');
var auth = require('../funciones/authentication');


router.get('/new', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        res.render('new_company',{title: 'Sicty report system',user:req.session.nombre});
    });
});

router.get('/', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        console.log("as");
        empresa.getTodos(function (er,da) {
            if (!er) {
                //Recibe datos del wizard
                res.render('tablareportes', {title: 'Sicty report system', datos: da, user: req.session.nombre});
            }
        });
    });
});

router.post('/', function(req, res, next) {
    empresa.save([req.body.nombre],function (er,da) {
        if(!er){
            res.redirect('/empresas');
        }
    })
});


module.exports = router;