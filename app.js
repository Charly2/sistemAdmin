var express = require('express');
var path = require('path');
var session = require('express-session')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
const fileUpload = require('express-fileupload');
var auth = require('./funciones/authentication');
const util = require('util');


// Controladores
var ReporteLocal = require('./routes/Reporte_Local');
var ReporteEmprsa = require('./routes/Reporte_Empresa');
var categoria = require('./routes/Categorias');
var usuario = require('./routes/Usuarios');
var empresa = require('./routes/Empresas');
var comentario = require('./routes/Comentario');
var empresaModel = require('./models/EmpresaModel');
var categoriaModel = require('./models/CategoriaModel');


var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var expiryDate = new Date( Date.now() + 60 * 60 * 1000 );
var sess = {
    secret: 'AppSycti',
    saveUninitialized: true

    //cookie: { maxAge: 60000 }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session(sess));
app.use(fileUpload());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res, next){
    res.io = io;
    next();
});



app.use('/',routes);
app.use('/reporte_local',ReporteLocal);
app.use('/reporte_empresa',ReporteEmprsa);
app.use('/categoria',categoria);
app.use('/usuario',usuario);
app.use('/empresas',empresa);
app.use('/comentarios',comentario);

/*app.all('*',function (req,res,next) {
    auth.mach(req,res,function (req,res) {
        res.redirect('/app');
    })
});*/

app.get('/levanta-reporte',function (req,res,next) {
        categoriaModel.findEmpresa(function (ere,data) {
        if (!ere) {
            //Recibe datos del wizard
            categoriaModel.getAllExt(function (er,da) {
                if (!er) {
                    res.render('nueva_report', { title: 'Sicty report system',user:req.session.nombre,cat:da,emp:data });
                }
            });


        }
    });
});

app.get('/nuevo',function (req,res,next) {
    categoriaModel.findEmpresa(function (ere,data) {
    if (!ere) {
        //Recibe datos del wizard
        categoriaModel.getAll(function (er,da) {
            if (!er) {
                res.render('nueva_report', { title: 'Sicty report system',user:req.session.nombre,cat:da,emp:data });
            }
        });


    }
});
});



app.get('/file_local/', function(req, res, next) {
    var fileName = __dirname+"\\files\\"+req.query.id;
    console.log(fileName)
    res.download(fileName, function (err) {
        if (err) {
            console.log('No se envio:', fileName);
        } else {
            console.log('Sent:', fileName);
        }
    });
});


app.get('/file_coment/', function(req, res, next) {
    var fileName = __dirname+"\\files_c\\"+req.query.id;
    console.log(fileName)
    res.download(fileName, function (err) {
        if (err) {
            console.log('No se envio:', fileName);
        } else {
            console.log('Sent:', fileName);
        }
    });
});


var id  = 1;

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    id++;
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.sampleFile;

    var aux = sampleFile.mimetype.split('/');
    var name = id+'.'+aux[1];
    var pth = 'files/perfil/'+name;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path.join(__dirname,pth ), function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

app.get('/upload', function(req, res, next) {
    
    // console.log(req.session);
    res.render('file',{user:req.session.nombre});
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    //sess.cookie.secure = true // serve secure cookies
}


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = require('http').Server(app);
var io = require('socket.io')(server);

module.exports = {app: app, server: server};
