var lines = [];

class point {
    constructor(x, y, z, color) {
        
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.cam_offs = 0;
        this.cam_ang_xy = 0;
        this.cam_ang_xz = 0;
    }
    
    dot(pt2){
    
        return ((this.x*pt2.x) + (this.y*pt2.y) + (this.z*pt2.z));
    
    }

    cross(pt2){
    
        //isnt REALLY a point but it will do for now
        return new point(((this.y*pt2.z)-(this.z*pt2.y)),  ((this.z*pt2.x)-(this.x*pt2.z)), ((this.x*pt2.y)-(this.y*pt2.x)));
    }
    
    get magnitude(){
        
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2));
        
    }
	
	get ysign(){
		return (this.y/Math.abs(this.y));
	}
}

var camera = {
    
    pos : new point(0,0,0),
    center : new point(1000,0,0),
    dir : 0,
    fov : 90,
    dep : 1
    
}

class line{
    constructor(pt1, pt2){
        this.points = [pt1, pt2];
        
    }
    
    get length(){
        
        return 
        
    }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 87) { //UP 
        camera.pos.x+=.5;
    }
    if(event.keyCode == 83) { //DOWN 
        camera.pos.x-=.5;
    }
    if(event.keyCode == 65) { //LEFT 
        camera.pos.y++;
    }
    if(event.keyCode == 68) { //RIGHT
        camera.pos.y--;
    }
    
    
    predraw_setup();
    pt_calculations();
    draw_lines();
    
});


//init
function init(){
    
    //Create 8 points 
    var pt1 = new point(4,1,-1);
    var pt2 = new point(4,1,1);
    var pt3 = new point(2,-1,1);
	var pt4 = new point(2,-1,-1);
	
	var pt5 = new point(2,1,-1);
    var pt6 = new point(2,1,1);
    var pt7 = new point(4,-1,1);
	var pt8 = new point(4,-1,-1);
	
	
	var ln1 = new line(pt1,pt2);
	var ln2 = new line(pt3,pt4);
	var ln3 = new line(pt5,pt4);
	var ln4 = new line(pt6,pt3);
	
	var ln5 = new line(pt5,pt6);
	var ln6 = new line(pt7,pt8);
	var ln7 = new line(pt1,pt8);
	var ln8 = new line(pt2,pt7);
	
	var ln9 = new line(pt4,pt8);
	var ln10 = new line(pt3,pt7);
	var ln11 = new line(pt5,pt1);
	var ln12 = new line(pt6,pt2);
	
	//for now each point must be pushed to a list
	//points.push(pt1,pt2,pt3,pt4,pt5,pt6,pt7,pt8,camera.pos);
	lines.push(ln1, ln2, ln3, ln4, ln5, ln6, ln7, ln8, ln9, ln10, ln11, ln12);
	
}

function predraw_setup(){
    
    //Calculate the location of the center view based on camera position and direction
	camera.center.x = camera.pos.x + camera.dep*Math.cos(getRad(camera.dir));
	camera.center.y = camera.pos.y + camera.dep*Math.sin(getRad(camera.dir));
	camera.center.z = camera.pos.z; //+ camera.dep*Math.sin(getRad(camera.dir));//fill this in later
    
    
    clr();
    clr3d();
    //Draw the x and y axis
    ctx.beginPath();
    ctx.moveTo(w/2,0);  
    ctx.lineTo(w/2,h);
    
    ctx.moveTo(0,h/2);
    ctx.lineTo(w,h/2);
    ctx.stroke();
    
    xzp.beginPath();
    xzp.moveTo(wz/2,0);  
    xzp.lineTo(wz/2,hz);
    
    xzp.moveTo(0,hz/2);
    xzp.lineTo(wz,hz/2);
    xzp.stroke();
    
    if(dev_mode == 1)
        ctx.fillText("PreDraw Complete!",10,30);
}

//if the angle between the dot and the center of view is less than the actual span of fov it is on

function pt_calculations(){
    
    //Iterate over each point in the system and calculate their angle and position relative to the camera

    //This part only relies on the camera, so it only should be calculated once
    var a = Math.sqrt(Math.pow(camera.center.x-camera.pos.x,2) + Math.pow(camera.center.y-camera.pos.y,2));// + Math.pow(camera.center.z-camera.pos.z,2));
    var a_z = Math.sqrt(Math.pow(camera.center.x-camera.pos.x,2) + Math.pow(camera.center.z-camera.pos.z,2));
    
    //for each line
    for(var i = 0; i < lines.length; i++){
     
     
        //for each point on the line
        for(var j=0; j < lines[i].points.length; j++){
            
            //Calculate angle between camera, point, and center vector in the XY plane using law of cosines
            
            //c^2 = a^2 + b^2 − 2ab cos(C)
            //becomes
            //C = arccos((a^2 + b^2 + c^2)/(2ab))
            //with C being the angle between the camera, the center of the line of sight and the point
            
            
            //Distance between point and camera and between point and camera center
            
            //xy plane
            var b = Math.sqrt(Math.pow(lines[i].points[j].x-camera.pos.x,2) + Math.pow(lines[i].points[j].y-camera.pos.y,2) );//+ Math.pow(lines[i].points[j].z-camera.pos.z,2));
            var c = Math.sqrt(Math.pow(camera.center.x-lines[i].points[j].x,2) + Math.pow(camera.center.y-lines[i].points[j].y,2));// + Math.pow(camera.center.z-lines[i].points[j].z,2));
            
            //xz plane
            var d = Math.sqrt(Math.pow(lines[i].points[j].x-camera.pos.x,2) + Math.pow(lines[i].points[j].z-camera.pos.z,2));
            var e = Math.sqrt(Math.pow(camera.center.x-lines[i].points[j].x,2) + Math.pow(camera.center.z-lines[i].points[j].z,2));
            
            //get the sign of the angle
            var signxy = Math.sign(lines[i].points[j].y);
            var anglexy = 0;
            
            var signxz = Math.sign(lines[i].points[j].z);
            var anglexz = 0;
            
            //if the sign is nonzero in xy
            if (signxy){
                
                //set the angle to the value times the sign
                anglexy = signxy*Math.acos((a*a + b*b - c*c)/(2*a*b));
            
            }else{
                //the sign is 0, this is either 0 or 180
                anglexy = Math.acos((a*a + b*b - c*c)/(2*a*b));
                
            }
            
            
            //if the sign is nonzero in xz
            if (signxz){
                
                //set the angle to the value times the sign
               anglexz = signxz*Math.acos((a_z*a_z + d*d - e*e)/(2*a_z*d));
            
            }else{
                //the sign is 0, this is either 0 or 180
                
                anglexz = Math.acos((a_z*a_z + d*d - e*e)/(2*a_z*d));
                
                xzp.fillText("den = " + (2*a_z*d) ,10,30);
                xzp.fillText("num = " + (a_z*a_z + d*d - e*e) ,10,50);
            }
            
            //Update the point with the current angle
            lines[i].points[j].cam_ang_xy = anglexy;
            lines[i].points[j].cam_ang_xz = anglexz;
            
            //what does this do?
            lines[i].points[j].cam_offs = b;
            
        }
        
    }
    
    if(dev_mode == 1)
        ctx.fillText("pt_calc Complete!" ,10,45);
}

function draw_lines(){
    
    if (dev_mode == 2){
        ctx.fillText("x : " + Math.round(camera.center.x),10,50);
        ctx.fillText("y : " + Math.round(camera.center.y),10,70);
        ctx.fillText("a : " + camera.dir,10,90);
    }
    
    for(var i = 0; i < lines.length; i++){
    
     
        for(var j = 0; j < lines[i].points.length; j++){
            
            
            //calculate where the dots will be drawn on the 2D screen
            var xpoint = (w/2) + ((w/2)/xmax_2d)*lines[i].points[j].x;
            var ypoint = (h/2) - ((h/2)/ymax_2d)*lines[i].points[j].y;
            var zpoint = (h/2) - ((h/2)/zmax_2d)*lines[i].points[j].z;
            
            
            //Display the angle next to the dot
            ctx.fillStyle="#000000";
    		ctx.fillText(" " + Math.round(getDeg(lines[i].points[j].cam_ang_xy)),xpoint,ypoint);
    		
    		//draw the 2d stuff
    		//If the dot falls within the FOV color it red
            if (Math.abs(getDeg(lines[i].points[j].cam_ang_xy)) <= (camera.fov/2)){
    			ctx.fillStyle="#ff0000";
                ctx.fillRect(xpoint-3,ypoint-3,10,10);
            }else{
                //otherwise just color it black
    			ctx.fillStyle="#000000";
                ctx.fillRect(xpoint-3,ypoint-3,5,5);
            }
            
            
            xzp.fillStyle="#000000";
    		xzp.fillText(" " + Math.round(getDeg(lines[i].points[j].cam_ang_xz)),xpoint,zpoint);
            
            if (Math.abs(getDeg(lines[i].points[j].cam_ang_xz)) <= (camera.fov/2)){
    			xzp.fillStyle="#ff0000";
                xzp.fillRect(xpoint-3,zpoint-3,10,10);
            }else{
                //otherwise just color it black
    			xzp.fillStyle="#000000";
                xzp.fillRect(xpoint-3,zpoint-3,5,5);
            }
            
            
            var screen_split_h = w3/camera.fov;
            var screen_split_v = h3/camera.fov;
            
            //draw 3d stuff
            if (Math.abs(getDeg(lines[i].points[j].cam_ang_xy)) <= camera.fov/2 && Math.abs(getDeg(lines[i].points[j].cam_ang_xz)) <= camera.fov/2){
    			
    			x3d.fillStyle="#ff0000";
                //x3d.fillRect((camera.fov/2)*screen_split + (getDeg(lines[i].points[j].cam_ang_xy)*screen_split),(h3/2),10,10);
    			x3d.fillText(" " + Math.round(getDeg(lines[i].points[j].cam_ang_xy)),(camera.fov/2)*screen_split_h + (getDeg(lines[i].points[j].cam_ang_xy)*screen_split_h),(h3/2));
    		}
        }
        
        x3d.moveTo((camera.fov/2)*screen_split_h + (getDeg(lines[i].points[0].cam_ang_xy)*screen_split_h), (camera.fov/2)*screen_split_v + (getDeg(lines[i].points[0].cam_ang_xz)*screen_split_v));// (h3/2));
        x3d.lineTo((camera.fov/2)*screen_split_h + (getDeg(lines[i].points[1].cam_ang_xy)*screen_split_h), (camera.fov/2)*screen_split_v + (getDeg(lines[i].points[1].cam_ang_xz)*screen_split_v));// (h3/2));
        x3d.stroke();
    }
    
    if(dev_mode == 1)
        ctx.fillText("Draw_ln Complete!" ,10,60);   
}

init();
predraw_setup();
pt_calculations();
draw_lines();
