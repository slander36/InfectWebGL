/******

Infect! loadObj.js

Description:
Rewrite of loadObj.h/loadObj.cpp for class.
Allows user to load in a .obj file if one exists.

@author: Sean Lander

******/

var objm = objm || { };

objm.C_PI = 3.14159265;

objm.OBJM_NONE = 			0;		// render with vertices
objm.OBJM_FLAT_SHADE = 		1;		// render with face normals
objm.OBJM_SMOOTH_SHADE = 	2;		// render with vertex normals
objm.OBJM_TEXTURE = 		4;		// render with texture coords
objm.OBJM_COLOR = 			8;		// render with colors
objm.OBJM_MATERIAL = 		16;		// render with materials
	
/*
OBJMmaterial: Structure that defines a material in a model.
Read in from the appropriate line in the OBJ file, this structure
contains info that defines how the object appears when lighted.
*/
objm.OBJMmaterial = function()
{
	this.name = 		"";				// Name of the material
	this.ambient = 		Vector.Zero(4);	// Ambient component
	this.diffuse = 		Vector.Zero(4);	// Diffuse component
	this.specular = 	Vector.Zero(4);	// Specular component
	this.emissive = 	Vector.Zero(4);	// Emissive component
	this.shininess = 	0;				// Specular exponent
};

/*
OBJMtriangle: Structure that defines a triangle in a model. All
the information relevant to a triangle, which is the building block
of any OBJ mesh. Array of these is used in the OBJMmodel structure.
*/
objm.OBJMtriangle = function()
{
	this.vindices = Vector.Zero(3);	// Array of triangle vertex indices
	this.nindices = Vector.Zero(3);	// Array of triangle normal indices
	this.tindices = Vector.Zero(3);	// Array of triangle texcoord indices
	this.findex = 	0;				// Triangle facet normal indices
};

/*
OBJMgroup: Strcuture that defines a group in a model. Large OBJ files
representing complex meshes have groups in theme, which is a means of
grouping different regions of the mesh. For example, an OBJ mesh of a
human might have the triangles for the head, torso, arms and legs in
different groups
*/
objm.OBJMgroup = function()
{
	this.name = 		"";		// The group name
	this.triangles = 	[];		// GLuint*		// The array of triangle indices
	this.material = 	0;		// GLuint		// The index of the material for the group
	this.next = 		null;	// OBJMgroup*	// The next group in the model
	this.numTriangles = function() { return this.triangles.length; } // GLuint	// The number of triangles in the group
};

/*
OBJMmodel: Structure that defines a model. It has arrays for all the info
needed when loading an OBJ file:

Vertices
Face normals
Vertex normals
Texture coordinates
Triangles
Materials

It also has a linked list for the groups in the OBJ file.
*/
objm.OBJMmodel = function()
{
	this.pathname = 		"";	// char*	// Path to the model
	this.mtllibname = 		"";	// char*	// Name of the material library
	
	this.vertices = 	[];	// GLfloat*			// Array of vertices
	this.facetnorms = 	[];	// GLfloat*			// Array of facetnorms
	this.vertexnorms = 	[];	// GLfloat*			// Array of vertexnorms
	this.texcoords = 	[];	// GLfloat*			// Array of texcoords
	this.triangles = 	[];	// OBJMtriangle*	// Array of traingles
	this.materials = 	[];	// OBJMmaterial*	// Array of materials
	this.groups = 		[];	// OBJMgroup*		// Linked list of groups

	this.numvertices = 		function() { return this.vertices.length; };	// GLuint	// Number of vertices
	this.numfacestnorms = 	function() { return this.facetnorms.length; };	// GLuint	// Number of facetnorms
	this.numvertexnorms = 	function() { return this.vertexnorms.length; };	// GLuint	// Number of vertexnorms
	this.numtexcoords = 	function() { return this.texcoords.length; };	// GLuint	// Number of texcoords in the model
	this.numtriangles = 	function() { return this.triangles.length; };	// GLuint	// Number of triangles in the model
	this.nummaterials = 	function() { return this.materials.length; };	// GLuint	// Number of materials in the model
	this.numgroups = 		function() { return this.groups.length; };		// GLuint	// Number of groups in the model

	this.position = Vector.Zero(3);	// GLfloat	// Position of the model
};

/*
OBJMnode: General purpose node
*/
objm.OBJMnode = function()
{
	this.index = 0;			// Index of node
	this.averaged = false;	// ???
	this.next = null;		// Next node
}
objm.loadObj = function() {
	/* Public */
	this.eye = Vertex.Zero(3); 			// GLfloat[3]
	this.at = Vertex.Zero(3);			// GLfloat[3]
	this.up = Vertex.Zero(3);			// GLfloat[3]
	this.translation = Vertex.Zero(3);	// GLfloat[3]
	this.rotation = Vertex.Zero(4);		// GLfloat[4]

	this.projection = Vertex.Zero(16);	// GLdouble[16]
	this.modelview = Vertex.Zero(16);	// GLdouble[16]
	this.inverse = Vertex.Zero(16);		// GLdouble[16]

	this.swapped = false;				// GLboolean
	this.world_draw = false;			// GLboolean
	this.pmodel = null;					// OBJMmodel
	this.selection = 0;					// GLint

	/* Private */
	var xRot = 0;			// int
	var yRoy = 0;			// int
	var zRot = 0;			// int
	var drawType = 0;		// int
	var drawPointsAlso = 0;	// int
	var nearPlane = 0.1;	// float (incorrect spelling in source)
	var farPlane = 20.0;	// float

	var curPickDepth = 0.0;				// GLfloat
	var minVertIndex = 0;				// GLint
	var minVertCoords = Vertex.Zero(3);	// GLfloat[3]
	var distClosestVertex = 0.0;		// GLfloat
	var viewport = Vertex.Zero(4);		// GLint[4]
	var mvmatrix = Vertex.Zero(16);		// GLdouble[16]
	var projmatrix = Vertex.Zero(16);	// GLdouble[16]
	var edgeList = null;				// vector< vector<int> > // TODO: Need to make vector class
}

objm.loadObj.prototype.objmUnitize = function(model) { // (OBJMmodel*)

};

objm.loadObj.prototype.objmDimensions = function(model, dimensions) { // (OBJMmodel*, GLfloat*)

};

objm.loadObj.prototype.objmScale = function(model, scale) { // (OBJMmodel*, GLfloat)

};

objm.loadObj.prototype.objmReverseWinding = function(model) { // (OBJMmodel*)

}

objm.loadObj.prototype.objmFacetNormals = function() { // ()
	
}

objm.loadObj.prototype.objmVertexNormals = function() { // ()
	
}

objm.loadObj.prototype.objmLinearTexture = function() { // ()
	
}

objm.loadObj.prototype.objmSpheremapTexture = function() { // ()
	
}

objm.loadObj.prototype.objmDelete = function() { // ()
	
}

objm.loadObj.prototype.objmLoad = function() { // ()
	
}

objm.loadObj.prototype.objmSave = function() { // ()
	
}

objm.loadObj.prototype.objmReadOBJ = function() { // ()
	
}

objm.loadObj.prototype.objmWriteOBJ = function() { // ()
	
}

objm.loadObj.prototype.objmDraw = function() { // ()
	
}

objm.loadObj.prototype.objmList = function() { // ()
	
}

objm.loadObj.prototype.objmWeld = function() { // ()
	
}

objm.loadObj.prototype.objmReadPPM = function() { // ()
	
}

objm.loadObj.prototype.objmMax = function() { // ()
	
}

objm.loadObj.prototype.objmAbs = function() { // ()
	
}

objm.loadObj.prototype.objmDot = function() { // ()
	
}

objm.loadObj.prototype.objmCross = function() { // ()
	
}

objm.loadObj.prototype.objmNormalize = function() { // ()
	
}

objm.loadObj.prototype.objmEqual = function() { // ()
	
}

objm.loadObj.prototype.objmWeldVectors = function() { // ()
	
}

objm.loadObj.prototype.objmFindGroup = function() { // ()
	
}

objm.loadObj.prototype.objmAddGroup = function() { // ()
	
}

objm.loadObj.prototype.objmFindMaterial = function() { // ()
	
}

objm.loadObj.prototype.objmDirName = function() { // ()
	
}

objm.loadObj.prototype.objmReadMLT = function() { // ()
	
}

objm.loadObj.prototype.objmWriteMLT = function() { // ()
	
}

objm.loadObj.prototype.objmFirstPass = function() { // ()
	
}

objm.loadObj.prototype.objmSecondPass = function() { // ()
	
}

objm.loadObj.prototype.normalize = function() { // ()
	
}

objm.loadObj.prototype.invert = function() { // ()
	
}

objm.loadObj.prototype.identity = function() { // ()
	
}

objm.loadObj.prototype.drawModel = function() { // ()
	
}

objm.loadObj.prototype.buildEdgeList = function() { // ()
	
}