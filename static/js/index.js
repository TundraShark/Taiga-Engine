/*

function init(){
  stage = new PIXI.Container();
  renderer = PIXI.autoDetectRenderer(
    512,
    384,
    {view:document.getElementById("game-canvas")}
  );

  var farTexture = PIXI.Texture.fromImage("js/game/bg-far.png");
  far = new PIXI.Sprite(farTexture);
  far.position.x = 0;
  far.position.y = 0;
  stage.addChild(far);

  var midTexture = PIXI.Texture.fromImage("js/game/bg-mid.png");
  mid = new PIXI.Sprite(midTexture);
  mid.position.x = 0;
  mid.position.y = 128;
  stage.addChild(mid);

  requestAnimationFrame(update);
}

function update(){
  far.position.x -= 0.128;
  mid.position.x -= 0.64;

  renderer.render(stage);

  requestAnimationFrame(update);
}

*/

// ------------------------------------------------------------

function Taiga(){}

Taiga.prototype.Initialize = function(){
  this.textures        = {};
  this.objectContainer = [];
  this.screenWidth     = 800;
  this.screenHeight    = 600;

  this.app = new PIXI.Application(this.screenWidth, this.screenHeight, {backgroundColor : 0x1099bb});
  $("body").prepend(this.app.view);
  // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  this.LoadTextures();
  this.CreatePlanet();
  this.CreateEnemy("enemy1.png", 0.25, -200, -200);
  this.CreateEnemy("enemy2.png", 0.5, -350, -350);
  this.CreateEnemy("enemy3.png", 1.0, -700, -700);
  this.CreateEnemy("enemy4.png", 2.0, -1200, -1200);
  this.CreateEnemy("enemy5.png", 4.0, -2500, -2500);
  this.CreateEnemy("enemy6.png", 6.0, -4000, -4000);
  this.CreateEnemy("enemy7.png", 8.0, -6500, -6500);
  this.CreateEnemy("enemy8.png", 10.0, -8000, -8000);

  window.requestAnimationFrame(this.Update.bind(this));
}

Taiga.prototype.LoadTextures = function(){

  this.LoadTexture("planet.png");
  this.LoadTexture("enemy1.png");
  this.LoadTexture("enemy2.png");
  this.LoadTexture("enemy3.png");
  this.LoadTexture("enemy4.png");
  this.LoadTexture("enemy5.png");
  this.LoadTexture("enemy6.png");
  this.LoadTexture("enemy7.png");
  this.LoadTexture("enemy8.png");
}

Taiga.prototype.LoadTexture = function(textureName){
  // this.textures.push(PIXI.Texture.fromImage(textureName));
  this.textures[textureName] = PIXI.Texture.fromImage(textureName);
}

Taiga.prototype.CreatePlanet = function(){
  var object = new PIXI.Sprite(this.textures["planet.png"]);
  object.interactive = true; // Allow object to respond to mouse and touch events
  object.buttonMode = false; // If the hand cursor appears when you mouse over
  object.anchor.set(0.5);    // Center the anchor point
  object.scale.set(1);       // Scale

  // move the sprite to its designated position
  object.x = 0;
  object.y = 0;

  // Time to setup the events
  // object
  //     .on('pointerdown', onDragStart)
  //     .on('pointerup', onDragEnd)
  //     .on('pointerupoutside', onDragEnd)
  //     .on('pointermove', onDragMove);

      // For mouse-only events
      // .on('mousedown', onDragStart)
      // .on('mouseup', onDragEnd)
      // .on('mouseupoutside', onDragEnd)
      // .on('mousemove', onDragMove);

      // For touch-only events
      // .on('touchstart', onDragStart)
      // .on('touchend', onDragEnd)
      // .on('touchendoutside', onDragEnd)
      // .on('touchmove', onDragMove);


  // Add to the stage
  this.objectContainer.push(object);
  this.app.stage.addChild(object);
}

Taiga.prototype.CreateEnemy = function(tex, scale, x, y){
  // var object = new PIXI.Sprite(this.textures["planet.png"]);
  var object = new PIXI.Sprite(this.textures[tex]);
  object.anchor.set(0.5);    // Center the anchor point
  object.scale.set(scale);   // Scale

  // move the sprite to its designated position
  object.x = x;
  object.y = y;

  // Add to the stage
  this.objectContainer.push(object);
  this.app.stage.addChild(object);
}

Taiga.prototype.Update = function(time){
  this.delta = time - this.then;
  this.then  = time;

  this.app.stage.scale.x *= 0.99;
  this.app.stage.scale.y *= 0.99;
  this.app.stage.position.x = this.screenWidth/2;
  this.app.stage.position.y = this.screenHeight/2;

  // this.app.stage.pivot.x = -screenWidth/2;
  // this.app.stage.pivot.y = -screenHeight/2;


  // for(var i = 0; i < objectContainer.length; i++){
  //   var scale = objectContainer[i].scale._x - .001;
  //   console.log(scale);
  //   objectContainer[i].scale.set(scale);
  // }

  window.requestAnimationFrame(this.Update.bind(this));
}

$(document).ready(function(){
  var taiga = new Taiga();
  taiga.Initialize();
});

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}
