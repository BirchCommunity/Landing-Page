// Make sure we don't make the canvas wider than the screen
var side = $(document).width();
if (side > 400) {
    side = 400;
} else {
    side = side - (side/10)
}
// Size of the orbs traveling between the nodes
let orb_size = side/20;

// Calculate the positions of each of the nodes
let sideoffset = side*0.0425;
let wideoffset = side*(2.79/10); // Bad naming, I know
let half = side/2;
nodes = [
    [half, half], // Middle
    [half, sideoffset], // Middle top
    [half, side-sideoffset], // Middle bottom
    [sideoffset, wideoffset],  // Left Top
    [sideoffset, side-wideoffset], // Left bottom
    [side-sideoffset, wideoffset], // Right top
    [side-sideoffset, side-wideoffset] // Right bottom
]; 

edges = [
    // All of the spokes from the center
    [nodes[0], nodes[1]],
    [nodes[0], nodes[2]],
    [nodes[0], nodes[3]],
    [nodes[0], nodes[4]],
    [nodes[0], nodes[5]],
    [nodes[0], nodes[6]],
    // All of the sides
    [nodes[1], nodes[5]],
    [nodes[5], nodes[6]],
    [nodes[6], nodes[2]],
    [nodes[2], nodes[4]],
    [nodes[4], nodes[3]],
    [nodes[3], nodes[1]]
];

let app = new PIXI.Application({ 
    width: side,   
    height: side,        
    transparent: true
  }
);

// Get the element we want to attach the canvas to 
let background = document.getElementById("animated-logo");
background.appendChild(app.view)
var orbs = [];

PIXI.loader
  .add("assets/master-styles/logos/whitelogo.png")
  .add("assets/img/orb.png")
  .load(createScene);


function createScene() {
    let logo = new PIXI.Sprite(PIXI.loader.resources["assets/master-styles/logos/whitelogo.png"].texture);
    logo.width = side;
    logo.height = side;
    logo.anchor.set(0.5);
    logo.x = half;
    logo.y = half;
    app.stage.addChild(logo);

    loop();
}

function loop() {
    requestAnimationFrame(loop);
    render();
}

function render(){
    // Randomly create new orbs
    if (getRandomInt(10000) % 47 == 0) {
        var edge = edges[getRandomInt(edges.length - 1)]
        orbs.push(new Orb(edge[0], edge[1], 2))
    }

    orbs.forEach(o => o.step())
}

// Orb prototype that represents one orb on the screen
function Orb(p1, p2, v) {
    this.p1 = p1;
    this.p2 = p2;
    this.v = v;
    this.sprite = new PIXI.Sprite(PIXI.loader.resources["assets/img/orb.png"].texture);
    this.sprite.height = orb_size;
    this.sprite.width = orb_size;
    this.sprite.anchor.set(0.5);
    this.sprite.x = p1[0];
    this.sprite.y = p1[1];
    app.stage.addChild(this.sprite);
}

Orb.prototype.step = function() {
    var d_x = this.p2[0] - this.sprite.x;
    var d_y = this.p2[1] - this.sprite.y;
    var len = Math.sqrt(Math.pow(d_x, 2) + Math.pow(d_y, 2));
    d_x = (d_x/len)*this.v;
    d_y = (d_y/len)*this.v;
    this.sprite.x += d_x;
    this.sprite.y += d_y;
    
    if (this.sprite.x == this.p2[0] && this.sprite.y == this.p2[1]){
        app.stage.removeChild(this.sprite);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}