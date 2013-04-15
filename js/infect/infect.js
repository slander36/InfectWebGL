/******

Infect! main.js

Description:
Creates the WebGL Context from the canvas element, initializing the
WebGL context, shader programs, etc.
Loads the infect namespace used throughout the rest of the program.

@author: Sean Lander

Most code taken from Mozilla's Developer Network guide on WebGL
https://developer.mozilla.org/en-US/docs/WebGL

******/

/* Create the "namespace" */
var ig = ig || {};

var gl = gl || {};

ig.start = function() {
	
	// Grab the canvas element
	var canvas = document.getElementById("infectgame");

	ig.initIG(canvas); // Initialize game attributes such as width, height, aspect
	
	ig.initWebGL(); // Initizlize the GL context
	
	if(gl) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		ig.initShaders();

		ig.initBuffers();

		setInterval(ig.drawScene,15);
	}
}

ig.initIG = function(canvas) {
	ig.canvas = canvas;

	ig.sizes = ig.sizes || {};
	ig.sizes.width = ig.canvas.width;
	ig.sizes.height = ig.canvas.height;
	ig.sizes.haspect = ig.sizes.height/ig.sizes.width;
	ig.sizes.vaspect = ig.sizes.width/ig.sizes.height;

}

ig.initWebGL = function() {
	// Initialize the global variable gl to null
	gl = null;
	
	try {
		// Try to grab the standard context. If it fails, fall back to experimental
		gl = ig.canvas.getContext("webgl") || ig.canvas.getContext("experimental-webgl");
	} catch(e) {
		// If we don't have a GL context, give up now
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
}

ig.initShaders = function() {
	var fragmentShader = ig.getShader(gl, "shader-fs");
	var vertexShader = ig.getShader(gl, "shader-vs");

	// Create the shader program

	ig.shaderProgram = gl.createProgram();
	gl.attachShader(ig.shaderProgram, vertexShader);
	gl.attachShader(ig.shaderProgram, fragmentShader);
	gl.linkProgram(ig.shaderProgram);

	// If creating the shader program failed, alert

	if(!gl.getProgramParameter(ig.shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program");
	}

	gl.useProgram(ig.shaderProgram);

	ig.vertexPositionAttribute = gl.getAttribLocation(ig.shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(ig.vertexPositionAttribute);
}

ig.getShader = function(gl, id) {
	var shaderScript, theSource, currentChild, shader;

	shaderScript = document.getElementById(id);

	if(!shaderScript) {
		return null;
	}

	theSource = "";
	currentChild = shaderScript.firstChild;

	while(currentChild) {
		if(currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource = theSource+currentChild.textContent;
		}

		currentChild = currentChild.nextSibling;
	}

	if(shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if(shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		// Unknown shader type
		return null;
	}

	gl.shaderSource(shader, theSource);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: "+gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

ig.initBuffers = function() {
	ig.squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, ig.squareVerticesBuffer);

	var vertices = [
	1.0, 1.0, 0.0,
	-1.0, 1.0, 0.0,
	1.0, -1.0, 0.0,
	-1.0, -1.0, 0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

ig.drawScene = function() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	ig.perspectiveMatrix = ig.makePerspective(45.0, ig.sizes.vaspect, 0.1, 100.0);

	ig.loadIdentity();
	ig.mvTranslate([0.0, 0.0, -6.0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, ig.squareVerticesBuffer);
	gl.vertexAttribPointer(ig.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	ig.setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

window.onload = function() {
	if(ig) ig.start();
}