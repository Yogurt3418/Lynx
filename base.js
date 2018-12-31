//Setup for the HTML canvas, and define basic math functions

var c = document.getElementById("2D MAP XY Plane");
var ctx = c.getContext("2d");
var e = document.getElementById("2D MAP XZ Plane");
var xzp = e.getContext("2d");
var d = document.getElementById("3D WORLD");
var x3d = d.getContext("2d");
var w = c.width;
var h = c.height;
var wz = e.width;
var hz = e.height;
var w3 = d.width;
var h3 = d.height;
var max = Math.sqrt((w*w)+(h*h)); 

var xmax_2d = 5;
var ymax_2d = 5;
var zmax_2d = 5;

var dev_mode = 0;
/*
    0 : Nothing
    1 : Show function steps
    2 : Show Camera location
*/

ctx.font = "20px Arial";

function clr(){ctx.clearRect(0, 0, w, c.height);} //Clear 2D
function clr3d(){x3d.clearRect(0, 0, w3, d.height);} //Clear 3D

function getRad(rad) {return rad * Math.PI/180;}
function getDeg(deg) {return deg * 180/Math.PI;}
