//
// TaiGraphics
//

function TaiGraphics( pixiStage, pixiRenderer ){
  this.drawables = [];
  this.pixiStage = pixiStage;
  this.pixiRenderer = pixiRenderer;
}

TaiGraphics.prototype.SpawnDrawable = function( pixiTexture, x = 0, y = 0){
  var drawable = new TaiDrawable( this.pixiStage, pixiTexture, x, y);
  this.drawables.push( drawable );
  return drawable;
}

TaiGraphics.prototype.Update = function(){
  // TODO: Compute the pixel coordinates based on
  // - camera pos/orientatoin
  // - entity's world coords
  // ( For now, treat world coords as pixel coords )
  for( let drawable of this.drawables ){
    pixiSprite = drawable.pixiSprite;
    pixiSprite.position = TaiVec2DToPixiPoint( drawable.entity.position );
  }
}

//
// TaiDrawable
//

function TaiDrawable( pixiStage, pixiTexture, x = 0, y = 0 ){
  var pixiSprite = new PIXI.Sprite( pixiTexture );
  pixiSprite.position = new PIXI.Point( x, y );
  pixiSprite.interactive = false; // Allow object to respond to mouse and touch events
  pixiSprite.buttonMode  = false; // If the hand cursor appears when you mouse over
  pixiSprite.anchor.set(0.5);     // Center the anchor point
  pixiSprite.scale.set(1);        // Scale
  pixiStage.addChild( pixiSprite );
  this.pixiSprite = pixiSprite;
  this.componentName = "Drawable";
}

//
// TaiEntity
//

function TaiEntity(){
  this.position = new TaiVec2D( 0, 0 );
  this.components = [];
}

// Debug stuff: Press the + and - keys to zoom in and out
var keys = {};
$(document).keydown(function(e){
  keys[e.key] = true;
});
$(document).keyup(function(e){
  delete keys[e.key];
});

TaiEntity.prototype.GetComponent = function( componentName ){
  for( let component of this.components ){
    if( component.componentName == componentName ){
      return component;
    }
  }
}

TaiEntity.prototype.AddComponent = function( component ){
  this.components.push( component );
  component.entity = this;
}

//
// Taiga
//

function Taiga(){
  var self             = this;
  this.textures        = {};
  this.objectContainer = [];
  this.objects         = {};
  this.bullets         = [];
  this.bulletIndex     = 0;
  this.pi              = 3.14159
  this.screenWidth     = 800;
  this.screenHeight    = 600;
  this.scalar          = 1;
  this.runningIndex    = 0;
  this.app = new PIXI.Application(
    this.screenWidth,
    this.screenHeight,
    {backgroundColor : 0x000000});
  $("body").prepend(this.app.view);

  this.objectContainer = [];

  // Create systems
  this.graphics = new TaiGraphics( this.app.stage, this.app.renderer );

  // Populate scene
  this.LoadTextures();
  this.CreatePlanet();
  this.CreatePlayer();

  $(document).mousedown(function(e){
    var mousePosX = e.clientX - self.screenWidth/2;
    var mousePosY = e.clientY - self.screenHeight/2;
    self.ShootBullet(mousePosX, mousePosY);
  });

  window.requestAnimationFrame(this.Update.bind(this));
}

Taiga.prototype.CreateEntity = function(){
  var entity = new TaiEntity();
  this.objectContainer.push( entity );
  return entity;
}

Taiga.prototype.LoadTextures = function(){
  for( let textureName of [
    "bullet.png",
    "enemy1.png",
    "enemy_goldfish.png",
    "enemy3.png",
    "enemy4.png",
    "enemy5.png",
    "enemy6.png",
    "enemy7.png",
    "enemy8.png",
    "planet.png",
    "player.png",
    "run0.png",
    "run1.png",
    "run2.png",
    "run3.png",
    "run4.png"
    ] )
  {
    this.LoadTexture( textureName );
  }
}

Taiga.prototype.LoadTexture = function(textureName){
  this.textures[textureName] = PIXI.Texture.fromImage(textureName);
}

Taiga.prototype.CreatePlanet = function(){
  var texture = this.textures["planet.png"];
  var drawable = this.graphics.SpawnDrawable( texture );
  var entity = this.CreateEntity();
  entity.AddComponent( drawable );
  entity.position.x = 0;
  entity.position.y = 0;
}

Taiga.prototype.CreatePlayer = function(){
  var playerData = {};
  playerData.rotSpeed = 0;

  var texture = this.textures["player.png"];
  var drawable = this.graphics.SpawnDrawable( texture );

  var entity = this.CreateEntity();
  entity.AddComponent( drawable );
  entity.position.x = 0;
  entity.position.y = 0;
  entity.playerData = playerData;
  this.objects["player"] = entity;

  var playerFolder = datGUI.addFolder('player');
  playerFolder.add(entity.position, 'x')
    .name( "position.x" )
    .listen();
  playerFolder.add(entity.position, 'y')
    .name( "position.y" )
    .listen();
  playerFolder.add(drawable.pixiSprite, 'rotation')
    .step( TaiToRads( 1 ) )
    .name( 'rotation( radians )' )
    .listen();
  playerFolder.add(playerData, 'rotSpeed')
    .name( "rot speed" )
    .listen();
}

Taiga.prototype.ShootBullet = function(mouseX, mouseY){
  // Calculate the bullet's starting position
  var playerRotation = this.objects["player"].GetComponent( "Drawable" ).pixiSprite.rotation;
  var sin = Math.sin(playerRotation - 1.5708);
  var cos = Math.cos(playerRotation - 1.5708);
  var posX = cos * 100;
  var posY = sin * 100;

  var texture = this.textures["bullet.png"];
  var drawable = this.graphics.SpawnDrawable( texture, posX, posY );
  var entity = this.CreateEntity();
  entity.AddComponent( drawable );
  entity.position.x = posX;
  entity.position.y = posY;

  var angleRadians = Math.atan2(posY - mouseY, posX - mouseX);
  drawable.pixiSprite.rotation = angleRadians;

  this.objects[`bullet${++this.bulletIndex}`] = entity;
  this.bullets.push(`bullet${this.bulletIndex}`);
}

Taiga.prototype.ShootBullet = function(mouseX, mouseY){
  // Calculate the bullet's starting position
  var playerRotation = this.objects["player"].GetComponent( "Drawable" ).pixiSprite.rotation;
  var sin = Math.sin(playerRotation - 1.5708);
  var cos = Math.cos(playerRotation - 1.5708);
  var posX = cos * 100;
  var posY = sin * 100;

  var texture = this.textures["bullet.png"];
  var drawable = this.graphics.SpawnDrawable( texture, posX, posY );
  var entity = this.CreateEntity();
  entity.AddComponent( drawable );
  entity.position.x = posX;
  entity.position.y = posY;

  var angleRadians = Math.atan2(posY - mouseY, posX - mouseX);
  drawable.pixiSprite.rotation = angleRadians;

  this.objects[`bullet${++this.bulletIndex}`] = entity;
  this.bullets.push(`bullet${this.bulletIndex}`);
}

Taiga.prototype.CreateEnemy = function(textureName, scale, x, y){
  var texture = this.textures[textureName];
  var drawable = this.graphics.SpawnDrawable( texture );
  var entity = this.CreateEntity();
  entity.AddComponent( drawable );
  entity.position.x = x;
  entity.position.y = y;
  drawable.pixiSprite.scale.set( scale );
}

Taiga.prototype.Update = function(time){
  this.delta = time - this.then;
  this.then  = time;

  if(typeof keys["z"] !== "undefined"){
    // console.log(this.objectContainer);
    // console.log(this.bullets[0]);
    // console.log(this.objects);
    // console.log(this.bullets);

    // var bulletObjName = this.bullets[0];
    // var bullet = this.objects[bulletObjName];
    // // bullet.position.x += 10;
    // // console.log(bullet);
    // // console.log();
    // bullet.GetComponent( "Drawable" ).pixiSprite.rotation += 1;
  }
  if(typeof keys["x"] !== "undefined"){
    // console.log(this.objects);
  }

  // Bullet logic
  for(var i = 0; i < this.bullets.length; i++){
    var bulletObjName = this.bullets[i];
    var bullet = this.objects[bulletObjName];
    var rotation = bullet.GetComponent( "Drawable" ).pixiSprite.rotation;
    bullet.position.x -= (Math.cos(rotation) * 5);
    bullet.position.y -= (Math.sin(rotation) * 5);
  }

  var player = this.objects["player"];
  var playerData = player.playerData;
  var drawable = player.GetComponent( "Drawable" );
  var pixiSprite = drawable.pixiSprite;

  var targetRotSign = 0;

  var targetDir = new TaiVec2D( 0, 0 );
  if( keys["ArrowLeft"] || keys[ "a" ] )
    targetRotSign -= 1;
  if( keys["ArrowRight"] || keys[ "d" ] )
    targetRotSign += 1;

  if( targetRotSign )
    playerData.rotSpeed = targetRotSign * 0.08;

  if( Math.abs( playerData.rotSpeed ) > 0.01 )
  {
      pixiSprite.rotation += playerData.rotSpeed;
      if( playerData.rotSpeed > 0 )
        pixiSprite.scale.x = 1;
      else
        pixiSprite.scale.x = -1;
      pixiSprite.setTexture(
        this.textures[`run${this.runningIndex++}.png`]);
      if(this.runningIndex == 5)
        this.runningIndex = 0;
      playerData.rotSpeed *= 0.8;
  }else{
    pixiSprite.setTexture(this.textures[ "player.png"]);
  }

  // Center the camera
  this.app.stage.position.x = this.screenWidth/2;
  this.app.stage.position.y = this.screenHeight/2;

  // Game logic
  // for(var i = 0; i < objectContainer.length; i++){
  // }

  this.graphics.Update();
  window.requestAnimationFrame(this.Update.bind(this));
}

var datGUI = null;
$(document).ready(function(){
  datGUI = new dat.GUI;
  new Taiga();
});
