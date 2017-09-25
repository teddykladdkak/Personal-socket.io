var http = require('http');
var fs = require('fs');
var path = require('path');
// Laddar config info
eval(fs.readFileSync('public/config.js')+'');
//Laddar personal
eval(fs.readFileSync('public/personal.js')+'');
//console.log(config);
eval(fs.readFileSync('pw.js')+'');
//console.log(pw);

var auth = require('basic-auth');

//Startar server och tillåtna filer
var server = http.createServer(function (request, response) {
	var filePath = '.' + request.url;
	if (filePath == './') {
		filePath = config.location.index;
	};
	//Här radas alla tillåtna filer
	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.json':
			contentType = 'application/json';
			break;
		case '.png':
			contentType = 'image/png';
			break;	  
		case '.jpg':
			contentType = 'image/jpg';
			break;
		case '.ico':
			contentType = 'image/x-icon';
			break;
		case '.wav':
			contentType = 'audio/wav';
			break;
	}
	if(filePath == config.location.index){
		console.log('Sida laddas i alla fall.');
		loadpage(filePath, extname, response, contentType);
	}else if(contentType == 'text/html'){
		var credentials = auth(request);
		if (!credentials || credentials.name !== inlogg.namn || credentials.pass !== inlogg.pw) {
			response.statusCode = 401
			response.setHeader('WWW-Authenticate', 'Basic realm="example"')
			response.end('Access denied')
		} else {
			loadpage(filePath, extname, response, contentType);
		};
	}else{
		loadpage(filePath, extname, response, contentType);
	};
});

function loadpage(filePath, extname, response, contentType){
	//Säger till server att läsa och skicka fil till klient (Möjlighet att lägga till felmeddelanden)
	fs.readFile('./public/' + filePath, function(error, content) {
		if (error) {
			if(error.code == 'ENOENT'){
				fs.readFile('./404.html', function(error, content) {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				});
			}
			else {
				response.writeHead(500);
				response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
				response.end(); 
			}
		}
		else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});
};

// Loading socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket, username) {
	// When the client connects, they are sent a message
	socket.emit('message', 'You are connected!');
	//Frågar om användaren vill ta mot data
	socket.emit('villduhadata', 'test');
	// The other clients are told that someone new has arrived
	socket.broadcast.emit('message', 'Another client has just connected!');
	socket.on('getdatafromdate', function (date) {
		//Försöker läsa textfil med data för aktuellt datum.
		fs.readFile('register/' + date.datum + '.json', (err, data) => {
			//Om textfil inte existerar
			if (err){
				console.log(date.datum + '.json finns inte, skapar ny fil.');
				var texttowrite = JSON.parse(makenewsavefile());
				//fs.writeFileSync('register/' + datum + '.json', JSON.stringify(texttowrite, null, ' '));
				fs.writeFile('register/' + date.datum + '.json', JSON.stringify(texttowrite, null, ' '), (err) => {
					if (err){
						console.log('Något gick fel i skapandet av ny fil.')
					}else{
						console.log(date.datum + '.json skapad.');
						var datatosend = texttowrite;
						senddatatoclient(datatosend, date.tid, date.datum, date.return);
						/*var tosend = {datum: date.datum, pass: date.tid, personal: datatosend[date.tid], dagensaktivitet: datatosend.dagensaktivitet, antalopimorgon: datatosend.antalopimorgon};
						socket.emit(date.return, tosend);*/
					};
				});
			}else{
				var datatosend = JSON.parse(data);
				senddatatoclient(datatosend, date.tid, date.datum, date.return);
				/*if(date.tid == 'allt'){
					datatosend.datum = date.datum;
					var tosend = datatosend;
				}else{
					var tosend = {datum: date.datum, pass: date.tid, personal: datatosend[date.tid], dagensaktivitet: datatosend.dagensaktivitet, antalopimorgon: datatosend.antalopimorgon};
				};
				socket.emit(date.return, tosend);*/
			};
		});
		
	});
	function senddatatoclient(datatosend, tid, datum, funktion){
		//var datatosend = JSON.parse(data);
		if(tid == 'allt'){
			datatosend.datum = datum;
			var tosend = datatosend;
		}else{
			var tosend = {datum: datum, pass: tid, personal: datatosend[tid], dagensaktivitet: datatosend.dagensaktivitet, antalopimorgon: datatosend.antalopimorgon};
		};
		socket.emit(funktion, tosend);
	};
	socket.on('nyinfo', function (message) {
		//console.log(message.datum);
		//console.log(message.data.formiddag.rond[0].namn);
		//Uppdaterar register.json med uppdaterade listan av användare
		fs.writeFileSync('register/' + message.datum + '.json', JSON.stringify(message.data, null, ' '));
		socket.broadcast.emit('ardatumaktuell', message.datum);
	});

	socket.on('nyinfooneuser', function (message) {
		var allayrken = configpersonal[message.titel];
		for (var a = allayrken.length - 1; a >= 0; a--) {
			if(allayrken[a].namn == message.namn){
				var personinfotelefon = allayrken[a].telefon;
			};
		};
		console.log(message.titel);
		console.log(personinfotelefon);
		if(!personinfotelefon){
			console.log('Person hittades inte!');
			var personinfotelefon = '';
		};
		var personinfo = {"titel": message.titel, "namn": message.namn, "telefon": personinfotelefon};
		fs.readFile('register/' + message.datelong + '.json', (err, data) => {
			//Om textfil inte existerar
			if (err){
				console.log('Något gick fel pga json fil finns inte att ändra!');
			}else{
				var oldtext = JSON.parse(data);
				//Ta bort alla pass från person
				for (var i = config.passarray.length - 1; i >= 0; i--) {
					var aktuelltpass = config.passarray[i];
					for (var a = config.uppgifterarray.length - 1; a >= 0; a--) {
						var aktuelluppgift = config.uppgifterarray[a].id;
						var allpersons = oldtext[aktuelltpass][aktuelluppgift];
						if(!allpersons){}else{
							for (var b = allpersons.length - 1; b >= 0; b--) {
								if(allpersons[b].namn == message.namn){
									allpersons.splice(b,1);
									console.log('Användare tas bort');
								};
							};
						};
					};
				};
				var uppdelatpass = message.nypass.split('+');
				if(message.nypass == ''){}else{
					for (var i = uppdelatpass.length - 1; i >= 0; i--) {
						for (var a = config.passarray.length - 1; a >= 0; a--) {
							if(config.pass[config.passarray[a]].kort == uppdelatpass[i]){
								var standardtelefon = configpersonal.standardtelefoner[message.nyuppgift];
								if(!standardtelefon){}else{
									personinfo.telefon = standardtelefon;
								}
								oldtext[config.passarray[a]][message.nyuppgift].push(personinfo);
							};
						};
					};
				};

				//Uppdaterar fil
				fs.writeFile('register/' + message.datelong + '.json', JSON.stringify(oldtext, null, ' '), (err) => {
					if (err){
						console.log('Något gick fel i ändring av json fil.')
						socket.emit('message', 'Något gick fel i ändring av json fil. (' + err + ')');
					}else{
						socket.emit('hidemenu', 'true');
						socket.emit('ardatumaktuell', message.datelong);
						socket.broadcast.emit('ardatumaktuell', message.datelong);
					};
				});
			};
		});
	});
	function makenewsavefile(){
		var passtosave = [];
		for (var i = config.passarray.length - 1; i >= 0; i--) {
			var elementsarray = [];
			for (var a = config.pass[config.passarray[i]].elements.length - 1; a >= 0; a--) {
				var id = config.pass[config.passarray[i]].elements[a].id;
				elementsarray.push('"' + id + '": []');
			};
			passtosave.push('"' + config.passarray[i] + '": {' + elementsarray.join(', ') + '}');
		};
		return '{' + passtosave.join(', ') + ', "dagensaktivitet": "", "antalopimorgon": "0", "osorterade": []}';
	};
	socket.on('skickamedinet', function (message) {
		for (var i = message.datum.length - 1; i >= 0; i--) {
			var allasomjobbar = message.data[message.datum[i]];
			writelakare(message.datum[i], allasomjobbar)
		};
		socket.emit('done', 'Fixat');
	});
	function writelakare(datum, array){
		fs.readFile('register/' + datum + '.json', (err, data) => {
			if (err){
				var texttowrite = JSON.parse(makenewsavefile());
			}else{
				var texttowrite = JSON.parse(data);
			};
			var arraytosave = [];
			for (var i = array.length - 1; i >= 0; i--) {
				texttowrite.formiddag[array[i].uppgift].push({"titel": "lak", "namn": array[i].namn, "telefon": ""});
			};
			socket.emit('message', datum);
			socket.emit('message', texttowrite);
			//Uppdaterar fil
			fs.writeFile('register/' + datum + '.json', JSON.stringify(texttowrite, null, ' '), (err) => {
				if (err){
					console.log('Något gick fel i ändring av json fil.')
					socket.emit('message', 'Något gick fel i ändring av json fil. (' + err + ')');
				}else{
					socket.broadcast.emit('ardatumaktuell', datum);
				};
			});
		});
	};
	socket.on('skickaheroma', function (message) {
		for (var i = message.datum.length - 1; i >= 0; i--) {
			var allasomjobbar = message.data[message.datum[i]];
			writeheroma(message.datum[i], allasomjobbar)
		};
		socket.emit('done', 'Fixat');
	});
	function writeheroma(datum, array){
		fs.readFile('register/' + datum + '.json', (err, data) => {
			if (err){
				var texttowrite = JSON.parse(makenewsavefile());
			}else{
				var texttowrite = JSON.parse(data);
			};
			texttowrite.osorterade = array;
			//Uppdaterar fil
			fs.writeFile('register/' + datum + '.json', JSON.stringify(texttowrite, null, ' '), (err) => {
				if (err){
					console.log('Något gick fel i ändring av json fil.')
					socket.emit('message', 'Något gick fel i ändring av json fil. (' + err + ')');
				}else{
					socket.broadcast.emit('ardatumaktuell', datum);
				};
			});
		});
	};
	function findphone(uppgift, titel, namn){
		console.log(uppgift);
		console.log(configpersonal.standardtelefoner[uppgift])
		if(!configpersonal.standardtelefoner[uppgift]){
			for (var i = configpersonal[titel].length - 1; i >= 0; i--) {
				if(configpersonal[titel][i].namn == namn){
					return configpersonal[titel][i].telefon;
				};
			};
		}else{
			return configpersonal.standardtelefoner[uppgift];
		};
		return '';
	};
	socket.on('excellnyuser', function (message) {
		/*var allayrken = configpersonal[message.titel];
		for (var a = allayrken.length - 1; a >= 0; a--) {
			if(allayrken[a].namn == message.namn){
				var personinfotelefon = allayrken[a].telefon;
			};
		};
		console.log(message.titel);
		console.log(personinfotelefon);
		if(!personinfotelefon){
			console.log('Person hittades inte!');
			var personinfotelefon = '';
		};
		var personinfo = {"titel": message.titel, "namn": message.namn, "telefon": personinfotelefon};*/
		var stop = false;
		var oldarray = message.old;
		var nyttarray = message.nytt;
		var titel = message.titel;
		var datum = message.datum;
		var namn = message.namn;
		socket.emit('message', oldarray);
		fs.readFile('register/' + datum + '.json', (err, data) => {
			if (err){
				var texttowrite = JSON.parse(makenewsavefile());
			}else{
				var texttowrite = JSON.parse(data);
				for (var i = oldarray.length - 1; i >= 0; i--) {
					for (var a = config.passarray.length - 1; a >= 0; a--) {
						if(config.pass[config.passarray[a]].kort == oldarray[i].pass){
							var passattandra = config.passarray[a];
							var allpersons = texttowrite[passattandra][oldarray[i].uppgift];
							for (var b = allpersons.length - 1; b >= 0; b--) {
								console.log(namn);
								console.log(titel);
								console.log(passattandra);
								console.log(oldarray[i].uppgift);
								if(allpersons[b].namn == namn && allpersons[b].titel == titel){
									console.log('Tar bort ' + namn + ' (' + titel + ')');
									texttowrite[passattandra][oldarray[i].uppgift].splice(b,1);
								}else{
									//console.log(allpersons[b].namn + ' ' + allpersons[b].titel);
								};
							};
						}else{
							//console.log(oldarray[i].pass);
						};
					};
					//oldarray[i].uppgift
					//oldarray[i].pass
				};
			};
			for (var i = nyttarray.length - 1; i >= 0; i--) {
				for (var a = config.passarray.length - 1; a >= 0; a--) {
					if(config.pass[config.passarray[a]].kort == nyttarray[i].pass){
						var passattandra = config.passarray[a];
						var telefon = findphone(nyttarray[i].uppgift, titel, namn);
						var texttoinsert = {"titel": titel, "namn": namn, "telefon": telefon};
						socket.emit('message', 'Tillagd telefon: ' + telefon);
						if(!texttowrite[passattandra][nyttarray[i].uppgift]){
							socket.emit('message', nyttarray[i].uppgift + ' finns inte på passet "' + passattandra + '", därför läggs den inte till i sparfilen..');
							var stop = true;
						}else{
							texttowrite[passattandra][nyttarray[i].uppgift].push(texttoinsert);
						};
					};
				};
			};

			//Fortsätt här med att lägga till nya passen! :)
			//Skapa funktion som letar efter telefon.

			socket.emit('message', texttowrite);
			if(!stop){
				fs.writeFile('register/' + datum + '.json', JSON.stringify(texttowrite, null, ' '), (err) => {
					if (err){
						console.log('Något gick fel i ändring av json fil.')
						socket.emit('message', 'Något gick fel i ändring av json fil. (' + err + ')');
					}else{
						socket.emit('ardatumaktuell', datum);
						socket.broadcast.emit('ardatumaktuell', datum);
					};
				});
			};
			/*var arraytosave = [];
			for (var i = array.length - 1; i >= 0; i--) {
				texttowrite.formiddag[array[i].uppgift].push({"titel": "lak", "namn": array[i].namn, "telefon": ""});
			};
			socket.emit('message', datum);
			socket.emit('message', texttowrite);
			//Uppdaterar fil
			fs.writeFile('register/' + datum + '.json', JSON.stringify(texttowrite, null, ' '), (err) => {
				if (err){
					console.log('Något gick fel i ändring av json fil.')
					socket.emit('message', 'Något gick fel i ändring av json fil. (' + err + ')');
				}else{
					socket.broadcast.emit('ardatumaktuell', datum);
				};
			});*/
		});

		/*fs.readFile('register/' + message.datelong + '.json', (err, data) => {
			//Om textfil inte existerar
			if (err){
				console.log('Något gick fel pga json fil finns inte att ändra!');
			}else{
				var oldtext = JSON.parse(data);
				//Ta bort alla pass från person
				for (var i = config.passarray.length - 1; i >= 0; i--) {
					var aktuelltpass = config.passarray[i];
					for (var a = config.uppgifterarray.length - 1; a >= 0; a--) {
						var aktuelluppgift = config.uppgifterarray[a].id;
						var allpersons = oldtext[aktuelltpass][aktuelluppgift];
						if(!allpersons){}else{
							for (var b = allpersons.length - 1; b >= 0; b--) {
								if(allpersons[b].namn == message.namn){
									allpersons.splice(b,1);
									console.log('Användare tas bort');
								};
							};
						};
					};
				};
				var uppdelatpass = message.nypass.split('+');
				if(message.nypass == ''){}else{
					for (var i = uppdelatpass.length - 1; i >= 0; i--) {
						for (var a = config.passarray.length - 1; a >= 0; a--) {
							if(config.pass[config.passarray[a]].kort == uppdelatpass[i]){
								var standardtelefon = configpersonal.standardtelefoner[message.nyuppgift];
								if(!standardtelefon){}else{
									personinfo.telefon = standardtelefon;
								}
								oldtext[config.passarray[a]][message.nyuppgift].push(personinfo);
							};
						};
					};
				};

				//Uppdaterar fil
				fs.writeFile('register/' + message.datelong + '.json', JSON.stringify(oldtext, null, ' '), (err) => {
					if (err){
						console.log('Något gick fel i ändring av json fil.')
						socket.emit('message', 'Något gick fel i ändring av json fil. (' + err + ')');
					}else{
						socket.emit('hidemenu', 'true');
						socket.emit('ardatumaktuell', message.datelong);
						socket.broadcast.emit('ardatumaktuell', message.datelong);
					};
				});
			};
		});*/
	});
/*
	socket.on('reg', function (message) {
		//id: utnamn, smiley: smileynummer, komment: kommentar, portionprocent: (parseInt(portion) / 4)
		console.log(message.datum);
		console.log(message.id);
		console.log(message.smiley);
		console.log(message.komment);
		console.log(message.portionprocent);

		var datatosend = {datum: message.datum, smiley: message.smiley, komment: message.komment};
		var datatospara = {rating: message.smiley, kommentar: message.komment};
		fs.readFile('historik/' + message.datum + '.json', (err, data) => {
			//Om textfil inte existerar
			if (err){
				console.log('Sparfil finns inte sedan innan. Det gör dock inget. Skapar en ny!');
				var tidigaredata = [];
			}else{
				//Data finns att hantera
				var tidigaredata = JSON.parse(data).data;
			};
			tidigaredata.push(datatospara);
			//Skapar och skriver oavsett till sparfil
			var jsonobj = {"data": tidigaredata};
			//Uppdaterar register.json med uppdaterade listan av användare
			fs.writeFileSync('historik/' + message.datum + '.json', JSON.stringify(jsonobj, null, ' '));
		});
		socket.broadcast.emit('skickareg', datatosend);
	});
	*/
});
//Kollar IP adress för server.
function getIPAddress() {
	var interfaces = require('os').networkInterfaces();
	for (var devName in interfaces) {
		var iface = interfaces[devName];
		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
			return alias.address;
		};
	};
	return '0.0.0.0';
};
var ip = getIPAddress();
console.log(config.cmd.infolocal + ': http://localhost:' + config.port);
console.log(config.cmd.infonetw + ': http://' + ip + ':' + config.port);
server.listen(config.port);