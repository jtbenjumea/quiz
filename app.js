var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
var config = require('./.env');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionTimeOut);   // Middleware para controlar time out usuario logueados

// Helpers dinámicos
app.use(function(req, res, next) {
	// guardar path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}
	
	// hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

// Time Out usuarios logueados
function sessionTimeOut(req, res, next) {
	// Comprobamos que el usuario está logueado
	if (req.session.user) {
		var now = (new Date()).getTime(); 

		// Comprobamos que no haya estado 2 minutos sin hacer nada
		if (req.session.user.lastime) {
			var lastdate = req.session.user.lastime; 
			var twoMinutesLater = new Date(req.session.user.lastime + (2 * 60 * 1000));
					
			if (twoMinutesLater < now) {
				delete req.session.user;				
			} 
		} 
	}
	// Si el usuario sigue estando logueado registramos último acceso
	if 	(req.session.user) {
		req.session.user.lastime = now;
	}
	next();
};

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, 
			errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, 
		errors: []
    });
});


module.exports = app;
