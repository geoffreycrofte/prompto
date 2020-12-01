import EditorJS from 'https://cdn.skypack.dev/@editorjs/editorjs';
import Header from 'https://cdn.skypack.dev/@editorjs/header';
import List from 'https://cdn.skypack.dev/@editorjs/list';

const insertedData = function() {
	let defaultData = { 
		"time": 1550476186479,
		"blocks": [
		  {
			 "type": "header",
			 "data": {
				"text": "Welcome on Prompto",
				"level": 2
			 }
		  },
		  {
			 "type": "paragraph",
			 "data": {
				"text": "Feel free to edit this text and put your own to be able to prompt it and create awesome contents!"
			 }
		  },
		  {
			 "type": "header",
			 "data": {
				"text": "What you can do",
				"level": 3
			 }
		  },
		  {
			 "type": "list",
			 "data": {
				"style": "unordered",
				"items": [
				   "Remove all this text by selecting it and delete it,",
				   "Write you text, re-order, structure,",
				   "Save it, export it (to save it on your computer)",
				   "Change prompter settings and prompt it!"
				]
			 }
		  },
		  {
			 "type": "header",
			 "data": {
				"text": "What makes prompter awesome?",
				"level": 3
			 }
		  },
		  {
			 "type": "paragraph",
			 "data": {
				"text": "Prompter is focused on your work. Write, test, rework, set some customized settings like colors and velocity, and export your work so you won't loose anything. <mark>Try it now, click on <strong>Prompt<\/strong> to start.<\/mark>"
			 }
		  }
	   ],
	   "version": "2.8.1"
	};

	if ( localStorage.getItem('prompter-datas') ) {
		let data = JSON.parse(localStorage.getItem('prompter-datas'));

		if ( data.editorjs ) {
			return data.editorjs;
		}
	}

	return defaultData;
};

const editor = new EditorJS({
  holder: 'editorjs',
	autofocus: true,
	tools: { 
		header: {
			class: Header, 
			inlineToolbar: ["link"],
			config: {
				placeholder: 'Enter a header',
				levels: [2, 3, 4],
				defaultLevel: 2
			}
		}, 
		list: { 
			class: List, 
			inlineToolbar: true 
		}
	},
	data: insertedData()
});

const autoscroll = function(vel) {
	let y = 0;

	clearInterval(ASinter);
	prompteditor.scrollTo(0, 0);

	ASinter = setInterval( function() {
		y = y + 1;
		prompteditor.scrollTo(0, y);
	}, 100 / parseInt(vel) );
};

const getSettings = async function(editorData) {
	
	let settings = {
		"settings" : {
			"bgcolor": inBgcolor.value,
			"txtcolor": inTxtcolor.value,
			"fontsize": inFontsize.value,
			"velocity": inVelocity.value
		},
		"editorjs" : ''
	};

	if ( editorData ) {
		settings.editorjs = editorData;
		return JSON.stringify( settings );
	} else {
		await editor.save().then((outputData) => {
			settings.editorjs = outputData;
			return JSON.stringify( settings );
		});
	}
};

const saveall = function(ed) {
	ed.save().then((outputData) => {

		getSettings(outputData).then(function(outputSettings){
			localStorage.setItem(
				'prompter-datas',
				outputSettings
			);
		});

		_html.setAttribute('style', '--prompt-bgcolor:'+inBgcolor.value+';--prompt-txtcolor:'+inTxtcolor.value+';--prompt-fontsize:'+inFontsize.value+'em;' )

	}).catch((error) => {
	  console.log('Saving failed: ', error)
	});
}

let ASinter;
const _html = document.documentElement;
const inBgcolor = document.getElementById('bgcolor');
const inTxtcolor = document.getElementById('txtcolor');
const inFontsize = document.getElementById('fontsize');
const inVelocity = document.getElementById('velocity');
const prompteditor = document.getElementById('editorjs');
const btnSave = document.getElementById('save');
const btnPrompt = document.getElementById('prompt');
const btnExport = document.getElementById('export');
const FSclass = 'mode-fullscreen';

/**
 * Saving Data
 */
btnSave.addEventListener('click', function() {
	saveall(editor);
});

/**
 * Full Screen / Prompt
 */
btnPrompt.addEventListener('click', function() {
	if ( ! document.fullscreenElement ) {
		
		// Save data before full screen.
		saveall(editor);

		// Request fullscreen.
		_html.requestFullscreen();

		// Countdown
		// TODO
		
		// Auto scroll down.
		let velocity = 6;
		if ( localStorage.getItem('prompter-datas') ) {
			let data = JSON.parse(localStorage.getItem('prompter-datas'));

			velocity = data.settings.velocity ? data.settings.velocity : velocity;
		}

		autoscroll(velocity);
	}
});

document.addEventListener('fullscreenchange', function(ev) {
	if ( _html.classList.contains(FSclass) ) {
		_html.classList.remove(FSclass);
	} else {
		_html.classList.add(FSclass);
	}
});

prompteditor.addEventListener('click', function(){
	clearInterval(ASinter);
});

/**
 * Export
 */

btnExport.addEventListener('click', function(){
	let filename = 'prompto.json';

	getSettings().then( (dataStr) => {
		// WHY THE FUCK IS THIS UNDEFINED??????
		console.log(dataStr);
		if ( dataStr ) {
		//
			let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
			let linkElement = document.createElement('a');
			linkElement.setAttribute('href', dataUri);
			linkElement.setAttribute('download', filename);
			linkElement.click();	
	    }
	});
});