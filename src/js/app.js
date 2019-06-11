import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import { TimelineMax, TimelineLite, TweenMax, TweenLite } from 'gsap';

import Mouse from './mouse';
import Planet from './Planet'

import vertexSun from '../glsl/vertexSun.glsl';
import fragmentSun from '../glsl/fragmentSun.glsl';

import vertexAtmo from '../glsl/vertexAtmo.glsl';
import fragmentAtmo from '../glsl/fragmentAtmo.glsl';
import fragmentStars from '../glsl/fragmentStars.glsl';


import stars from '../img/stars.jpg';

import cloud from '../img/cloud.png'
import lavatile from '../img/sun.jpg'
import earth from '../img/earth.jpg'
import earthBump from '../img/Bump.jpg'
import earthClouds from '../img/Clouds.png'
import earthOceans from '../img/Ocean_Mask.png'
import earthLights from '../img/night_lights_modified.png'

import venus from '../img/venus.jpg'

import mercury from '../img/mercury.jpg'

import mars from '../img/mars.jpg'
import marsBump from '../img/mars-bump.jpg'

import jupiter from '../img/jupiter.jpg'

import saturn from '../img/saturn.jpg'
import saturnRings from '../img/rings.png'

import uranus from '../img/uranus.jpg'

import neptune from '../img/neptune.jpg'


import nospec from '../img/nospec.jpg'


let mouse = new Mouse();

let planets = [];
let selectedPlanetName;


let state = 'solar';

// Renderer
const RENDERER = new THREE.WebGLRenderer({ antialias: true });
RENDERER.setPixelRatio(window.devicePixelRatio);
RENDERER.setSize(window.innerWidth, window.innerHeight);
RENDERER.toneMapping = THREE.ReinhardToneMapping;
RENDERER.shadowMap.enabled = true;
document.querySelector('.container').appendChild(RENDERER.domElement);


// Scene
const SCENE = new THREE.Scene();


// Camera
const CAMERA = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);
CAMERA.position.z = 200;
CAMERA.position.y = 100;
CAMERA.lookAt(0, 0, 0)
CAMERA.aspect = window.innerWidth / window.innerHeight;
CAMERA.updateProjectionMatrix();

const CONTROL = new THREE.OrbitControls(CAMERA, RENDERER.domElement);

let time = 0;

var params = {
  exposure: 1,
  bloomStrength: 1.2,
  bloomThreshold: 0,
  bloomRadius: 1,
  atmoP: 2,
  atmoC: 0.7
};

// COMPOSER
var renderScene = new THREE.RenderPass(SCENE, CAMERA);
var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
bloomPass.renderToScreen = true;
const COMPOSER = new THREE.EffectComposer(RENDERER);
COMPOSER.setSize(window.innerWidth, window.innerHeight);
COMPOSER.addPass(renderScene);
COMPOSER.addPass(bloomPass);


//  Add Light
const light = new THREE.PointLight(0xFFFFFF, 1);
light.position.set(15, 15, 20);
light.castShadow = true;

light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5;       // default
light.shadow.camera.far = 10500

SCENE.add(light);

let textureLoader = new THREE.TextureLoader();

let cloudTexture = textureLoader.load(cloud);
let lavatileTexture = textureLoader.load(lavatile);


cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
lavatileTexture.wrapS = lavatileTexture.wrapT = THREE.RepeatWrapping;


// Add objects
const sunGeometry = new THREE.SphereGeometry(50, 80, 80);
const sunMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexSun,
  fragmentShader: fragmentSun,
  // wireframe: true,
  uniforms: {
    "fogDensity": { value: 0.45 },
    "fogColor": { value: new THREE.Vector3(0, 0, 0) },
    "time": { value: 1.0 },
    "uvScale": { value: new THREE.Vector2(1.0, 1.0) },
    "texture1": { value: cloudTexture },
    "texture2": { value: lavatileTexture }
  }
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
SCENE.add(sun);



let NeptunePlanet = new Planet({
  map: neptune,
  specularMap: nospec,
  specular: 0x4f748e,
  name: 'neptune',


  radius: 12,
  s: Math.random() * 5
})

let NeptunePosition = {
  x: 0,
  y: 0,
  z: 500
}
NeptunePlanet.add2Scene(SCENE, NeptunePosition);
planets.push(NeptunePlanet);



let UranusPlanet = new Planet({
  map: uranus,
  specularMap: nospec,
  specular: 0x4f748e,
  name: 'uranus',


  radius: 10,
  s: Math.random() * 5
})

let UranusPosition = {
  x: 0,
  y: 0,
  z: 420
}
UranusPlanet.add2Scene(SCENE, UranusPosition);
planets.push(UranusPlanet);



let SaturnPlanet = new Planet({
  map: saturn,
  specularMap: nospec,
  specular: 0x4f748e,
  ringsMap: saturnRings,
  name: 'saturn',

  radius: 16,
  s: Math.random() * 5
})

let SaturnPosition = {
  x: 0,
  y: 0,
  z: 350
}
SaturnPlanet.add2Scene(SCENE, SaturnPosition);
planets.push(SaturnPlanet);



let JupiterPlanet = new Planet({
  map: jupiter,
  specularMap: nospec,
  specular: 0x4f748e,
  name: 'jupiter',


  radius: 20,
  s: Math.random() * 5
})

let JupiterPosition = {
  x: 0,
  y: 0,
  z: 250
}
JupiterPlanet.add2Scene(SCENE, JupiterPosition);
planets.push(JupiterPlanet);




let MarsPlanet = new Planet({
  map: mars,
  bumpMap: marsBump,
  specularMap: nospec,
  specular: 0x4f748e,
  atmoColor: 0x331205,
  vertexAtmo: vertexAtmo,
  fragmentAtmo: fragmentAtmo,
  cameraPosition: CAMERA,
  name: 'mars',


  radius: 4,
  s: Math.random() * 5
})

let MarsPosition = {
  x: 0,
  y: 0,
  z: 160
}
MarsPlanet.add2Scene(SCENE, MarsPosition);
planets.push(MarsPlanet);




let EarthPlanet = new Planet({
  map: earth,
  specularMap: earthOceans,
  specular: 0x4f748e,
  bumpMap: earthBump,
  cloudMap: earthClouds,
  lightMap: earthLights,
  atmoColor: 0x0096ff,
  vertexAtmo: vertexAtmo,
  fragmentAtmo: fragmentAtmo,
  cameraPosition: CAMERA,
  name: 'earth',


  radius: 6,
  s: Math.random() * 5
})

let EarthPosition = {
  x: 0,
  y: 0,
  z: 120
}
EarthPlanet.add2Scene(SCENE, EarthPosition);
planets.push(EarthPlanet);



let VenusPlanet = new Planet({
  map: venus,
  specularMap: nospec,
  specular: 0x4f748e,
  atmoColor: 0x2f170a,
  vertexAtmo: vertexAtmo,
  fragmentAtmo: fragmentAtmo,
  cameraPosition: CAMERA,
  name: 'venus',


  radius: 5,
  s: Math.random() * 5
})

let VenusPosition = {
  x: 0,
  y: 0,
  z: 60
}
VenusPlanet.add2Scene(SCENE, VenusPosition);
planets.push(VenusPlanet);



let MercuryPlanet = new Planet({
  map: mercury,
  specularMap: nospec,
  specular: 0x4f748e,
  bumpMap: mercury,
  name: 'mercury',


  radius: 2,
  s: Math.random() * 5
})

let MercuryPosition = {
  x: 0,
  y: 0,
  z: 30
}
MercuryPlanet.add2Scene(SCENE, MercuryPosition);
planets.push(MercuryPlanet);



let starsGeo = new THREE.SphereGeometry(1000, 100, 100);
let starsMat = new THREE.ShaderMaterial({
  extensions: {
    derivatives: '#extension GL_OES_standard_derivatives : enable',
  },
  side: THREE.DoubleSide,
  uniforms: {
    time: { type: 'f', value: 0 }
  },
  vertexShader: vertexSun,
  fragmentShader: fragmentStars,
  transparent: true
});

let startsMesh = new THREE.Mesh(starsGeo, starsMat);
SCENE.add(startsMesh);

console.log(planets);


let selectedObject;

let planetNameElement = document.querySelector('.planet-name');

function onDocumentMouseDown(event) {
  event.preventDefault();


  let intersects = getIntersects(event.layerX, event.layerY);

  if (intersects.length > 0) {
    let res = intersects.filter(function (res) {
      return res && res.object;
    })[0];
    if (res && res.object) {

      if (res.object.parent instanceof THREE.Group) {
        selectedObject = res.object.parent;

        console.log(selectedObject.name);
        planetNameElement.innerHTML = selectedObject.name.toUpperCase();

        selectedPlanetName = selectedObject.name;

        planets.forEach(p => {
          if (p.object.name == selectedPlanetName) {

            let radius = p.object.children[0].geometry.boundingSphere.radius;

            TweenMax.to(CAMERA.position, 1, {
              x: p.object.position.x + radius * 3,
              z: p.object.position.z + radius * 3,
              y: p.object.position.y
            })

            TweenMax.to(CONTROL.target, 1, {
              x: p.object.position.x,
              z: p.object.position.z,
              y: p.object.position.y
            })

            CONTROL.target.x = p.object.position.x;
            CONTROL.target.y = p.object.position.y;
            CONTROL.target.z = p.object.position.z;
          }
        })


      }

    }
  }

}

let raycaster = new THREE.Raycaster();
let mouseVector = new THREE.Vector3();
function getIntersects(x, y) {
  x = (x / window.innerWidth) * 2 - 1;
  y = - (y / window.innerHeight) * 2 + 1;
  mouseVector.set(x, y, 0.5);
  raycaster.setFromCamera(mouseVector, CAMERA);
  return raycaster.intersectObject(SCENE, true);
}

let angle = 0;
CAMERA.position.x = Math.cos(angle) * 150;
CAMERA.position.z = Math.sin(angle) * 150;
CAMERA.lookAt(0, 0, 0);

let look = {
  x: 0,
  y: 0,
  z: 0
}

// Render loop
function render() {
  requestAnimationFrame(render);

  mouse.cumputeInertPos();
  mouse.cumputeMoveSpeed(0.99);

  // if (mouse.position.normalX > 0.5 || mouse.position.normalX < -0.5) {

  //   angle += mouse.position.normalX * mouse.position.normalX * mouse.position.normalX;

  // }

  // CAMERA.position.x = Math.cos(angle / 50) * 150;
    // CAMERA.position.z = Math.sin(angle / 50) * 150;

    
  if (selectedPlanetName) {
    planets.forEach(p => {
      if (p.object.name == selectedPlanetName) {



        TweenLite.to( look, 0.7, {
          x: p.object.position.x,
          y: p.object.position.y,
          z: p.object.position.z
        } )
        
        CAMERA.lookAt(look.x, look.y, look.z);
      }
    })
  } 

    
  time += 1;

  sunMaterial.uniforms.time.value = time / 1000 * 8;
  EarthPlanet.atmo.material.uniforms.viewVector.value =
    new THREE.Vector3().subVectors(CAMERA.position, EarthPlanet.object.position);
  VenusPlanet.atmo.material.uniforms.viewVector.value =
    new THREE.Vector3().subVectors(CAMERA.position, VenusPlanet.object.position);
  MarsPlanet.atmo.material.uniforms.viewVector.value =
    new THREE.Vector3().subVectors(CAMERA.position, MarsPlanet.object.position);

  // EarthPlanet.clouds.rotation.y += 0.001;
  // EarthPlanet.mesh.rotation.y += 0.002;
  // EarthPlanet.lights.rotation.y += 0.002;


  planets.forEach((planet, i) => {

    if (planet.clouds) {
      planet.clouds.rotation.y += 0.001;
    }
    if (planet.lights) {
      planet.lights.rotation.y += 0.002;
       }
    planet.mesh.rotation.y += 0.002;

    planet.object.position.x = Math.cos(time *0 + planet.s) * 70 * (planets.length - i);
    planet.object.position.z = Math.sin(time *0 + planet.s) * 70 * (planets.length - i);

  })

  // earthMesh.rotation.y += 0.002;
  // lightMesh.rotation.y += 0.002;

    CAMERA.updateProjectionMatrix();
    COMPOSER.render(SCENE, CAMERA);
  }

var gui = new dat.GUI();
  gui.add(params, 'exposure', 0.1, 2).onChange(function (value) {
  renderer.toneMappingExposure = Math.pow(value, 4.0);
});
  gui.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
  bloomPass.threshold = Number(value);
});
  gui.add(params, 'bloomStrength', 0.0, 3.0).onChange(function (value) {
  bloomPass.strength = Number(value);
});
  gui.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {
  bloomPass.radius = Number(value);
});
  gui.add(params, 'atmoC', 0.0, 3.0).step(0.01).onChange(function (value) {
  EarthPlanet.atmo.material.uniforms.c.value = value
});
gui.add(params, 'atmoP', 0.0, 3.0).step(0.01).onChange(function (value) {
  EarthPlanet.atmo.material.uniforms.p.value = value
});


render();


  // OnResize
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousedown', onDocumentMouseDown, false);
function onWindowResize() {
  RENDERER.setSize(window.innerWidth, window.innerHeight);
  CAMERA.aspect = window.innerWidth / window.innerHeight;
  COMPOSER.setSize(window.innerWidth, window.innerHeight);
}