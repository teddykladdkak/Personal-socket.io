var tabindex = 1; /*Första värde för tabindex för element*/
function datum(eventuelltdatum){
	if(!eventuelltdatum){
		var d = new Date();
	}else{
		var today = new Date();
		var d = new Date();
			d.setDate(today.getDate() + parseInt(eventuelltdatum));
	};
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	if(day <= 9){var day = '0' + day;};
	if(month <= 9){var month = '0' + month;};
	var datetonumber = year + '-' + month + '-' + day;
	return datetonumber;
};
function nextdate(element){
	var allinput = element.parentElement.getElementsByTagName('input');
	var number = element.getAttribute('data-numberdate');
	allinput[0].setAttribute('data-numberdate', parseInt(number) - 1);
	allinput[1].setAttribute('value', datum(number));
	allinput[2].setAttribute('data-numberdate', parseInt(number) + 1);
	askfordate();
};
function addnamnsdag(data){
	var datewrapper = document.getElementById('date');
		var datewrapperhead = datewrapper.getElementsByTagName('h2')[0];
			var datewrapperheaddag = document.createTextNode(' ' + data.dagar[0].veckodag);
			datewrapperhead.appendChild(datewrapperheaddag);
		var underhead = document.createElement('h3');
			var underheadtext = document.createTextNode('Vecka: ' + data.dagar[0].vecka + '. Dagens namnsdag: ' + data.dagar[0].namnsdag.join(', ') + '.');
			underhead.appendChild(underheadtext);
		datewrapper.appendChild(underhead);
};
function passtyp(demo){
	var d = new Date();
	var n = d.getHours();
	if(!demo){}else if(demo == ''){}else{var n = parseInt(demo);};
	if(n == 0){return 'natt';}else if(n >= config.pass.natt.timme){return 'natt';}else if(n >= config.pass.eftermiddag.timme){return 'eftermiddag';}else if(n >= config.pass.formiddag.timme){return 'formiddag';}else{return 'natt';};
};
function watchtext(before, text, after){
	if(text == ''){
		return '';
	}else{
		if(before == ''){
			var beforesend = '';
		}else{
			var beforesend = before;
		};
		if(after == ''){
			var after = '';
		}else{
			var after = before;
		};
		return before + text + after;
	};
};
function demo(){
	var tid = prompt("Skriv en timme för att ändra", "0");
	if (tid != null) {
		//load(tid);
		var param = {datum: datum(), tid: passtyp(tid), return: 'harfardudata'};
		socket.emit('getdatafromdate', param);
	};
};
function adddatalist(){
	var body = document.getElementsByTagName('body')[0];
	for (var i = 0; i < config.titlar.length; i++){
		var allpersons = configpersonal[config.titlar[i].code];
		var datalist = document.createElement('datalist');
			datalist.setAttribute('id', config.titlar[i].code);
		for (var a = 0; a < allpersons.length -1; a++){
			var option = document.createElement('option');
				option.setAttribute('value', allpersons[a].namn);
			datalist.appendChild(option);
		};
		body.appendChild(datalist);
	};
};
function andratitel(element){
	var allinput = element.parentElement.getElementsByTagName('input');
	for (var i = 0; i < allinput.length; i++){
		if(allinput[i].getAttribute('type') == 'text'){
			allinput[i].setAttribute('list', element.value);
		};
	};
};
function addnewline(element){
	element.parentElement.parentElement.appendChild(addpersonline());
};
function erase(element){
	var allinput = element.parentElement.getElementsByTagName('input');
	for (var i = 0; i < allinput.length; i++){
		if(allinput[i].getAttribute('type') == 'text'){
			allinput[i].value = '';
		};
	};
	somethingchanged();
};
function removeline(element){
	if(element.parentElement.parentElement.getElementsByTagName('div').length == 1){
		erase(element);
	}else{
		element.parentElement.parentElement.removeChild(element.parentElement);
	};
	somethingchanged();
}
function addpersonline(title, tid, id){
	if(!title){
		var title = 'ssk';
	}
	var span = document.createElement('div');
		if(!tid && !id){}else{
			span.setAttribute('class', tid + '-' + id);
		};
		var titlar = document.createElement('select');
			titlar.setAttribute('onchange', 'andratitel(this);');
			titlar.setAttribute('tabindex', tabindex++);
			titlar.setAttribute('class', 'titel');
			titlar.setAttribute('onchange', 'somethingchanged();');
		for (var i = 0; i < config.titlar.length; i++){
			var titlaroption = document.createElement('option');
				titlaroption.setAttribute('value', config.titlar[i].code);
				if(title == config.titlar[i].code){
					titlaroption.setAttribute('selected', 'selected');
				};
				var titlaroptiontext = document.createTextNode(config.titlar[i].show);
				titlaroption.appendChild(titlaroptiontext);
			titlar.appendChild(titlaroption);
		};
		span.appendChild(titlar);
		var textfield = document.createElement('input');
			textfield.setAttribute('type', 'text');
			textfield.setAttribute('list', title);
			textfield.setAttribute('placeholder', 'Namn');
			textfield.setAttribute('ondrop', 'dropIt(event, this);');
			textfield.setAttribute('ondragover', 'event.preventDefault();');
			textfield.setAttribute('tabindex', tabindex++);
			textfield.setAttribute('class', 'personname');
			textfield.setAttribute('onchange', 'somethingchanged();');
		span.appendChild(textfield);
		for (var i = 0; i < config.buttons.length; i++){
			var plusbutton = document.createElement('input');
				plusbutton.setAttribute('type', 'button');
				plusbutton.setAttribute('value', config.buttons[i].value);
				plusbutton.setAttribute('onclick', config.buttons[i].action);
			span.appendChild(plusbutton);
		};
	return span;
};
function dropIt(e, element){
	//element.value = e.dataTransfer.getData("Namn");
	element.value = window['dragnamn'];
	for (var c = config.titlar.length - 1; c >= 0; c--) {
		/*if(config.titlar[c].show == e.dataTransfer.getData("Titel")){
			element.parentElement.getElementsByClassName('titel')[0].value = config.titlar[c].code;
		};*/
		if(config.titlar[c].show == window['dragtitel']){
			element.parentElement.getElementsByClassName('titel')[0].value = config.titlar[c].code;
		};
	};
	window['dragnamn'] = '';
	window['dragtitel'] = '';
	somethingchanged();
};
var dragnamn = '';
var dragtitel = '';
function dragIt(e, element, namn, titel){
	//e.dataTransfer.setData("Namn", namn);
	//e.dataTransfer.setData("Titel", titel);
	window['dragnamn'] = namn;
	window['dragtitel'] = titel;
};
function randomname(){
	var demonamn = ['Hayden Melia', 'Magaly Kniffen', 'Cari Ortman','Leola Chagnon','Nena Gottlieb','Rufus Brinson','Renetta Eads','Yevette Prudhomme','Cristobal Wheelock','Selma Neace','Antonette Duffey','Dahlia Pierson','Lanie Ahearn','Torie Mulhern','Wilfredo Janes','Refugia Wilton','Jamal Weldy','Willodean Loughran','Donnell Whistler','Mika Gershon','Joycelyn Milano','Willette Neve','Willia Bigby','Justine Nino','Dessie Piermarini','Simona Stearns','Paige Spier','Leeanna Willey','Aimee Knebel','Laila Perry','Tod Blunk','Carmela Hagopian','Benita Mcmasters','Germaine Coplan','Maureen Bard','Latrisha Pollak','Pam Silveira','Lahoma Clack','Melania Buban','Ilse Mcmeans','Marx Finnen','Margareta Mortenson','Yen Croxton','Moira Chisholm','Neida Mendelsohn','Jason Pellegren','Fumiko Griner','Melina Roseboro','Tobias Digiovanni','Dede Kluesner'];
	return demonamn[Math.floor(Math.random() * demonamn.length)]
};