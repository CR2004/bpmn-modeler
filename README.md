# bpmn-js Modeler Example

This example uses [bpmn-js](https://github.com/bpmn-io/bpmn-js) to implement a modeler for BPMN 2.0 process diagrams. It serves as the basis of the bpmn-js demo application available at [demo.bpmn.io](http://demo.bpmn.io).

## About

This example is a node-style web application that builds a user interface around the bpmn-js BPMN 2.0 modeler.

![demo application screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/modeler/docs/screenshot.png "Screenshot of the example application")

I have added custom functionalities to this website where you can add clickable urls to the texts, and different coloured BPMN elements to your flowchart. 
## Building

You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project.

To install all project dependencies execute

```
npm install
```

Build the application (including [bpmn-js](https://github.com/bpmn-io/bpmn-js)) via

```
npm run all
```

You may also spawn a development setup by executing

```
npm run dev
```

Both tasks generate the distribution ready client-side modeler application into the `public` folder.

Serve the application locally or via a web server (nginx, apache, embedded).
