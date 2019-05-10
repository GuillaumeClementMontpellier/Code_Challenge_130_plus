// Coding Challenge 130.1: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130-fourier-transform-drawing.html
// https://youtu.be/MY4luNgGfms

let data;

function preload() {
  data = loadJSON('codingtrain.json');  
}

let x = [];
let y = [];
let fourierX;
let fourierY;
let fourierBig;
let time = 0;
let path = [];

function setup() {
  
  createCanvas(800, 600);
  const skip = 10;
  
  for (let i = 0; i < data.drawing.length; i += skip) {
    x.push(data.drawing[i].x);
    y.push(data.drawing[i].y);
  }
  
  fourierX = dft(x);
  fourierY = dft(y);
  
  fourierBig = concatPivot(fourierX,fourierY);

  fourierX.sort((a, b) => b.amp - a.amp);
  fourierY.sort((a, b) => b.amp - a.amp);
  fourierBig.sort((a, b) => b.amp - a.amp);
}

function concatPivot(fourierX, fourierY){
  
  let fourierBig = fourierX.concat(fourierY);  
  for (let i = fourierX.length; i < (fourierY.length + fourierX.length) ; i++){    
    fourierBig[i].phase += HALF_PI;    
    fourierBig[i].re = fourierBig[i].amp * cos(fourierBig[i].phase);  
    fourierBig[i].im = fourierBig[i].amp * sin(fourierBig[i].phase);  
  }  
  return fourierBig;
}

function epiCycles(x, y, fourier) {  
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase );
    y += radius * sin(freq * time + phase );

    stroke(255,30);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    
    stroke(255,80);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}



function draw() {
  background(0);

  //let vx = epiCycles(width / 2 + 100, 100,  fourierX);
  //let vy = epiCycles(100, height / 2 + 100,  fourierY);    
  
  let v = epiCycles(width / 2, height / 2,  fourierBig);
  
  path.unshift(v);
  //line(vx.x, vx.y, v.x, v.y);
  //line(vy.x, vy.y, v.x, v.y);
  
  for (let i = 0; i < path.length - 1; i++) {
    let alpha = map(i, 0, fourierY.length, 255, 100, true);    
    stroke(255, alpha);    
    line(path[i].x, path[i].y,path[i+1].x, path[i+1].y);
  }

  const dt = TWO_PI / fourierX.length;
  time += dt;

  if (time > TWO_PI) {
    time = 0;
  }
  
  while(path.length > fourierX.length){
    path.pop();
  }

}



