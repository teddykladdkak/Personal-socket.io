var config = {
	location: {
		index: 'index.html',
		save: './save.json',
		register: './register.json',
		externalfolder: 'filer/external/'
	},
	port: 6666,
	cmd: {
		infowidth: 60,
		infostart: 'Server är startad!',
		infolink: 'Kan nås via följande länkar:',
		infolocal: 'Lokalt',
		infonetw:'Nätverket',
		infoturnoff: 'Stäng av server med "CTRL+C"'/*,
		versioner: [{
			namn: 'DW',
			beskrivning: 'Whiteboard vyn.',
			lank: '/dw.html'
		},{
			namn: 'DW-TODO',
			beskrivning: 'Applikation som hanterar "Att göra" delen från DW. Visar Uppgifter och Kontroller. Möjlighet att läsa och redigera från DW.',
			lank: '/todo.html'
		},{
			namn: 'DW-Vårdplats',
			beskrivning: 'Sida som visar nuvarande platsläge. Visualiserar med färger beroende på om patient planeras hem, om den planeras hem idag, om den inte har ett planerat hemgångsdatum eller om sängen är tom.',
			lank: '/vardplats.html'
		},{
			namn: 'DW-ADD',
			beskrivning: 'Applikation som skickar patientdata till DW. Formulär som täcker allt förutom Uppgifter, Kontroller och Ikoner i DW. Kan enbart skicka, läser inget.',
			lank: '/add.html'
		},{
			namn: 'DW-Admin',
			beskrivning: 'Sida där det finns möjlighet att lägga till och ta bort användare, även ställa in behörigheter och lösenord.',
			lank: '/admin.html'
		}]*/
	},
	monader: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
	heroma: {
		heromapass: [{
			text: '06:45-15:30',
			kod: 'A1'
		},{
			text: '06:45-16:00',
			kod: 'A2'
		}, {
			text: '08:00-16:30',
			kod: 'A3'
		}, {
			text: '06:45-15:06',
			kod: 'A5'
		}, {
			text: '21:00_',
			kod: 'N'
		}, {
			text: '14:00-21:30',
			kod: 'C'
		}],
		heromaexkludering: ['FL', 'Extern utbildn'],
		felmeddelande: 'Sidan kan tyvärr inte läsa excellfilen, säker på att du valt rätt yrke och rätt excellfil?'
	},
	medinet: {
		medinetpass: [{
			kod: 'AL349',
			text: 'Avdelningsläkare',
			id: 'avdelningslakare'
		}, {
			kod: 'ÖL349',
			text: 'Överläkare',
			id: 'overlakare'
		}, {
			kod: 'BJ',
			text: 'Överläkare',
			id: 'overlakare'
		}, {
			kod: 'DJhelg',
			text: 'Avdelningsläkare',
			id: 'avdelningslakare'
		}],
		rubrik: 'Kolorektal',
		felmeddelande: 'Sidan kan tyvärr inte läsa excellfilen, säker på att du valt rätt yrke och rätt excellfil?'
	},
	passarray: ['formiddag', 'eftermiddag', 'natt'],
	uppgifterarray: [{
			id: 'rond',
			rubrik: 'Rondansvarig',
			farg: 'lightgreen',
			showexcell: true
		},{
			id: 'lakemedel',
			rubrik: 'Läkemedelsansvarig',
			farg: 'yellow',
			showexcell: true
		},{
			id: 'overlakare',
			rubrik: 'Överläkare',
			farg: 'white',
			showexcell: false
		},{
			id: 'avdelningslakare',
			rubrik: 'Avdelningsläkare',
			farg: 'white',
			showexcell: false
		},{
			id: 'resurs',
			rubrik: 'Resurs',
			farg: 'pink',
			showexcell: true
		},{
			id: 'samordnare',
			rubrik: 'Samordnare',
			farg: 'white',
			showexcell: true
		},{
			id: 'vardinna',
			rubrik: 'Värdinna',
			farg: 'white',
			showexcell: true
		},{
			id: 'utb',
			rubrik: 'Utbildning',
			farg: 'red',
			showexcell: true
		}
	],
	passkod: {
		utb: 'U'
	},
	pass: {
		formiddag: {
			timme: '7',
			rubrik: 'Förmiddag',
			kort: 'A',
			elements: [{
				id: 'rond',
				rubrik: 'Rondansvarig',
				titels: ['ssk', 'usk']
			},{
				id: 'lakemedel',
				rubrik: 'Läkemedelsansvarig',
				titels: ['ssk']
			},{
				id: 'overlakare',
				rubrik: 'Överläkare',
				titels: ['lak']
			},{
				id: 'avdelningslakare',
				rubrik: 'Avdelningsläkare',
				titels: ['lak']
			},{
				id: 'resurs',
				rubrik: 'Resurs',
				titels: ['usk']
			},{
				id: 'samordnare',
				rubrik: 'Samordnare',
				titels: ['usk']
			},{
				id: 'vardinna',
				rubrik: 'Värdinna',
				titels: ['usk']
			},{
				id: 'utb',
				rubrik: 'Utbildning',
				titels: ['ssk', 'usk']
			}]
		},
		eftermiddag: {
			timme: '14',
			rubrik: 'Eftermiddag',
			kort: 'C',
			elements: [{
				id: 'rond',
				rubrik: 'Rondansvarig',
				titels: ['ssk', 'usk']
			},{
				id: 'lakemedel',
				rubrik: 'Läkemedelsansvarig',
				titels: ['ssk']
			},{
				id: 'overlakare',
				rubrik: 'Överläkare',
				titels: ['lak']
			},{
				id: 'resurs',
				rubrik: 'Resurs',
				titels: ['usk']
			},{
				id: 'utb',
				rubrik: 'Utbildning',
				titels: ['ssk', 'usk']
			}]
		},
		natt: {
			timme: '21',
			rubrik: 'Natt',
			kort: 'N',
			elements: [{
				id: 'rond',
				rubrik: 'Rondansvarig',
				titels: ['ssk', 'usk']
			},{
				id: 'lakemedel',
				rubrik: 'Läkemedelsansvarig',
				titels: ['ssk']
			},{
				id: 'overlakare',
				rubrik: 'Överläkare',
				titels: ['lak']
			},{
				id: 'resurs',
				rubrik: 'Resurs',
				titels: ['usk']
			}]
		}
	},
	titlar: [{
		show: 'SSK',
		code: 'ssk',
		rubrik: 'Sjuksköterska'
	},{
		show: 'USK',
		code: 'usk',
		rubrik: 'Undersköterska'
	},{
		show: 'LÄK',
		code: 'lak',
		rubrik: 'Läkare'
	}],
	fritext: 'Dagens aktiviteter',
	planerad: 'Antal inkommande patienter imorgon',
	excellsortering: 'yrke', //'yrke' eller 'namn'
	excellfarg: true,
	text: {
		avdelning: '349a',
		andraplatser: 'Andra platser',
		meddelandeinnansamtal: {
			first: 'Vill du ringa telefonnummer: "',
			last: '"?'
		},
		excellfraga: {
			text: 'Hur många dagas ska visas framåt?',
			nummer: '1'
		}
	},
	buttons: [{
		value: '+',
		action: 'addnewline(this)'
	},{
		value: '-',
		action: 'removeline(this)'
	},{
		value: 'x',
		action: 'erase(this)'
	}]
};