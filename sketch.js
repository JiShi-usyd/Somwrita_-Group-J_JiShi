let offsetX = -170;
let offsetY = -400;
let pixelFont;
let pointsPacman = [];
let pointsPiet = [];
let screenSize = 400;
let colors = ['red', 'blue', 'yellow', 'white'];
let rectWidths = [40, 50, 60, 70, 80, 90];
let rectHeights = [30, 40, 50];
let paths = [];
let gameOver = false;// Flag indicating whether the game is over
let pacman = {
  x: 138,
  y: 486,
  dir: 'none'
};// Pacman's current status
let ghosts = []; // Ghost array
let layer; 

function preload() {
  pixelFont = loadFont("assets/pixelFont.TTF");
}

function setup() {
  initializeGhosts(); 
  gameOver = false;
  createCanvas(windowWidth, windowHeight);
  
  noStroke();
  textAlign(CENTER);
  
  push();
  textFont(pixelFont);
  fill(255);
  pixelDensity(2);

  pointsPacman = pixelFont.textToPoints("Pacman", 130 + offsetX, 70, 100, {
    sampleFactor: 0.12,
  });
  pointsPiet = pixelFont.textToPoints("* PIET", 270 + offsetX, 180, 100, {
    sampleFactor: 0.12,
  });
  pop();
  
push();
  layer = createGraphics(screenSize, screenSize);
  layer.stroke(0);
  layer.strokeWeight(4);

  let y = 0;
  while (y < screenSize) {
    let x = 0;
    let h = random(rectHeights);
    if (y + h > screenSize) h = screenSize - y;

    while (x < screenSize) {
      let w = random(rectWidths);
      if (x + w > screenSize) w = screenSize - x;

      layer.fill(random(colors));
      layer.rect(x, y, w, h);
      x += w;
    }
    y += h;
  }
  for(let i= 0; i<4; i++){
    let x2 = i* (screenSize / 4)+ random(-10, 10);
    let w2 = random([40, 50, 60]);

    let y2= 0;
     while(y2 < screenSize){
      let h2 = random(rectHeights);
      if(y2+h2 > screenSize){
       h2 = screenSize - y2;
      }
     layer.fill(random(colors));
     layer.rect(x2, y2, w2, h2);
     y2 += h2;
  }
}
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function initializeGhosts() {
  const spawnPoints = [
    {x: 25, y: 25},   
    {x: 185, y: 25},  
    {x: 265, y: 25},  
    {x: 375, y: 25},  
    {x: 25, y: 105},  
    {x: 265, y: 105}, 
    {x: 105, y: 225}, 
    {x: 285, y: 225}, 
    {x: 25, y: 375},  
    {x: 185, y: 375}, 
    {x: 285, y: 375}, 
    {x: 375, y: 375}  
  ];// Path coordinates where ghosts can be generated

  ghosts = [
    {x: random(spawnPoints).x + 138 + offsetX, y: random(spawnPoints).y + 270, color: color(255, 0, 0), alive: true},
    {x: random(spawnPoints).x + 138 + offsetX, y: random(spawnPoints).y + 270, color: color(255, 100, 0), alive: true},
    {x: random(spawnPoints).x + 138 + offsetX, y: random(spawnPoints).y + 270, color: color(0, 200, 0), alive: true},
    {x: random(spawnPoints).x + 138 + offsetX, y: random(spawnPoints).y + 270, color: color(90, 90, 255), alive: true}
  ];// Generate 4 ghosts of different colors, initially set to alive state
}
function draw() {
  background(255, 250, 205);

  push();
  translate(width / 2, height / 2);
  translate(offsetX, offsetY);

  drawBody();
  drawScreen();
  drawBackground(); 
  setPaths();
  drawPath();
  drawDots();

  movePacman(); // Control Pacman's movement
  checkEatGhosts();// Check if the ghost is eaten and set it to disappear

  drawPixelPacman(pacman.x, pacman.y, color(255, 255, 0)); // pacman
  for (let g of ghosts) {
    if (g.alive) drawPixelGhost(g.x, g.y, g.color);
  }// Draw only living ghosts
  if (gameOver) {
    fill(0, 200, 0, 200);
    rect(138 + offsetX + 100, 270 + 150, 200, 80, 10);
    fill(255);
    textSize(24);
    text("Mission Success!", 138 + offsetX + 200, 270 + 180);
    textSize(16);
    fill(255);
    text("Press R to restart", 138 + offsetX + 200, 270 + 210);
  }// When the game is won, display the success prompt box

  pop();
  fill(255, 255, 255, 200);
  rect(width / 2 - 200, height - 120, 400, 40, 5);
  fill(0);
  textSize(14);
  textAlign(CENTER);
  text("Tip: If stuck, try moving Pacman slightly in different directions", width / 2, height - 95);

}
function keyPressed() {
  if (key === 'w') pacman.dir = 'up';
  else if (key === 's') pacman.dir = 'down';
  else if (key === 'a') pacman.dir = 'left';
  else if (key === 'd') pacman.dir = 'right';

  if (key === 'r' && gameOver) {
    resetGame();
  }
}
function drawBackground() {
  image(layer, 138 + offsetX, 270);
}

function drawScreen() {
  fill(255, 255, 255);
  rect(138 + offsetX, 270, 400, 400);
  let brightness = 255;
  drawNeonText(pointsPacman, brightness);
  drawNeonText(pointsPiet, brightness);
}

function setPaths(){
  paths = [];
  let originalPaths = [
    // horizon paths
    [25, 25, 185, 25],
    [265, 25, 375, 25],
    [25, 105, 265, 105],
    [235, 175, 375, 175],
    [135, 175, 185, 175],
    [105, 225, 285, 225],
    [25, 275, 105, 275],
    [235, 275, 375, 275],
    [25, 375, 185, 375],
    [285, 375, 375, 375],
    // vertical paths
    [25, 25, 25, 105],
    [265, 25, 265, 175],
    [375, 25, 375, 175],
    [185, 25, 185, 105],
    [135, 105, 135, 175],
    [185, 175, 185, 375],
    [235, 175, 235, 275],
    [105, 225, 105, 275],
    [285, 225, 285, 375],
    [25, 275, 25, 375],
    [375, 275, 375, 375]
  ];

  // Convert each group of coordinates into 
  // an object {x1, y1, x2, y2} and store it in paths. 
  for (let p of originalPaths){
    paths.push({ x1: p[0], y1: p[1], x2: p[2], y2: p[3] });
  }
}

function drawPath(){
  stroke(0);
  strokeWeight(25);
  noFill();
  
  //draw all the paths
  for(let p of paths){
    line(p.x1 - 32, p.y1 + 270, p.x2 - 32, p.y2 + 270);
  }
}

function drawDots(){
  let dotSize = 4;
  let dotSpacing = 10;
  fill(255);
  noStroke();

  for (let p of paths){
    let dx = p.x2 - p.x1;
    let dy = p.y2 - p.y1;
    
    // cauculate the paths' length
    let length = dist(p.x1, p.y1, p.x2, p.y2);
    // cauculate the number of dots(get integer)
    let steps = int(length / dotSpacing);

    // draw dots
    for (let i = 0; i <= steps; i++){
      let x = p.x1 + (dx * i) / steps - dotSize / 2;
      let y = p.y1 + (dy * i) / steps - dotSize / 2;
      rect(x - 32, y + 270, dotSize, dotSize);
    }
  }
}
function checkEatGhosts() {
  let allEaten = true;
  for (let g of ghosts) {
    if (g.alive && dist(pacman.x, pacman.y, g.x, g.y) < 16) {
      g.alive = false;//Being eaten
    }
    if (g.alive) allEaten = false;// There are still ghosts alive
  }
  
  if (allEaten) {
    gameOver = true;
  }
}
function color(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}


function drawBody(){
  // black (body)
    fill(0, 0, 0);
  rect(78 + offsetX, -30, 520, 220);
  rect(88 + offsetX, 220, 500, 500);
  rect(68 + offsetX, 200, 540, 10);
  rect(68 + offsetX, -60, 540, 10);
  rect(68 + offsetX, -60, 10, 260);
  rect(598 + offsetX, -60, 10, 260);
  rect(78 + offsetX, 210, 520, 10);
  rect(50 + offsetX, -80, 30, 10);
  rect(598 + offsetX, -80, 30, 10);
  rect(68 + offsetX, -70, 20, 10);
  rect(588 + offsetX, -70, 20, 10);
  rect(42 + offsetX, -70, 8, 280);
  rect(628 + offsetX, -70, 8, 280);
  rect(48 + offsetX, 210, 10, 10);
  rect(618 + offsetX, 210, 10, 10);
  rect(58 + offsetX, 220, 10, 510);
  rect(608 + offsetX, 220, 10, 510);
  rect(50 + offsetX, 730, 8, 20);
  rect(618 + offsetX, 730, 8, 30);
  rect(80 + offsetX, 720, 516, 20);
  rect(50 + offsetX, 730, 8, 30);
  rect(42 + offsetX, 760, 8, 30);
  rect(626 + offsetX, 760, 8, 30);
  rect(34 + offsetX, 790, 8, 30);
  rect(634 + offsetX, 790, 8, 30);
  rect(26 + offsetX, 820, 8, 110);
  rect(642 + offsetX, 820, 8, 110);
  rect(48 + offsetX, 840, 580, 90);
  rect(56 + offsetX, 930, 564, 20);
  rect(72 + offsetX, 950, 532, 20);
  rect(80 + offsetX, 970, 516, 220);

  // dark grey
  fill(62, 58, 57);
  rect(58 + offsetX, 740, 560, 110);

  // light red
  fill(218, 60, 52);
  rect(78 + offsetX, -50, 520, 20);
  rect(50 + offsetX, -70, 20, 270);
  rect(608 + offsetX, -70, 20, 270);
  rect(68 + offsetX, 220, 20, 500);
  rect(588 + offsetX, 220, 20, 500);
  rect(58 + offsetX, 730, 22, 20);
  rect(596 + offsetX, 730, 22, 30);
  rect(68 + offsetX, 720, 12, 10);
  rect(596 + offsetX, 720, 12, 10);
  rect(58 + offsetX, 730, 14, 30);
  rect(50 + offsetX, 760, 14, 30);
  rect(612 + offsetX, 760, 14, 30);
  rect(42 + offsetX, 790, 14, 30);
  rect(620 + offsetX, 790, 14, 30);
  rect(34 + offsetX, 820, 14, 110);
  rect(628 + offsetX, 820, 14, 110);
  rect(58 + offsetX, 970, 22, 220);
  rect(596 + offsetX, 970, 22, 220);
  rect(221 + offsetX, 980, 10, 150);
  rect(431 + offsetX, 980, 10, 150);
  rect(231 + offsetX, 1130, 200, 10);

  // red
  fill(156, 31, 36);
  rect(78 + offsetX, 190, 520, 10);
  rect(62 + offsetX, -70, 8, 270);
  rect(608 + offsetX, -70, 8, 270);
  rect(50 + offsetX, 200, 20, 10);
  rect(608 + offsetX, 200, 20, 10);
  rect(80 + offsetX, 220, 8, 500);
  rect(588 + offsetX, 220, 8, 500);
  rect(34 + offsetX, 930, 14, 20);
  rect(628 + offsetX, 930, 14, 20);
  rect(50 + offsetX, 950, 14, 20);
  rect(612 + offsetX, 950, 14, 20);
  rect(72 + offsetX, 970, 8, 220);
  rect(596 + offsetX, 970, 8, 220);
  rect(58 + offsetX, 970, 14, 50);
  rect(604 + offsetX, 970, 14, 50);
  rect(58 + offsetX, 1170, 14, 20);
  rect(604 + offsetX, 1170, 14, 20);
  rect(221 + offsetX, 1010, 10, 10);
  rect(431 + offsetX, 1010, 10, 10);

  // heavy red
  fill(99, 16, 24);
  rect(58 + offsetX, 210, 20, 10);
  rect(598 + offsetX, 210, 20, 10);
  rect(72 + offsetX, 730, 8, 20);
  rect(596 + offsetX, 730, 8, 20);
  rect(64 + offsetX, 760, 8, 20);
  rect(604 + offsetX, 760, 8, 20);
  rect(56 + offsetX, 790, 8, 20);
  rect(612 + offsetX, 790, 8, 20);
  rect(48 + offsetX, 820, 8, 20);
  rect(620 + offsetX, 820, 8, 20);
  rect(34 + offsetX, 850, 14, 80);
  rect(628 + offsetX, 850, 14, 80);
  rect(48 + offsetX, 930, 14, 20);
  rect(614 + offsetX, 930, 14, 20);
  rect(56 + offsetX, 950, 16, 20);
  rect(604 + offsetX, 950, 16, 20);
  rect(72 + offsetX, 970, 8, 50);
  rect(596 + offsetX, 970, 8, 50);
  rect(231 + offsetX, 970, 200, 10);
  rect(221 + offsetX, 980, 10, 30);
  rect(431 + offsetX, 980, 10, 30);

  // dark grey detail
  fill(62, 58, 57);
  rect(138 + offsetX, 250, 400, 10);
  rect(128 + offsetX, 260, 10, 10);
  rect(538 + offsetX, 260, 10, 10);
  rect(118 + offsetX, 270, 10, 400);
  rect(548 + offsetX, 270, 10, 400);
  rect(128 + offsetX, 670, 10, 10);
  rect(538 + offsetX, 670, 10, 10);
  rect(138 + offsetX, 680, 400, 10);
  rect(88 + offsetX, 720, 500, 10);
  rect(251 + offsetX, 1000, 160, 120);

  // black buttons
  fill(0, 0, 0);
  rect(72 + offsetX, 750, 8, 30);
  rect(596 + offsetX, 750, 8, 30);
  rect(64 + offsetX, 780, 8, 30);
  rect(604 + offsetX, 780, 8, 30);
  rect(56 + offsetX, 810, 8, 30);
  rect(612 + offsetX, 810, 8, 30);
  rect(34 + offsetX, 930, 8, 20);
  rect(634 + offsetX, 930, 8, 20);
  rect(42 + offsetX, 950, 8, 20);
  rect(626 + offsetX, 950, 8, 20);
  rect(50 + offsetX, 970, 8, 220);
  rect(618 + offsetX, 970, 8, 220);
  rect(58 + offsetX, 1190, 38, 20);
  rect(580 + offsetX, 1190, 38, 20);
  rect(372 + offsetX, 1000, 40, 60);
  rect(272 + offsetX, 1052, 40, 40);

  // red button
  fill(0);
  rect(492 + offsetX, 750, 40, 48);
  rect(484 + offsetX, 758, 56, 32);
  rect(500 + offsetX, 742, 24, 64);
  fill(218, 60, 52);
  rect(500 + offsetX, 750, 24, 40);
  rect(492 + offsetX, 758, 40, 24);
  fill(156, 31, 36);
  rect(492 + offsetX, 782, 8, 8);
  rect(524 + offsetX, 782, 8, 8);
  rect(500 + offsetX, 790, 24, 8);
  fill(255);
  rect(500 + offsetX, 758, 8, 8);

  // yellow button
  fill(0);
  rect(412 + offsetX, 770, 40, 48);
  rect(420 + offsetX, 762, 24, 64);
  rect(404 + offsetX, 778, 56, 32);
  fill(255, 215, 0);
  rect(420 + offsetX, 770, 24, 40);
  rect(412 + offsetX, 778, 40, 24);
  fill(255, 165, 0);
  rect(412 + offsetX, 802, 8, 8);
  rect(444 + offsetX, 802, 8, 8);
  rect(420 + offsetX, 810, 24, 8);
  fill(255);
  rect(420 + offsetX, 780, 10, 10);

  // joystick (enlarged 1.5x)
  let scale = 1.5;
  let baseX = 140 + offsetX;
  let baseY = 708;
  fill(0);
  rect(baseX, baseY, 56 * scale, 32 * scale);
  rect(baseX + 8 * scale, baseY + 32 * scale, 40 * scale, 8 * scale);
  rect(baseX + 16 * scale, baseY + 40 * scale, 24 * scale, 30 * scale);
  rect(baseX + 8 * scale, baseY + 54 * scale, 40 * scale, 24 * scale);
  rect(baseX + 16 * scale, baseY + 78 * scale, 24 * scale, 8 * scale);
  rect(baseX, baseY + 62 * scale, 56 * scale, 8 * scale);
  fill(62, 58, 57);
  rect(baseX + 24 * scale, baseY + 48 * scale, 8 * scale, 14 * scale);
  rect(baseX + 16 * scale, baseY + 70 * scale, 24 * scale, 8 * scale);
  rect(baseX + 8 * scale, baseY + 62 * scale, 8 * scale, 8 * scale);
  rect(baseX + 40 * scale, baseY + 62 * scale, 8 * scale, 8 * scale);
  fill(0, 86, 179);
  rect(baseX + 8 * scale, baseY + 14 * scale, 40 * scale, 18 * scale);
  rect(baseX + 16 * scale, baseY + 32 * scale, 24 * scale, 8 * scale);
  fill(0, 123, 255);
  rect(baseX + 16 * scale, baseY - 8 * scale, 24 * scale, 40 * scale);
  rect(baseX + 8 * scale, baseY, 40 * scale, 14 * scale);
  fill(255);
  rect(baseX + 16 * scale, baseY, 8 * scale, 8 * scale); 
}

function drawNeonText(points, brightness, offsetX = 0, offsetY = 0) {
  for (let pt of points) {
    fill(255, 255, 0, brightness);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(255, 255, 0, brightness);
    ellipse(pt.x + offsetX, pt.y + offsetY, 5);
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = color(0, 0, 0, 0);
    noFill();
  }
}


function drawPixelGhost(x, y, bodyColor) {
  const s = 2; // Pixel block size
  
  // 0=transparent，1=body，2=eye-white，3=eye
  let pixels = [
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,2,2,1,1,2,2,1],
    [1,3,2,1,1,3,2,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,1,0,1,1],
    
  ];
  
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      let val = pixels[row][col];
      if (val === 1) fill(bodyColor); 
      else if (val === 2) fill(255); 
      else if (val === 3) fill(0); 
      else continue; 
      rect(x + col * s, y + row * s, s, s);
    }
  }
}

function drawPixelPacman(x, y, bodyColor) {
  const s = 2;

  // 0=transparent，1=body，2=mouth（transparent）
  let pixels = [
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,2,0],
    [1,1,1,1,1,1,1,1,2,2,2,2],
    [1,1,1,1,1,1,2,2,2,2,2,2],
    [1,1,1,1,1,1,1,1,2,2,2,2],
    [0,1,1,1,1,1,1,1,1,1,2,2],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0]
  ];

  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      let val = pixels[row][col];
      if (val === 1) fill(bodyColor); 
      else if (val === 2) fill(0);
      else continue;  
      rect(x + col * s, y + row * s, s, s);
    }
  }
}
function movePacman() {
  if (gameOver) return; 
  let speed = 3;
  
  // Pacman's position inside the screen
  let screenX = pacman.x - (138 + offsetX); // Subtract the x offset of the screen area
  let screenY = pacman.y - 270; // Subtract the y offset of the screen area
  
  // Calculate the next position based on the direction
  if (pacman.dir === 'up') screenY -= speed;
  else if (pacman.dir === 'down') screenY += speed;
  else if (pacman.dir === 'left') screenX -= speed;
  else if (pacman.dir === 'right') screenX += speed;

  // Check if the new position is on the path
  let onPath = false;
  for (let p of paths) {
    // Horizontal path detection
    if (p.y1 === p.y2 && Math.abs(screenY - p.y1) < 15) {
      if (screenX >= Math.min(p.x1, p.x2) - 15 && 
          screenX <= Math.max(p.x1, p.x2) + 15) {
        onPath = true;
        break;
      }
    }
    //Vertical path detection
    else if (p.x1 === p.x2 && Math.abs(screenX - p.x1) < 15) {
      if (screenY >= Math.min(p.y1, p.y2) - 15 && 
          screenY <= Math.max(p.y1, p.y2) + 15) {
        onPath = true;
        break;
      }
    }
  }

  if (onPath || pacman.dir === 'none') {
    pacman.x = screenX + (138 + offsetX);
    pacman.y = screenY + 270;
  }
}
function resetGame() {
  gameOver = false;
  pacman = { x: 138, y: 486, dir: 'none' }; // Reset Pacman position
  initializeGhosts(); // Reset ghost position
}