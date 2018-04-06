

/**
 * Created by Charly on 10/03/2017.
 */
var express = require('express');
var router = express.Router();
var auth = require('../funciones/authentication');
var usuario = require('../models/UserModel');
var categoria = require('../models/CategoriaModel');
var reporteLcal = require('../models/Reportes_LocalModel');
var reporteEmpresa = require('../models/Reporte_EmpresaModel');
var comentarioModel = require('../models/Comentario');
var Notas = require('../models/NotaModel');
var Archivos = require('../models/Archivo_Mensaje');
var fs = require('file-system');
var now = new Date();
/* GET home page. */





router.get('/', function(req, res, next) {

  auth.loginMach(req,res,function () {
    res.render('login');
  });

});

router.post('/login', function(req, res, next) {

  auth.loginMach(req,res,function () {
    usuario.login([req.body.username, req.body.pass],function (err, data,login) {
      if (!err){
        if(login){
          req.session.nombre = data[0];
          res.redirect('/app')
        }
        else {
          res.render('login',{user:req.body.username, pass : req.body.pass });
        }
      }
    });
  });

});



router.get('/app', function(req, res, next) {
  auth.mach(req,res,
      function (req,res) {
        res.render('blank', { title: 'Sicty report system',user:req.session.nombre });
      }
  );

});


router.get('/auth', function (req,res,next) {
  auth.mach(req,res,
      function (req,res) {
        res.render('demo', { title: 'Sicty report system',user:req.session.nombre });
      }
  );

});

router.get('/mensajeria', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        reporteLcal.getAll(function (err, data) {
            if (!err){
                //Recibe datos del wizard
                res.render('mensajeria',{title: 'Sicty report system',datos:data,user:req.session.nombre});
            }
        });
    });
});
router.get('/recibo', function(req, res, next){
    auth.mach(req, res, function(err, data){
        res.render('recibo',{title: 'Sicty report system',datos:data,user:req.session.nombre});
    })
});




router.get('/report-submit', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        reporteLcal.getAll(function (err, data) {
            if (!err){
                //Recibe datos del wizard
                res.render('new_report',{title: 'Sicty report system',datos:data,user:req.session.nombre});
            }
        });
    });
});

router.get('/new-company', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        reporteLcal.getAll(function (err, data) {
            if (!err){
                //Recibe datos del wizard
                res.render('new_company',{title: 'Sicty report system',datos:data,user:req.session.nombre});
            }
        });
    });
});



router.get('/client-list', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        reporteLcal.getAll(function (err, data) {
            if (!err){
                //Recibe datos del wizard
                res.render('client_list',{title: 'Sicty report system',datos:data,user:req.session.nombre});
            }
        });
    });
});

router.get('/new-user', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        reporteLcal.getAll(function (err, data) {
            if (!err){
                //Recibe datos del wizard
                res.render('new_user',{title: 'Sicty report system',datos:data,user:req.session.nombre});
            }
        });
    });
});

router.get('/user-admin', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        reporteLcal.getAll(function (err, data) {
            if (!err){
                //Recibe datos del wizard
                res.render('user_admin',{title: 'Sicty report system',datos:data,user:req.session.nombre});
            }
        });
    });
});



router.get('/new-report', function(req, res, next) {
  auth.mach(req,res,
      function (req,res) {
          res.render('select_new', { title: 'Sicty report system',user:req.session.nombre});

      }
  );
  //console.log(req.session.nombre)
  //res.render('new_report', { title: 'Sicty report system',user:req.session.nombre });
});

router.get('/report-local-list', function(req, res, next) {
  auth.mach(req,res,function (req,res) {
    reporteLcal.getAll(function (err, data) {
      if (!err){
        res.render('report_history',{title: 'Sicty report system',datos:data,user:req.session.nombre});
      }
    });
  });
});

router.get('/report-empresarial-list', function(req, res, next) {
    auth.mach(req,res,function (req,res) {
        reporteEmpresa.getAll(function (err, data) {
            if (!err){
                res.render('report_history_e',{title: 'Sicty report system',datos:data,user:req.session.nombre});
                //res.status(200).json(data);
            }
        });
    });
});



router.get('/report', function(req, res, next) {
  auth.mach(req,res,
      function (req,res) {
        res.render('report', { title: 'Sicty report system',user:req.session.nombre });
      }
  );
});


router.post('/login', function(req, res, next) {
  console.log(req.body)
  usuario.login([req.body.username, req.body.pass],function (err, data,login) {
    if (!err){
      if(login){
        req.session.nombre = data[0];
        res.redirect('/app')
      }
      else {
        res.render('login',{user:req.body.username, pass : req.body.pass });
      }
    }
  });
});


router.get('/logout', function(req, res, next) {
  console.log(req.body.nombre)
  req.session.destroy(function (e) {
    res.redirect('/')
  });

});




router.get('/user/:id', function(req, res, next) {
  //console.log(req.body)
  usuario.findById(req.params.id,function (err, data) {
    if (!err){
      res.status(200).json(data);
    }
  });
});










router.get('/reportes/', function(req, res, next) {
  console.log(req.session.nombre)
  reporteLcal.getAll(function (err, data) {
    if (!err){
      res.render('tablareportes',{datos:data,user:req.session.nombre});
    }
  });
});










/*
router.post('/comentario', function(req, res, next) {
    console.log("das");
  var reporte = [],a=req.body;
  reporte[0] = [a.reporte,dateFormat(now, "yyyy-mm-dd"),a.body];
  reporte[1] = [0,a.user];
    comentarioModel.save(reporte,function (err, data) {
        if (!err){
            console.log(data);
            res.status(200).json(data);
        }
    });
});

router.get('/comentariocomentario/', function(req, res, next) {
  //console.log(req.body)
  comentarioModel.getAll(function (err, data) {
    if (!err){
      res.status(200).json(data);
    }
  });
});

router.get('/comentario/:id', function(req, res, next) {
  console.log(req.body)
  comentarioModel.findByReporte(req.params.id,function (err, data) {
    if (!err){
      res.status(200).json(data);
    }
  });
});
*/


router.post('/notas', function(req, res, next) {
  var reporte = [],a=req.body;
  reporte[0] = [a.reporte,a.fecha,a.body];
  reporte[1] = [0,a.user];
  Notas.save(reporte,function (err, data) {
    if (!err){
      console.log(data)
      res.status(200).json(data);
    }
  });
});

router.get('/notas/', function(req, res, next) {
  //console.log(req.body)
  Notas.getAll(function (err, data) {
    if (!err){
      res.status(200).json(data);
    }
  });
});

router.get('/notas/:id', function(req, res, next) {
  //console.log(req.body)
  Notas.findByReporte(req.params.id,function (err, data) {
    if (!err){
      res.status(200).json(data);
    }
  });
});

router.post('/archivo', function(req, res, next) {
  var a=req.body,reporte = [a.file,a.reporte];
  Archivos.save(reporte,function (err, data) {
    if (!err){
      console.log(data)
      res.status(200).json(data);
    }
  });
});

router.get('/archivo/', function(req, res, next) {
  //console.log(req.body)
  Archivos.getAll(function (err, data) {
    if (!err){
      res.status(200).json(data);
    }
  });
});

router.get('/archivo/:id', function(req, res, next) {
  //console.log(req.body)
  Archivos.findByReporte(req.params.id,function (err, data) {
    if (!err){
      res.status(200).json(data);
    }
  });
});






module.exports = router;