/**
 * Represents a custom context pad for BPMN diagrams.
 * This class provides functionality to
 customize the context pad entries for BPMN elements.
*/
export default class CustomContextPad {
  /**
     * Constructs a new CustomContextPad.
     * @param {BpmnFactory} bpmnFactory - The BpmnFactory instance.
     * @param {Object} config - The configuration object.
     * @param {ContextPad} contextPad - The ContextPad instance.
     * @param {Function} create - The create function.
     * @param {ElementFactory} elementFactory - The ElementFactory instance.
     * @param {Injector} injector - The Injector instance.
     * @param {Translate} translate - The Translate instance.
  */
  constructor(bpmnFactory, config, contextPad, create,
      elementFactory, injector, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }
  /**
     * Retrieves the ContextPad entries for the given element.
     * @param {djs.model.Base} element - The diagram element.
     * @return {Object} The ContextPad entries.
  */
  getContextPadEntries(element) {
    const {
      autoPlace,
      bpmnFactory,
      create,
      elementFactory,
      translate,
    } = this;
    /**
       * Appends a service task with the specified suitability score.
       * @param {string} color - The color.
       * @return {Function} The append service task function.
    */
    function appendServiceTask(color) {
      return function(event, element) {
        if (autoPlace) {
          const businessObject = bpmnFactory.create('bpmn:Task');

          businessObject.suitable = color;

          const shape = elementFactory.createShape({
            type: 'bpmn:Task',
            businessObject: businessObject,
          });

          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      };
    }
    /**
       * Starts appending a service task with the specified suitability score.
       * @param {string} color - The color.
       * @return {Function} The append service task start function.
    */
    function appendServiceTaskStart(color) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');

        businessObject.suitable = color;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject,
        });

        create.start(event, shape, element);
      };
    }

    return {
      'append.low-task': {
        group: 'model',
        className: 'bpmn-icon-task red',
        title: translate('Append Task with low suitability score'),
        action: {
          click: appendServiceTask('red'),
          dragstart: appendServiceTaskStart('red'),
        },
      },
      'append.average-task': {
        group: 'model',
        className: 'bpmn-icon-task yellow',
        title: translate('Append Task with average suitability score'),
        action: {
          click: appendServiceTask('yellow'),
          dragstart: appendServiceTaskStart('yellow'),
        },
      },
      'append.high-task': {
        group: 'model',
        className: 'bpmn-icon-task green',
        title: translate('Append Task with high suitability score'),
        action: {
          click: appendServiceTask('green'),
          dragstart: appendServiceTaskStart('green'),
        },
      },
    };
  }
}

CustomContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate',
];
