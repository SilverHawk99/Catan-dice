const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 10);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 5);
scene.add(light);

// Physics
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Boden
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane()
});
world.addBody(groundBody);

// Sound
const rollSound = new Howl({
  src: ['assets/sounds/dice-roll.mp3']
});

// Würfel-Konfiguration
const diceConfigs = [
  { name: 'standard1', texture: 'standard-die.png' },
  { name: 'standard2', texture: 'standard-die.png' },
  { name: 'pirate', texture: 'pirate-die.png' },
  { name: 'symbol', texture: 'symbol-die.png' },
];

const diceMeshes = [];
const diceBodies = [];

const loader = new THREE.TextureLoader();

function createDice(textureFile, posX) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const tex = loader.load(`assets/textures/${textureFile}`);
  const mat = new THREE.MeshStandardMaterial({ map: tex });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(posX, 5, 0);
  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    position: new CANNON.Vec3(posX, 5, 0)
  });
  world.addBody(body);

  diceMeshes.push(mesh);
  diceBodies.push(body);
}

// Alle Würfel erstellen
diceConfigs.forEach((dice, i) => {
  createDice(dice.texture, (i - 1.5) * 2);
});

function updatePhysics() {
  world.fixedStep();
  for (let i = 0; i < diceMeshes.length; i++) {
    diceMeshes[i].position.copy(diceBodies[i].position);
    diceMeshes[i].quaternion.copy(diceBodies[i].quaternion);
  }
}

function animate() {
  requestAnimationFrame(animate);
  updatePhysics();
  renderer.render(scene, camera);
}
animate();

function rollDice() {
  rollSound.play();
  for (let body of diceBodies) {
    body.velocity.set((Math.random() - 0.5) * 10, 10, (Math.random() - 0.5) * 10);
    body.angularVelocity.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
    body.position.y = 5;
  }
}

document.getElementById('rollButton').addEventListener('click', rollDice);
