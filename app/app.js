/* eslint-env es6 */
import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import diagramXML from '../resources/newDiagram.bpmn';
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import customModule from './custom';

const container = $('#js-drop-zone');

const modeler = new BpmnModeler({
  container: '#js-canvas',
  keyboard: {
    bindTo: window,
  },
  additionalModules: [
    BpmnColorPickerModule,
    customModule,
  ],
});

/**
 * Creates a new diagram by opening the provided XML.
 *
 * @param {string} xml - The XML representing the diagram.
 * @return {void}
 */
function createNewDiagram() {
  openDiagram(diagramXML);
}

/**
 * Opens the diagram by importing the provided XML using the modeler.
 *
 * @param {string} xml - The XML representing the diagram.
 * @return {Promise<void>} A promise that resolves when the
   diagram is successfully opened.
 */
async function openDiagram(xml) {
  try {
    await modeler.importXML(xml);

    container
        .removeClass('with-error')
        .addClass('with-diagram');
    // Add symbol double-click event handler
    const canvas = modeler.get('canvas');
    canvas.getContainer().addEventListener('dblclick', handleSymbolDoubleClick);
  } catch (err) {
    container
        .removeClass('with-diagram')
        .addClass('with-error');

    container.find('.error pre').text(err.message);

    console.error(err);
  }
}

/**
 * Handles the double-click event on a diagram symbol.
 *
 * @param {Event} event - The double-click event object.
 * @return {void}
 */
function handleSymbolDoubleClick(event) {
  const element = event.target;
  const businessObject = element.businessObject;

  // Check if the clicked element is a symbol with a URL
  if (businessObject.url) {
    const symbolUrl = businessObject.url;
    // Open the URL in a new tab or window
    window.open(symbolUrl, '_blank');
  }
}

/**
 * Registers file drop event handlers on the specified container element.
 *
 * @param {HTMLElement} container -
   The container element to register the file drop events on.
 * @param {Function} callback -
   The callback function to execute when a file is dropped.
 */
function registerFileDrop(container, callback) {
  // File select event handler when a file is dropped
  /**
     * Handles the file select event when a file is dropped.
     *
     * @param {Event} e - The file select event object.
     * @return {void}
  */
  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    const files = e.dataTransfer.files;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const xml = e.target.result;
      callback(xml);
    };

    reader.readAsText(file);
  }

  // Drag over event handler
  /**
     * Handles the "dragover" event.
     *
     * @param {Event} e - The dragover event object.
     * @return {void}
  */
  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);
}

// File drag / drop
if (!window.FileList || !window.FileReader) {
  window.alert(
      'Looks like you use an older browser that does not support'+
        ' drag and drop. Try using Chrome, Firefox, or Internet Explorer > 10.',
  );
} else {
  registerFileDrop(container, openDiagram);
}

// Bootstrap diagram functions
$(function() {
  $('#js-create-diagram').click(function(e) {
    e.stopPropagation();
    e.preventDefault();
    createNewDiagram();
  });

  const downloadLink = $('#js-download-diagram');
  const downloadSvgLink = $('#js-download-svg');

  $('.buttons a').click(function(e) {
    if (!$(e.target).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  /**
   * Sets the encoded data and attributes for a link element.
   *
   * @param {jQuery} link - The link element.
   * @param {string} name - The name of the file.
   * @param {string|null} data - The data to be encoded.
   * @return {void}
   */
  function setEncoded(link, name, data) {
    const encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        href: 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        download: name,
      });
    } else {
      link.removeClass('active');
    }
  }

  const exportArtifacts = debounce(async function() {
    try {
      const {svg} = await modeler.saveSVG();
      setEncoded(downloadSvgLink, 'diagram.svg', svg);
    } catch (err) {
      console.error('Error occurred while saving SVG: ', err);
      setEncoded(downloadSvgLink, 'diagram.svg', null);
    }

    try {
      const {xml} = await modeler.saveXML({format: true});
      setEncoded(downloadLink, 'diagram.bpmn', xml);
    } catch (err) {
      console.error('Error occurred while saving XML: ', err);
      setEncoded(downloadLink, 'diagram.bpmn', null);
    }
  }, 500);

  modeler.on('commandStack.changed', exportArtifacts);
});

/**
 * Creates a debounced version of a function.
 *
 * @param {Function} fn - The function to be debounced.
 * @param {number} timeout - The debounce timeout in milliseconds.
 * @return {Function} - The debounced function.
 */
function debounce(fn, timeout) {
  let timer = null;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}


