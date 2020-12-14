import EditorJS from 'https://cdn.skypack.dev/@editorjs/editorjs';
import Header from 'https://cdn.skypack.dev/@editorjs/header';
import List from 'https://cdn.skypack.dev/@editorjs/list';

let AutoScrollInterval;
let AutoSaveInterval;
let lastFocusedElement;
const _html = document.documentElement;
const inBgcolor = document.getElementById('bgcolor');
const inTxtcolor = document.getElementById('txtcolor');
const inFontsize = document.getElementById('fontsize');
const inVelocity = document.getElementById('velocity');
const inDelay = document.getElementById('delay');
const inMirrorx = document.getElementById('mirrorx');
const inMirrory = document.getElementById('mirrory');
const prompteditor = document.getElementById('editorjs');
const btnSave = document.getElementById('save');
const btnPrompt = document.getElementById('prompt');
const btnExport = document.getElementById('export');
const btnImport = document.getElementById('import');
const FSclass = 'mode-fullscreen';
const storageName = 'prompter-datas';

const insertedData = function() {
	let data = getStorage();
	
	if ( data && data.editorjs ) {
		return data.editorjs;
	}

	return { 
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
};

const getStorage = function() {
	if ( ! window.localStorage ) {
		messagePop( 'Browser can’t save', 'Apparently your browser doesn’t support localStorage. Use Chrome or Firefox, or any compatible browser.', 'error' );
		console.warn( 'Your browser does not support Local Storage API' );
		return false;
	}

	if ( localStorage.getItem(storageName) ) {
		let data = JSON.parse(localStorage.getItem(storageName));
		return data;
	}

	return null;
}

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
	data: insertedData(),
	onReady: function() {
		document.querySelector('.codex-editor__redactor').addEventListener('click', function(){
			clearInterval(AutoScrollInterval);
		});
	}
});

const autoscroll = function(vel) {
	let y = 0;

	clearInterval(AutoScrollInterval);
	prompteditor.scrollTo(0, 0);

	AutoScrollInterval = setInterval( function() {
		y = y + 1;
		prompteditor.scrollTo(0, y);
	}, 100 / parseInt(vel) );
};

const initCoundown = function(counter, speed, autoscroll) {
	let i = 0;
	let regCounter = parseInt(counter);

	// Reset scrolling position to be sure.
	prompteditor.scrollTo(0, 0);

	if ( parseInt(counter) === 0 ) {
		autoscroll(speed);
		return;
	}

	let counterDiv = document.createElement("div");
	counterDiv.setAttribute( 'aria-live', 'assertive' );
	counterDiv.className = 'prompto-counter';
	counterDiv.innerHTML = regCounter;
	
	prompteditor.append(counterDiv);

	setTimeout( function() {
		document.querySelector('.prompto-counter').classList.add('is-visible');
	}, 200 );

	let counting = setInterval( function() {
		i++;
		regCounter--;

		document.querySelector('.prompto-counter').innerHTML = regCounter;

		if ( typeof autoscroll === 'function' && i >= parseInt( counter ) ) {
			clearInterval( counting );
			counting = null; // Old trick for IE, don't know if still needed.

			document.querySelector('.prompto-counter').classList.remove('is-visible');
			autoscroll(speed);
			setTimeout( function() {
				document.querySelector('.prompto-counter').remove();
			}, 400 );
		}
	}, 1000 );
}

const messagePop = function(message, detail, type){
	let messageDiv = document.createElement("div");
	messageDiv.setAttribute( 'aria-live', 'assertive' );
	messageDiv.className = 'prompto-message' + ( type ? ' is-' + type : '' );
	messageDiv.innerHTML = '<div class="msg-content">' + getIcon(type) + ( message || '…' ) + ( detail ? '<p>'+ detail + '</p>' : '' ) + '</div>';
	messageDiv.setAttribute('tabindex', '-1');

	document.querySelector('body').append(messageDiv);

	setTimeout( function() {
		let messagediv = document.querySelector('.prompto-message');
		messagediv.classList.add('is-visible');
		messagediv.focus();
	}, 100 );

	lastFocusedElement = document.activeElement;
	messageDiv.addEventListener('click', function(e){
		if ( e.target === messageDiv ) {
			messageClose();
		}
	});
}

const messageClose = function() {
	let message = document.querySelector('.prompto-message');
	message.classList.remove('is-visible');

	setTimeout( function() {
		message.remove();
		lastFocusedElement.focus();
	}, 300 );
}

const getIcon = function(type) {
	if ( type === 'error' ) {
		return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86001L1.82002 18C1.64539 18.3024 1.55299 18.6453 1.55201 18.9945C1.55103 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5468 2.53773 20.7239C2.83871 20.901 3.18082 20.9962 3.53002 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5468 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.4471 18.6453 22.3547 18.3024 22.18 18L13.71 3.86001C13.5318 3.56611 13.2807 3.32313 12.9812 3.15449C12.6817 2.98585 12.3438 2.89726 12 2.89726C11.6563 2.89726 11.3184 2.98585 11.0188 3.15449C10.7193 3.32313 10.4683 3.56611 10.29 3.86001V3.86001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
	} else {
		return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
	}
}

const getSettings = async function(editorData) {

	let settings = {
		"settings" : {
			"bgcolor": inBgcolor.value,
			"txtcolor": inTxtcolor.value,
			"fontsize": inFontsize.value,
			"velocity": inVelocity.value,
			"delay": inDelay.value,
			"mirrorx": inMirrorx.checked,
			"mirrory": inMirrory.checked
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

const saveall = function(ed, autoSave) {
	ed.save().then((outputData) => {

		getSettings(outputData).then(function(outputSettings){
			localStorage.setItem(
				storageName,
				outputSettings
			);
		});

		let mirror = 'none';

		if ( inMirrorx.checked ) {
			mirror = 'rotateX(-180deg)';
		}

		if ( inMirrory.checked ) {
			mirror = mirror === 'none' ? 'rotateY(-180deg)' : mirror + ' rotateY(-180deg)';
		}

		_html.setAttribute('style', '--prompt-bgcolor:'+inBgcolor.value+';--prompt-txtcolor:'+inTxtcolor.value+';--prompt-fontsize:'+inFontsize.value+'em;--prompt-mirror:'+mirror );

		if ( ! autoSave || (autoSave && autoSave !== true ) ) {
			messagePop('Well saved', 'Prompto is now saving automatically every 20 seconds.',  'success');
			clearInterval( AutoSaveInterval ); // To avoid interval duplication.
			AutoSaveInterval = setInterval( function() {
				saveall(editor, true);
			}, 20000); // 20s
		}

	}).catch((error) => {
		messagePop('Error while saving', 'Can’t tell where it’s from, try later maybe…',  'error');
		console.warn('Saving failed: ', error)
	});
}

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
		saveall(editor, true); // Fake auto save (true) to avoid message.

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
		clearInterval(AutoScrollInterval);
	} else {
		_html.classList.add(FSclass);
	}
});

prompteditor.addEventListener('click', function(){
	clearInterval(AutoScrollInterval);
});

/**
 * Exit modal
 */
document.addEventListener('keydown', function(e){
	if ( document.querySelector('.prompto-message') && e.key === 'Escape' ) {
		messageClose();
	}
});

/**
 * Export
 */
btnExport.addEventListener('click', function(){

	let filename = 'prompto.json';
	let dataStr = getStorage();

	if ( dataStr ) {
		let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
		let linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', filename);
		linkElement.click();
	} else {
		messagePop('Oops, can’t export', 'Try to save before exporting your work.',  'error');
		console.warn('Error while getting the data.');
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

			// Update the Settings form
			if ( data.settings ) {
				Object.keys( data.settings ).forEach(key => {
					let element = document.getElementById(key);
					if ( ! element ) {
						console.warn( key + ' input doesn’t exist.');
						return;
					}

					if ( element.type == 'checkbox' ) {
						element.checked = data.settings[key];
					} else {
						element.value = data.settings[key];
					}

				});
			}
			
			// Update the editor blocks.
			if ( data.editorjs ) {
				editor.render( data.editorjs ); // WORKING !! :D
			}
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