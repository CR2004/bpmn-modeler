import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
} from 'tiny-svg';

import {
  getRoundRectPath,
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject,
} from 'bpmn-js/lib/util/ModelUtil';

import {isNil} from 'min-dash';

const HIGH_PRIORITY = 1500;
const TASK_BORDER_RADIUS = 2;
const COLOR_GREEN = '#52B415';
const COLOR_YELLOW = '#ffc800';
const COLOR_RED = '#cc0000';

/**
 * CustomRenderer is a class that extends the BaseRenderer class and provides
 * custom rendering behavior for BPMN shapes.
*/
export default class CustomRenderer extends BaseRenderer {
  /**
     * Creates an instance of CustomRenderer.
     *
     * @param {EventBus} eventBus - The event bus.
     * @param {BpmnRenderer} bpmnRenderer - The BPMN renderer.
  */
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }
  /**
     * Checks if the element can be rendered.
     *
     * @param {djs.model.Element} element - The element to check.
     * @return {boolean} - Whether the element can be rendered or not.
  */
  canRender(element) {
    // ignore labels
    return !element.labelTarget;
  }
  /**
     * Draws the shape on the parent node.
     *
     * @param {SVGElement} parentNode - The parent node to draw the shape on.
     * @param {djs.model.Shape} element - The shape element to draw.
     * @return {SVGElement} - The rendered shape element.
  */
  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    const suitabilityScore = this.getSuitabilityScore(element);

    if (!isNil(suitabilityScore)) {
      const color = this.getColor(suitabilityScore);

      const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);

      svgAttr(rect, {
        transform: 'translate(-20, -10)',
      });

      const text = svgCreate('text');

      svgAttr(text, {
        fill: '#fff',
        transform: 'translate(-15, 5)',
      });

      svgClasses(text).add('djs-label');

      svgAppend(text, document.createTextNode(suitabilityScore));

      svgAppend(parentNode, text);
    }

    return shape;
  }
  /**
     * Retrieves the path for the given shape.
     *
     * @param {djs.model.Shape} shape - The shape to retrieve the path for.
     * @return {string} - The shape path.
  */
  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }
  /**
     * Retrieves the suitability score for the given element.
     *
     * @param {djs.model.Element} element -
       The element to retrieve the suitability score for.
     * @return {number|null} - The
       suitability score or null if it's not defined.
  */
  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);

    const {suitable} = businessObject;

    return Number.isFinite(suitable) ? suitable : null;
  }
  /**
     * Retrieves the color based on the suitability score.
     *
     * @param {number} suitabilityScore - The suitability score.
     * @return {string} - The color for the suitability score.
  */
  getColor(color) {
    if (color=='green') {
      return COLOR_GREEN;
    } else if (color == 'yellow') {
      return COLOR_YELLOW;
    }

    return COLOR_RED;
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];

// helpers //////////

/**
 * Draws a rectangle shape on the parent node.
 *
 * @param {SVGElement} parentNode - The parent node to draw the rectangle on.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {number} borderRadius - The border radius of the rectangle.
 * @param {string} color - The color of the rectangle.
 * @return {SVGElement} - The rendered rectangle element.
 */
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color,
  });

  svgAppend(parentNode, rect);

  return rect;
}

