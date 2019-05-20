var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : ' ',
	database : 'nodeteste'
});


var app = express();


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());



app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});



app.post('/auth', function(request, response) {
	var useremail = request.body.useremail;
	var password = request.body.password;
	if (useremail && password) {
		connection.query('SELECT * FROM login WHERE useremail = ? AND password = ?', [useremail, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.useremail = useremail;
				request.session.password = password;
				response.redirect('/home');
			} else {
				response.send('Email incorreto e/ou Senha !');
			}			
			response.end();
		});
	} else {
		response.send('Por favor digite E-mail e Senha!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Bem vindo, ' + request.session.useremail + '!');
	} else {
		response.send('Por favor faça o login para visualizar esta página!');
	}
	response.end();
});


app.listen(3000);
