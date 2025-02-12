import {CNode} from "../util/CNode.js";




export function addTerminal(range) {
  const terminal = document.createElement('terminal-snippet');
  const br = document.createElement('br');
  range.insertNode(br);
  range.insertNode(terminal);

  removeSelectedEffect(range, br);
  moveCursorToTextBlock(terminal.querySelector('.terminal-command'));
}



export function addHorizontalLine(range, lineType = null) {
  const br = document.createElement('br');
  range.insertNode(br);

  // Create the hr element with specified border type
  const line = document.createElement('hr');
  if (lineType !== null) {
    line.style.border = `1px ${lineType} var(--editor-text)`;
  } else {
    line.style.border = `1px solid var(--editor-text)`;
  }

  range.insertNode(line);
  removeSelectedEffect(range, br);
  moveCursorToTextBlock(br)
}



export function addHeading(range, headingType, extension = null) {
  const heading = document.createElement(`h${headingType}`);

  // Set the user input as the textContent of the heading. 
  if (extension !== null) {
    heading.textContent = extension;
  }
  range.insertNode(heading);
  removeSelectedEffect(range, heading);
  moveCursorToTextBlock(heading);
}



export function addList(range, listType) {
  const list = document.createElement(listType);
  const li = document.createElement('li');

  console.log('creating list');
  console.log(list);

  list.appendChild(li);
  range.insertNode(list);
  // removeSelectedEffect(range, list);
  moveCursorToTextBlock(li);
}



export function addChecklist(range) {
    const br = document.createElement('br');
    const checklist = document.createElement('check-list');
    checklist.init();
    range.insertNode(br);
    range.insertNode(checklist);
}



// export function add


function removeSelectedEffect(range, node) {
  range.setStartAfter(node);
  range.setEndAfter(node);
}



function moveCursorToTextBlock(node) {
  // Creating a text node the cursor will move to
  const textNode = document.createTextNode('');
  node.appendChild(textNode);

  // Move the cursor inside the node
  const range = document.createRange();
  const selection = window.getSelection();

  // Set the range to the text node which is already inside the node
  range.setStart(textNode, 0);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);

  node.focus();
}



export function addColor(color, command) {
  // Use document.execCommand to change text color
  document.execCommand('styleWithCSS', false, true);
  document.execCommand(command, false, color);
}



export function addLink(range) {
  const container = CNode.create('div', {'class': 'link-container'});
  const originalUrl = CNode.create('input', {'class': 'original-link-input', 'type': 'text', 'placeholder': 'Paste link'});
  const customUrl = CNode.create('input', {'class': 'custom-link-input', 'type': 'text', 'placeholder': 'Custom link name'});
  container.append(originalUrl, customUrl);
  
  originalUrl.addEventListener('keydown', (event) => {insert(event, originalUrl)});
  customUrl.addEventListener('keydown', (event) => {insert(event, customUrl)});

  function insert(event, input) {
    if (event.key === 'Enter') {
      // Delete the input
      range.deleteContents();

      // Create a link element
      const anchorTag = document.createElement('a');

      anchorTag.addEventListener('click', () => {window.open(originalUrl.value)});
      
      // The selected text is equal to the link.
      anchorTag.href = originalUrl.value;

      if (customUrl.value !== '') {
        anchorTag.textContent = customUrl.value;
      } else {
        anchorTag.textContent = originalUrl.value;
      }

      range.insertNode(anchorTag);
    } 
    if (event.key === 'Backspace' && input.value === '') {
      container.remove();
    } 
  }

  range.insertNode(container);
  originalUrl.focus();
}



export function addEmbedVideo(range) {    
  const container = CNode.create('div', {'class': 'embed-container', 'contentEditable': 'false'});
  const input = CNode.create('input', {'type': 'text', 'placeholder': 'Paste embed link', 'class': 'embed-link-input'});
  container.append(input);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // Delete the input
      range.deleteContents();

      // Specify no cookies
      const noCookies = 'youtube-nocookie';
      const iframe = document.createElement('div');

      // adding nocookies text to the embed link for reduced cookies
      let iframeArray = input.value.split('youtube');
      iframeArray.splice(1, 0, noCookies);

      const noCookiesIframe = iframeArray.join('');

      iframe.innerHTML = noCookiesIframe;
      const iframeElement = iframe.querySelector('iframe');
      if (iframeElement) {
        iframeElement.title = '';
      }
      range.insertNode(iframe);
    }
  })

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && input.value === '') {
      container.remove()
    }
  })
  range.insertNode(container);
  input.focus();
}



export function addHtml(range) {
  const container = CNode.create('div', {'class': 'html-container', 'contentEditable': 'false'});
  const input = CNode.create('input', {'placeholder': '<p>Paste html here...</p>'});
  container.append(input);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      // Delete the input
      range.deleteContents();

      const editorPaper = document.querySelector('.editor-paper')
      let currentPageContent = editorPaper.innerHTML;
      editorPaper.innerHTML = currentPageContent += input.value;
    }
  })
  range.insertNode(container);
  input.focus();
}

