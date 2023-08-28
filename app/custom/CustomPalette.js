/**
 * Represents a custom context pad for BPMN diagrams.
 * This class provides functionality to
   customize the context pad entries for BPMN elements.
 *
 * @class
*/
export default class CustomPalette {
  /**
     * Constructs a new instance of the CustomPalette class.
     *
     * @param {BpmnFactory} bpmnFactory - The factory for BPMN elements.
     * @param {Create} create - The service for creating BPMN elements.
     * @param {ElementFactory} elementFactory -
       The factory for creating diagram elements.
     * @param {Palette} palette - The palette to register the provider with.
     * @param {Translate} translate - The translation service.
  */
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }
  /**
     * Retrieves the palette entries for the custom context pad.
     *
     * @param {djs.model.Element} element -
       The element to retrieve palette entries for.
     * @return {Object.<string, Object>} -
       An object containing the palette entries.
  */
  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate,
    } = this;
    /**
       * Creates a task with the given suitability score.
       *
       * @param {string} color - The color for the task.
       * @return {Function} - The function to create the task element.
    */
    function createTask(color) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');

        businessObject.suitable = color;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject,
        });

        create.start(event, shape);
      };
    }

    return {
      'create.low-task': {
        group: 'activity',
        className: 'bpmn-icon-task red',
        title: translate('Create Task with low suitability score'),
        action: {
          dragstart: createTask('red'),
          click: createTask('red'),
        },
      },
      'create.average-task': {
        group: 'activity',
        className: 'bpmn-icon-task yellow',
        title: translate('Create Task with average suitability score'),
        action: {
          dragstart: createTask('yellow'),
          click: createTask('yellow'),
        },
      },
      'create.high-task': {
        group: 'activity',
        className: 'bpmn-icon-task green',
        title: translate('Create Task with high suitability score'),
        action: {
          dragstart: createTask('green'),
          click: createTask('green'),
        },
      },
    };
  }
}


CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate',
];
