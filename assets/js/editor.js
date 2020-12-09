import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

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
				"text": "What makes Prompto awesome?",
				"level": 3
			 }
		  },
		  {
			 "type": "paragraph",
			 "data": {
				"text": "Prompter is focused on your work. Write, test, rework, set some customized settings like colors and velocity, and export your work so you won't loose anything. <mark>Try it now, click on <strong>Prompt<\/strong> to start.<\/mark>"
			 }
		  },
		  {
			 "type": "header",
			 "data": {
				"text": "Prompto is free",
				"level": 3
			 }
		  },
		  {
			 "type": "paragraph",
			 "data": {
				"text": "But you can always give a bit of money if you use it to make money on your own. Usually, this kind of App cost between $40 and $80. <mark>Even $5 will encourage me<\/mark> to give more of my time to develop this kind of free tools. (Donation link in the sidebar)"
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

const initCoundown = function(counter, speed, autoscroll) {
	let i = 0;
	let counting = setInterval( function() {
		i++;
		if ( typeof autoscroll === 'function' && i === parseInt( counter ) ) {
			clearInterval( counting );
			counting = null; // Old trick for IE, don't know if still needed.

			autoscroll(speed);
		}
	}, 1000 );
}

const getSettings = async function(editorData) {

	let settings = {
		"settings" : {
			"bgcolor": inBgcolor.value,
			"txtcolor": inTxtcolor.value,
			"fontsize": inFontsize.value,
			"velocity": inVelocity.value,
			"delay": inDelay.value,
			"mirrorx": inMirrorX.checked,
			"mirrory": inMirrorY.checked
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

		let mirror = 'none';

		if ( inMirrorX.checked ) {
			mirror = 'rotateX(-180deg)';
		}

		if ( inMirrorY.checked ) {
			mirror = mirror === 'none' ? 'rotateY(-180deg)' : mirror + ' rotateY(-180deg)';
		}

		_html.setAttribute('style', '--prompt-bgcolor:'+inBgcolor.value+';--prompt-txtcolor:'+inTxtcolor.value+';--prompt-fontsize:'+inFontsize.value+'em;--prompt-mirror:'+mirror )

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
const inDelay = document.getElementById('delay');
const inMirrorX = document.getElementById('mirror-x');
const inMirrorY = document.getElementById('mirror-y');
const prompteditor = document.getElementById('editorjs');
const btnSave = document.getElementById('save');
const btnPrompt = document.getElementById('prompt');
const btnExport = document.getElementById('export');
const btnImport = document.getElementById('import');
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

		let velocity = inVelocity.value ? inVelocity.value : velocity;
		let counter = inDelay.value ? inDelay.value : 0;

		// Request fullscreen.
		_html.requestFullscreen();

		// Countdown
		initCoundown(
			counter,
			velocity,
			autoscroll // Fallback function.
		);
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

	if ( localStorage.getItem('prompter-datas') ) {
		let dataStr = localStorage.getItem('prompter-datas');
		if ( dataStr ) {
			let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
			let linkElement = document.createElement('a');
			linkElement.setAttribute('href', dataUri);
			linkElement.setAttribute('download', filename);
			linkElement.click();	
		}
	}
});

/**
 * Import
 */
btnImport.addEventListener('click', function(){
	let linkElement = document.createElement('input');
		linkElement.type = 'file';
		linkElement.name = 'importFile';
		linkElement.accept = 'application/json';

		linkElement.click();

		linkElement.addEventListener('change', function(e){
			// Even if it's not a multiple input, files is an array.
			let file = e.target.files[0];

			if ( file.type && file.type.indexOf('json') === -1 ) {
				console.info( 'File is not a JSON file.', file.type, file );
				return;
			}

			const reader = new FileReader();

			// When the file is loaded.
			reader.addEventListener('load', function(e) {
				let data = e.target.result;

				if ( typeof atob !== 'function' ) {
					console.info( 'Browser doesn’t support reading' )
				}

				// That's the dataURI format.
				// console.log( data );
				// We need to split and remove the first part
				// "data:application/json;base64,"
				data = JSON.parse( atob( data.split(',')[1] ) );
				console.log(data);

				// TODO :
				// Update the Settings form
				
				
				// Update the editor blocks.
				editor.render( data.editorjs ); // WORKING !! :D

			});

			// Do something with progress.
			reader.addEventListener('progress', function(e) {
				if (e.loaded && e.total) {
					const percent = (e.loaded / e.total) * 100;
					console.log(`Progress: ${Math.round(percent)}`);
				}
			});
			reader.readAsDataURL(file);
		});
});