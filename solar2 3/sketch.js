let style = ["#000000", "#222222"]

let planets = ["#FFF509", "#A64521", "#D9814E", "#2DBFFF", "#D90718", "#F8E4AF", "#DEB18E", "#329DAD", "#0A4871"];
let highlight = ["#FFFFC4", "#FF4521", "#F0B980", "#0CFFFF", "#FF5500", "#FFFFFF", "#FFF3A2", "#4AE7FF", "#1387D4"];




// global variables

// variables that track pause state and last planet touched
let paused = false;
let keyPause = false;
let startPause = 0;
let endPause = 0;
let curPlanet = [0, 0, 0];
let intVideo


// determine size of each planet
const baseSize = 10;
const sun = 10 * baseSize;
const mercury = baseSize;
const venus = 1.8 * baseSize;
const earth = 2.0 * baseSize;
const mars = 1.3 * baseSize;
const jupiter = 6 * baseSize;
const saturn = 5 * baseSize;
const uranus = 3 * baseSize;
const neptune = 2.9 * baseSize;

// determine orbit distance from sun
const baseOrbit =  150;
const merOrbit = (0.9 * baseOrbit) / 2;
const venOrbit = (1.2 * baseOrbit) / 2;
const earOrbit = (1.55 * baseOrbit) / 2;
const marOrbit = (1.9 * baseOrbit) / 2;
const jupOrbit = (2.7 * baseOrbit) / 2;
const satOrbit = (3.7 * baseOrbit) / 2;
const uraOrbit = (4.6 * baseOrbit) / 2;
const nepOrbit = (5.3 * baseOrbit) / 2;

// determine orbit speed and planet location
let orbitSpeed;
const orbitDuration = 10;
let ang;
let x;
let y;

// image variables
let BG;
let merInfo;
let venInfo;
let earInfo;
let marInfo;
let jupInfo;
let satInfo;
let uraInfo;
let nepInfo;
let sunInfo;

let videoElement;
let maskImage

let sunImg
let intGif


// setup
function preload() {
  BG = loadImage("data/background.jpg");
  sunInfo = loadImage("data/sun.png");
  merInfo = loadImage("data/mercury.png");
  venInfo = loadImage("data/venus.png");
  earInfo = loadImage("data/earth.png");
  marInfo = loadImage("data/mars.png");
  jupInfo = loadImage("data/jupiter.png");
  satInfo = loadImage("data/saturn.png");
  uraInfo = loadImage("data/uranus.png");
  nepInfo = loadImage("data/neptune.png");


  maskImage =loadImage("data/jupiterbg.png")
  sunImg = loadImage("data/sun.jpg")
  merImg = loadImage("data/mercury.jpg")
  venImg = loadImage("data/venus.jpg")
  earImg = loadImage("data/earth.jpg")
  marImg = loadImage("data/mars.jpg")
  jupImg = loadImage("data/jupiter.jpg")
  satImg = loadImage("data/saturn.jpg")
  uraImg = loadImage("data/uranus.jpg")
  nepImg = loadImage("data/neptune.jpg")


  intGif = createImg("data/space.gif")
  
  // intVideo = createVideo(["data/demo.mp4"])
  // intVideo.hide();

  
}




function setup() {

  createCanvas(windowWidth, windowHeight);
  intGif.size(windowWidth,windowHeight)
  intGif.position(0, 0);


//  intVideo.play();
//  imageMode(CENTER);


}


function onVideoLoad() {
  // The media will play as soon as it is loaded.
  videoElement.play();
  videoElement.volume(0);
  videoElement.size(400, 200);
  
  setTimeout(function(){

  },5000)


}



  function draw() {

background(style[0]);


setTimeout(function() {
  intGif.hide();
  }, 5000);

image(BG,0,0)

push();
translate(width / 2, height / 2);

calcSpeed();

// fill(planets[0]);
noFill()
sunImg.mask(maskImage)
image(sunImg, -sun / 2 , -sun/ 2, sun,sun)

if (touchPlanet(0, 0, sun)) {
stroke(highlight[0]);
strokeWeight(2);
ellipse(0, 0, sun, sun);
image(sunInfo, (width - 30) / 2 - 165, 10 - height / 2);
pauseOrbit();
} else {
stroke(style[1]);
strokeWeight(1);
ellipse(0, 0, sun, sun);
}

drawPlanet(merOrbit, 88, mercury, 1, merInfo,merImg);
drawPlanet(venOrbit, 225, venus, 2, venInfo,venImg);
drawPlanet(earOrbit, 365, earth, 3, earInfo,earImg);
drawPlanet(marOrbit, 687, mars, 4, marInfo,marImg);
drawPlanet(jupOrbit, 12 * 365, jupiter, 5, jupInfo,jupImg);
drawPlanet(satOrbit, 29 * 365, saturn, 6, satInfo,satImg);
drawPlanet(uraOrbit, 84 * 365, uranus, 7, uraInfo,uraImg);
drawPlanet(venOrbit, 225, venus, 2, venInfo,venImg);

// check if hovering over any planet
isTouching();

// sets grid back to normal
pop();
}

/*******************************************************
Function that checks for keys released. Specifically
'S'/'s', 'p'/'P', and ENTER/RETURN. Keyboard input
allows user to save a screencap, pause the orbit, and
resume the orbit.
********************************************************/

function keyReleased() {
  // saves screencap
  if (key == 's' || key == 'S') {
    saveFrame("solarsystem.png");
  }

  // toggle planet orbit rotation on/off with 'p' and enter/return
  if (key == 'p' || key == 'P') {
    keyPause = true;
    pauseOrbit();
  }
  if (keyCode === 13) {
    keyPause = false;
    resumeOrbit();
  }
}

/*******************************************************
Function that keeps track of placement of planets
so they resume orbits after a pause in the correct
locations.
********************************************************/
function calcSpeed() {
  if (paused) {
    orbitSpeed = orbitSpeed;
  } else {
    orbitSpeed = millis() - endPause;
  }
}

/*******************************************************
Function that returns true when the mouse hovers over
a planet (or sun), false otherwise. When true, it also
saves the position of the current planet to track when
the mouse stops hovering over it using isTouching().
********************************************************/
function touchPlanet(x, y, planet) {
  let d = dist(mouseX - width/2, mouseY - height/2, x, y);
  if (d < planet/2) {
    curPlanet[0] = x;
    curPlanet[1] = y;
    curPlanet[2] = planet;
    return true;
  }
  return false;
}

/*******************************************************
Function that resumes the orbit when the mouse stops
touching the planet it last touched.
********************************************************/
// tracks when mouse stops touching a planet
function isTouching() {
  if (!touchPlanet(curPlanet[0], curPlanet[1], curPlanet[2]) && !keyPause) {
    resumeOrbit();
  }
}

/*******************************************************
Function that pauses the orbit (movement) of all
planets when called, and saves the current value of
millis() to calculate current position when they
resume.
********************************************************/
function pauseOrbit() {
  if (!paused) {
    startPause = millis();
  }
  paused = true;
}

/*******************************************************
Function that resumes the orbit (movement) of all
planets when called, and calculates the difference
in time from pause to resume.
********************************************************/
// resumes orbit of planets
function resumeOrbit() {
  if (paused) {
    endPause = endPause + (millis() - startPause);
  }
  paused = false;
}

/*******************************************************
Function that sets styles and calculations for each planet and
orbital ring, then draws them.
********************************************************/



// function drawPlanet(orbit, duration, size, planetNum, planetImage) {
//   ang = radians(360 * (frameCount / duration) % 360);
//   x = orbit * cos(ang);
//   y = orbit * sin(ang);
//   fill(planets[planetNum]);
//   if (touchPlanet(x, y, size)) {
//     stroke(highlight[planetNum]);
//     strokeWeight(2);
//     ellipse(x, y, size, size);
//     image(planetImage, x - size / 2, y - size / 2);
//     pauseOrbit();
//   } else {
//     stroke(style[1]);
//     strokeWeight(1);
//     ellipse(x, y, size, size);
//   }
// }



function drawPlanet(orbit, days, planet, c, filename , plImg) {
  // draw the orbital ring
  stroke(style[1]);
  strokeWeight(1);
  noFill();
  ellipse(0, 0, orbit * 2, orbit * 2);

  // calculate orbit position and speed
  let ang = TWO_PI * orbitSpeed / (days * orbitDuration);
  let x = cos(ang) * orbit;
  let y = sin(ang) * orbit;

  // set style of planet
  stroke(style[1]);
  strokeWeight(1);

  // change style if hovering over planet and pauses orbit
  if (touchPlanet(x, y, planet)) {
    stroke(highlight[c]);
    strokeWeight(2);



    // fill(planets[c]);
    // fill(image("jupiterbg.png"))
    plImg.mask(maskImage)
    image(plImg, x - (planet / 2), y- (planet / 2), planet,planet)

    // draw info
    image(filename, (width - 30) / 2 - 165, 10 - height / 2);

    

    pauseOrbit();
  } else {
    // fill(planets[c]);

    plImg.mask(maskImage)
image(plImg, x - (planet / 2), y- (planet / 2), planet,planet)
  }

  // draw the planet
  ellipse(x, y, planet, planet);

}
