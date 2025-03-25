import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css';

// Set up scene
const scene = new THREE.Scene();

// Set up camera for third-person view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // Position camera behind and above the character
camera.lookAt(0, 0, 0);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000011); // Dark blue night sky
document.body.appendChild(renderer.domElement);

// Create starry night background
createStarryNight();

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x9090ff, 0.8);
moonLight.position.set(10, 10, 10);
scene.add(moonLight);

// Add point light for better character visibility
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);

// Add moon
const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(40, 30, -100);
scene.add(moon);

// Add ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x336633,
  roughness: 0.8
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);


// Add romantic elements

// Create rose petals
function createRosePetals() {
  const petalGroup = new THREE.Group();
  
  const petalGeometry = new THREE.PlaneGeometry(0.2, 0.4);
  const petalMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFF6B6B, 
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  });
  
  // Create many petals scattered around
  for (let i = 0; i < 30; i++) {
    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
    
    // Random position in a wide area
    petal.position.set(
      (Math.random() - 0.5) * 80,
      Math.random() * 2,
      (Math.random() - 0.5) * 80
    );
    
    // Random rotation
    petal.rotation.x = Math.random() * Math.PI;
    petal.rotation.y = Math.random() * Math.PI;
    petal.rotation.z = Math.random() * Math.PI;
    
    // Store initial position for floating effect
    petal.initialPosition = petal.position.clone();
    petal.floatOffset = Math.random() * Math.PI * 2;
    
    petalGroup.add(petal);
  }
  
  return petalGroup;
}

// Create twinkling fireflies
function createFireflies() {
  const fireflyGroup = new THREE.Group();
  //change for number of firefliws
  for (let i = 0; i < 20; i++) {
    const fireflyGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const fireflyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFF66,
      emissive: 0xFFFF66,
      emissiveIntensity: 2
    });
    
    const firefly = new THREE.Mesh(fireflyGeometry, fireflyMaterial);
    
    // Random position in a wide area
    firefly.position.set(
      (Math.random() - 0.5) * 80,
      Math.random() * 10,
      (Math.random() - 0.5) * 80
    );
    
    // Store initial position for movement
    firefly.initialPosition = firefly.position.clone();
    firefly.floatOffset = Math.random() * Math.PI * 2;
    
    // Add a small point light to each firefly
    const fireflyLight = new THREE.PointLight(0xFFFF66, 1, 5);
    firefly.add(fireflyLight);
    
    fireflyGroup.add(firefly);
  }
  
  return fireflyGroup;
}


function createTrees() {
  const treeGroup = new THREE.Group();
  
  // Different tree types
  const treeTypes = [
    { height: 6, trunkColor: 0x5D4037, leafColor: 0x1B5E20 },   // Tall pine
    { height: 4, trunkColor: 0x6D4C41, leafColor: 0x2E7D32 },   // Medium tree
    { height: 5, trunkColor: 0x4E342E, leafColor: 0x388E3C }    // Slender tree
  ];
  
  // Scatter trees around the scene
  for (let i = 0; i < 15; i++) {
    const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
    
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(
      0.2, // top radius
      0.3, // bottom radius
      treeType.height, 
      16 // radial segments
    );
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
      color: treeType.trunkColor,
      roughness: 0.7
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
    // Leaves/Canopy
    const leafGeometry = new THREE.ConeGeometry(
      1.2, // radius
      treeType.height * 0.6, // height
      16 // radial segments
    );
    const leafMaterial = new THREE.MeshStandardMaterial({ 
      color: treeType.leafColor,
      roughness: 0.5
    });
    const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
    
    // Position trunk and leaves
    trunk.position.y = treeType.height / 2;
    leaves.position.y = treeType.height * 0.8;
    
    // Create tree group
    const tree = new THREE.Group();
    tree.add(trunk);
    tree.add(leaves);
    
    // Randomize position
    tree.position.set(
      (Math.random() - 0.5) * 150, // Wider spread
      0,
      (Math.random() - 0.5) * 150
    );
    
    // Random rotation for natural look
    tree.rotation.y = Math.random() * Math.PI * 2;
    
    // Add slight scale variation
    const scale = 0.7 + Math.random() * 0.6;
    tree.scale.set(scale, scale, scale);
    
    treeGroup.add(tree);
  }
  
  return treeGroup;
}

// Create bushes for ground cover
function createBushes() {
  const bushGroup = new THREE.Group();
  
  // Different bush types
  const bushTypes = [
    { color: 0x2E7D32, size: 0.8 },   // Dark green
    { color: 0x388E3C, size: 0.6 },   // Slightly lighter green
    { color: 0x1B5E20, size: 1.0 }    // Deep forest green
  ];
  
  // Scatter bushes around the scene
  for (let i = 0; i < 30; i++) {
    const bushType = bushTypes[Math.floor(Math.random() * bushTypes.length)];
    
    const bushGeometry = new THREE.SphereGeometry(
      bushType.size, 
      16, 
      16
    );
    const bushMaterial = new THREE.MeshStandardMaterial({ 
      color: bushType.color,
      roughness: 0.7
    });
    
    const bush = new THREE.Mesh(bushGeometry, bushMaterial);
    
    // Randomize position
    bush.position.set(
      (Math.random() - 0.5) * 150, // Wider spread
      bushType.size / 2,
      (Math.random() - 0.5) * 150
    );
    
    // Random rotation for natural look
    bush.rotation.y = Math.random() * Math.PI * 2;
    
    // Add slight scale variation
    const scale = 0.7 + Math.random() * 0.6;
    bush.scale.set(scale, scale, scale);
    
    bushGroup.add(bush);
  }
  
  return bushGroup;
}

// Create mystical glowing stones
function createMysticalStones() {
  const stoneGroup = new THREE.Group();
  
  for (let i = 0; i < 10; i++) {
    // Stone geometry with some irregularity
    const stoneGeometry = new THREE.IcosahedronGeometry(
      0.5 + Math.random() * 0.5, // Random size
      1 // Low detail for a more natural look
    );
    
    // Stone material with slight emissive glow
    const stoneMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080, // Stone gray
      roughness: 0.7,
      emissive: 0x101010, // Slight self-illumination
      emissiveIntensity: 0.2
    });
    
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    
    // Randomize position
    stone.position.set(
      (Math.random() - 0.5) * 120,
      0.3, // Slightly raised
      (Math.random() - 0.5) * 120
    );
    
    // Random rotation for natural look
    stone.rotation.x = Math.random() * Math.PI * 2;
    stone.rotation.y = Math.random() * Math.PI * 2;
    stone.rotation.z = Math.random() * Math.PI * 2;
    
    // Add a small point light near some stones for mystical effect
    if (Math.random() > 0.7) {
      const stoneLight = new THREE.PointLight(0x4444ff, 0.5, 5);
      stoneLight.position.set(
        stone.position.x + (Math.random() - 0.5),
        0.5,
        stone.position.z + (Math.random() - 0.5)
      );
      scene.add(stoneLight);
    }
    
    stoneGroup.add(stone);
  }
  
  return stoneGroup;
}

function createHeartPath() {
  const heartShape = new THREE.Shape();
  
  // Custom heart path drawing
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, 0, -2, 3, 0, 5);
  heartShape.bezierCurveTo(3, 7, 5, 4, 0, 0);
  
  const extrudeSettings = {
    steps: 2,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 2
  };
  
  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  const heartMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFF6B6B,  // Soft romantic red
    transparent: true,
    opacity: 0.7
  });
  
  const heartPath = new THREE.Mesh(heartGeometry, heartMaterial);
  heartPath.rotation.x = Math.PI / 2;  // Lay flat on ground
  heartPath.position.set(0, 0.05, 0);  // Slightly above ground
  
  return heartPath;
}


function createLoveNotes() {
  const notesGroup = new THREE.Group();
  const messages = [
    "Happy Birthday",
    "Aaron is the best"
  ];
  
  messages.forEach((message, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = 340;
    canvas.height = 158;
    const context = canvas.getContext('2d');
    
    // Clear canvas and set background
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text styling
    context.font = 'bold 40px Arial';
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.textAlign = 'center';
    context.fillText(message, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const noteGeometry = new THREE.PlaneGeometry(3, 1.5);
    const noteMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const note = new THREE.Mesh(noteGeometry, noteMaterial);
    
    // Position notes with some randomness and floating effect
    note.position.set(
      (Math.random() - 0.5) * 50,
      3 + Math.sin(index) * 2,  // Floating height
      (Math.random() - 0.5) * 50
    );
    
    note.rotation.y = Math.random() * Math.PI;
    notesGroup.add(note);
  });
  
  return notesGroup;
}

// Particle system for magical fireflies/sparkles
function createRomanticParticles() {
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 200;
  
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200;
    colorArray[i] = Math.random();  // Random color intensity
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  return particlesMesh;
}

// Create additional decorative elements
//const lanterns = createLanterns();
const rosePetals = createRosePetals();
const fireflies = createFireflies();
const trees = createTrees();
const bushes = createBushes();
const mysticalStones = createMysticalStones();
const heartPath = createHeartPath();
const loveNotes = createLoveNotes();

//scene.add(lanterns);
scene.add(rosePetals);
scene.add(fireflies);
scene.add(trees);
scene.add(bushes);
scene.add(mysticalStones);


scene.add(heartPath);
scene.add(loveNotes);


// Character variables
let character;
let mixer;
let characterLoaded = false;
const characterOffset = new THREE.Vector3(0, 0, 0);
let animations = {};
let currentAction = null;
let previousAction = null;

// Camera control variables
let cameraAngleX = 0;
let cameraAngleY = 0.5;
const cameraDistance = 10;
const cameraSensitivity = 0.003;
const cameraYMin = 0.1;
const cameraYMax = Math.PI / 2; // Allow looking fully upward to see fireworks
let isMouseControlActive = false;
let isFirstPersonView = false;
const firstPersonHeight = 1.7; // Approximate eye level height

// Setup mouse control
document.addEventListener('mousemove', onMouseMove);

// Lock pointer for mouse control (on click)
renderer.domElement.addEventListener('click', () => {
  if (!isMouseControlActive) {
    renderer.domElement.requestPointerLock();
  }
});

// Handle pointer lock changes
document.addEventListener('pointerlockchange', () => {
  isMouseControlActive = document.pointerLockElement === renderer.domElement;
});

// Orbit controls - disabled by default but kept for debugging
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.enabled = false; // Disable orbit controls by default
cameraControls.enableDamping = true;
cameraControls.dampingFactor = 0.05;
cameraControls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
cameraControls.minDistance = 5;
cameraControls.maxDistance = 15;

// Mouse movement handler
function onMouseMove(event) {
  if (isMouseControlActive) {
    // Update camera angles based on mouse movement
    cameraAngleX -= event.movementX * cameraSensitivity;
    cameraAngleY -= event.movementY * cameraSensitivity;
    
    // Clamp vertical angle to prevent flipping
    cameraAngleY = Math.max(cameraYMin, Math.min(cameraYMax, cameraAngleY));
  }
}

// Movement variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let characterSpeed = 5;
let rotationSpeed = 3;

// Direction vector for movement
const direction = new THREE.Vector3();

// Key controls for movement
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward = true;
      break;
    case 'KeyA':
      moveLeft = true;
      break;
    case 'KeyS':
      moveBackward = true;
      break;
    case 'KeyD':
      moveRight = true;
      break;
    case 'KeyO': // Debug: Toggle orbit controls
      cameraControls.enabled = !cameraControls.enabled;
      isMouseControlActive = !cameraControls.enabled;
      if (cameraControls.enabled) {
        document.exitPointerLock();
      }
      break;
    case 'KeyE': // Interact with cake
      checkCakeInteraction();
      break;
  }
  
  // Check if we should play the walk animation
  updateCharacterAnimation();
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward = false;
      break;
    case 'KeyA':
      moveLeft = false;
      break;
    case 'KeyS':
      moveBackward = false;
      break;
    case 'KeyD':
      moveRight = false;
      break;
  }
  
  // Check if we should return to idle animation
  updateCharacterAnimation();
});

// Update character animation based on movement state
function updateCharacterAnimation() {
  if (moveForward || moveBackward || moveLeft || moveRight) {
    playAnimation('walk');
  } else {
    playAnimation('idle');
  }
}

// Load the character model
loadCharacterModel();

// Birthday cake variables
let birthdayCake;
let cakeInteractable = false;
let cakeInteracted = false;
let cakeSliced = false;
let cakeInstructionsElement;

// Fireworks setup
const fireworks = [];
let fireworksActive = false;

// Create and add birthday cake
createBirthdayCake();

// Add interaction instructions UI
createInteractionInstructions();

// Main animation loop
const clock = new THREE.Clock();

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create starry night background
function createStarryNight() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1
  });
  
  const starsVertices = [];
  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = Math.random() * 1000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

// Create birthday cake
function createBirthdayCake() {
  // Create cake base
  const cakeBaseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
  const cakeBaseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xF9E076, // Light yellow cake color
    roughness: 0.7
  });
  const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeBaseMaterial);
  
  // Create frosting (slightly larger than the cake)
  const frostingGeometry = new THREE.CylinderGeometry(1.52, 1.52, 0.3, 32);
  const frostingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF, // White frosting
    roughness: 0.5
  });
  const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
  frosting.position.y = 0.65; // Position on top of cake
  
  // Create candles
  const candles = new THREE.Group();
  const candlePositions = [
    { x: 0, y: 0, z: 0 },       // Center
    { x: 0.6, y: 0, z: 0.6 },   // Corner
    { x: -0.6, y: 0, z: 0.6 },  // Corner
    { x: 0.6, y: 0, z: -0.6 },  // Corner
    { x: -0.6, y: 0, z: -0.6 }, // Corner
  ];
  
  // Add candles with flames
  candlePositions.forEach((pos, index) => {
    // Candle stick
    const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
    const candleMaterial = new THREE.MeshStandardMaterial({ 
      color: index % 2 === 0 ? 0xFF4444 : 0x4444FF, // Alternating red and blue
      roughness: 0.5
    });
    const candle = new THREE.Mesh(candleGeometry, candleMaterial);
    candle.position.set(pos.x, pos.y + 0.3, pos.z);
    
    // Flame - using a cone shape
    const flameGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
    const flameMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFF44,
      emissive: 0xFFFF44,
      emissiveIntensity: 1.5
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.y = 0.45; // Position on top of candle
    
    // Add point light for candle glow
    const candleLight = new THREE.PointLight(0xFFFF44, 0.5, 2);
    candleLight.position.y = 0.45;
    
    // Add flame and light to candle
    candle.add(flame);
    candle.add(candleLight);
    
    // Add candle to candles group
    candles.add(candle);
  });
  
  // Position candles on top of frosting
  candles.position.y = 0.8;
  
  // Create cake group and add components
  birthdayCake = new THREE.Group();
  birthdayCake.add(cakeBase);
  birthdayCake.add(frosting);
  birthdayCake.add(candles);
  
  // Position cake in the scene - in front where the moon is visible
  birthdayCake.position.set(10, 0.5, -10); // Position where both cake and sky are visible
  
  // Add the cake to the scene
  scene.add(birthdayCake);
  
  // Add helper for interaction area
  const interactionArea = new THREE.Mesh(
    new THREE.CylinderGeometry(3, 3, 0.1, 32),
    new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      transparent: true,
      opacity: 0.0 // Invisible, just for collision detection
    })
  );
  interactionArea.position.copy(birthdayCake.position);
  interactionArea.position.y = 0.05; // Just above ground
  scene.add(interactionArea);
  
  // Store the interaction area with the cake
  birthdayCake.interactionArea = interactionArea;
}

// Create interaction instructions UI
function createInteractionInstructions() {
  cakeInstructionsElement = document.createElement('div');
  cakeInstructionsElement.id = 'cakeInstructions';
  cakeInstructionsElement.style.position = 'absolute';
  cakeInstructionsElement.style.top = '20px';
  cakeInstructionsElement.style.left = '50%';
  cakeInstructionsElement.style.transform = 'translateX(-50%)';
  cakeInstructionsElement.style.background = 'rgba(0, 0, 0, 0.5)';
  cakeInstructionsElement.style.color = 'white';
  cakeInstructionsElement.style.padding = '10px 20px';
  cakeInstructionsElement.style.borderRadius = '5px';
  cakeInstructionsElement.style.display = 'none';
  cakeInstructionsElement.textContent = 'Press E to cut the cake';
  document.body.appendChild(cakeInstructionsElement);
  
  // Create birthday message element (hidden initially)
  const birthdayMessage = document.createElement('div');
  birthdayMessage.id = 'message';
  birthdayMessage.style.position = 'absolute';
  birthdayMessage.style.top = '50%';
  birthdayMessage.style.left = '50%';
  birthdayMessage.style.transform = 'translate(-50%, -50%)';
  birthdayMessage.style.color = '#ff44ff';
  birthdayMessage.style.fontFamily = 'Arial, sans-serif';
  birthdayMessage.style.fontSize = '3.5rem';
  birthdayMessage.style.fontWeight = 'bold';
  birthdayMessage.style.textAlign = 'center';
  birthdayMessage.style.textShadow = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px rgb(180, 20, 180)';
  birthdayMessage.style.opacity = '0';
  birthdayMessage.style.transition = 'opacity 2s';
  birthdayMessage.style.pointerEvents = 'none';
  birthdayMessage.innerHTML = 'Happy Birthday ENZOOOO!';
  document.body.appendChild(birthdayMessage);
}

// Check if player is close enough to interact with cake
function checkCakeInteraction() {
  if (!cakeInteracted && cakeInteractable) {
    cakeInteracted = true;
    startFireworks();
    
    // Hide instructions
    cakeInstructionsElement.style.display = 'none';
  }
}


// Load the character model
function loadCharacterModel() {
  // Add a placeholder while the model loads
  const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
  const material = new THREE.MeshBasicMaterial({ color: 0xff69b4, wireframe: true });
  character = new THREE.Mesh(geometry, material);
  character.position.set(0, 0.5, 0);
  scene.add(character);
  
  // Show loading message
  console.log("Loading character model...");
  
  const loader = new GLTFLoader();
  
  // Load your character.glb file
  loader.load('assets/character.glb', (gltf) => {
    console.log("Character model loaded successfully!");
    
    // Remove placeholder
    scene.remove(character);
    
    // Set the loaded model as character
    character = gltf.scene;
    
    // Adjust model scale and position
    character.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
    character.position.set(0, 0, 0);
    
    // Center the model if needed
    const box = new THREE.Box3().setFromObject(character);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Move model to stand on the ground
    character.position.y = size.y / 2;
    
    // Rotate character 180 degrees to face forward
    character.rotation.y = Math.PI;
    
    scene.add(character);
    characterLoaded = true;
    
    // Log model information for debugging
    console.log("Model hierarchy:");
    logModelHierarchy(character);
    
    // Setup animations if available
    if (gltf.animations && gltf.animations.length > 0) {
      console.log(`Found ${gltf.animations.length} animations in the model`);
      setupAnimations(gltf.animations);
    } else {
      console.warn("No animations found in the model");
      // Create a manual animation if none exist
      createFallbackAnimations();
    }
    
    // After model loads, position camera properly
    camera.position.set(
      character.position.x,
      character.position.y + 5,
      character.position.z + 10
    );
    camera.lookAt(character.position);
  }, 
  // Progress callback
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // Error callback
  (error) => {
    console.error('Error loading the character model:', error);
    alert('Error loading character model. Check console for details.');
  });
}

// Setup animations
function setupAnimations(animationClips) {
  if (!animationClips || animationClips.length === 0) {
    console.error("No animations found in the model");
    return;
  }
  
  mixer = new THREE.AnimationMixer(character);
  
  // Log available animations for debugging
  console.log(`Model has ${animationClips.length} animations:`);
  animationClips.forEach((clip, index) => {
    console.log(`Animation ${index}: ${clip.name}`);
  });
  
  // Map animations by name or index
  animations = {};
  
  // Create a more extensive list of potential animation names to match
  const idleKeywords = ['idle', 'stand', 'wait', 'stationary', 'rest'];
  const walkKeywords = ['walk', 'run', 'move', 'pace', 'stride', 'jog'];
  
  // Try to find animations by name (case insensitive)
  const idleAnimation = animationClips.find(clip => 
    idleKeywords.some(keyword => clip.name.toLowerCase().includes(keyword))
  );
  
  const walkAnimation = animationClips.find(clip => 
    walkKeywords.some(keyword => clip.name.toLowerCase().includes(keyword))
  );
  
  // If found by name, use them
  if (idleAnimation) {
    console.log(`Found idle animation: ${idleAnimation.name}`);
    animations.idle = mixer.clipAction(idleAnimation);
  } else {
    // Otherwise use the first animation as idle
    console.log("No idle animation found by name, using first animation");
    animations.idle = mixer.clipAction(animationClips[0]);
  }
  
  if (walkAnimation) {
    console.log(`Found walk animation: ${walkAnimation.name}`);
    animations.walk = mixer.clipAction(walkAnimation);
  } else if (animationClips.length > 1) {
    // Use second animation as walk if available
    console.log("No walk animation found by name, using second animation");
    animations.walk = mixer.clipAction(animationClips[1]);
  } else {
    // If only one animation exists, modify it for walk
    console.log("Using idle animation modified for walk");
    animations.walk = mixer.clipAction(animationClips[0]);
    animations.walk.timeScale = 1.5; // Make it slightly faster than idle
  }
  
  // Add a fallback animation if all else fails
  if (!animations.idle && !animations.walk && animationClips.length > 0) {
    console.log("Using fallback animations");
    animations.idle = mixer.clipAction(animationClips[0]);
    animations.walk = mixer.clipAction(animationClips[0]);
    animations.walk.timeScale = 1.5;
  }
  
  // Initialize the animations with proper settings
  for (const name in animations) {
    if (animations[name]) {
      animations[name].reset();
      animations[name].clampWhenFinished = false;
      animations[name].setLoop(THREE.LoopRepeat);
      animations[name].enabled = true;
    }
  }
  
  // Start with idle animation
  playAnimation('idle');
}

// Improved animation transition function
function playAnimation(name) {
  if (!mixer || !animations || !animations[name]) {
    console.warn(`Cannot play animation: ${name} - not available`);
    return;
  }
  
  if (currentAction === name) {
    return; // Already playing this animation
  }
  
  // Set references for the animation transition
  previousAction = currentAction;
  currentAction = name;
  
  // Get the actual animation actions
  const toPlay = animations[name];
  const toCrossFadeFrom = previousAction ? animations[previousAction] : null;
  
  // Extra validation to avoid errors
  if (!toPlay) {
    console.error(`Animation ${name} exists in map but action is null`);
    return;
  }
  
  // Enable and play the new animation
  toPlay.enabled = true;
  toPlay.setEffectiveTimeScale(1);
  toPlay.setEffectiveWeight(1);
  
  // If we have a previous animation, crossfade from it
  if (toCrossFadeFrom && toCrossFadeFrom !== toPlay) {
    // Start the new animation
    toPlay.time = 0;
    toPlay.play();
    
    // Create a smooth crossfade (0.5 seconds)
    toCrossFadeFrom.crossFadeTo(toPlay, 0.5, true);
  } else {
    // No previous animation, just play the new one
    toPlay.fadeIn(0.5);
    toPlay.play();
  }
  
  console.log(`Playing animation: ${name}`);
}

// Helper function to log the model hierarchy for debugging
function logModelHierarchy(object, indent = 0) {
  const space = ' '.repeat(indent * 2);
  console.log(`${space}${object.name || 'unnamed'} [${object.type}]`);
  
  if (object.children && object.children.length > 0) {
    object.children.forEach(child => {
      logModelHierarchy(child, indent + 1);
    });
  }
}

// Create fallback animations if the model has none
function createFallbackAnimations() {
  console.log("Creating fallback animations");
  
  // Create a simple animation mixer
  mixer = new THREE.AnimationMixer(character);
  
  // Create tracks for a simple up/down motion
  const times = [0, 1, 2]; // keyframe times
  const positions = [0, 0.1, 0]; // y-position values for idle bounce
  
  // Create a keyframe track
  const positionKF = new THREE.KeyframeTrack(
    '.position[y]', // property path
    times,          // times
    positions       // values
  );
  
  // Create an animation clip
  const idleClip = new THREE.AnimationClip('idle', 2, [positionKF]);
  
  // Create faster, higher bounce for walk
  const walkTimes = [0, 0.5, 1]; // faster keyframes
  const walkPositions = [0, 0.2, 0]; // higher bounce
  
  const walkPositionKF = new THREE.KeyframeTrack(
    '.position[y]', // property path
    walkTimes,      // times
    walkPositions   // values
  );
  
  const walkClip = new THREE.AnimationClip('walk', 1, [walkPositionKF]);
  
  // Create the animation actions
  animations = {
    idle: mixer.clipAction(idleClip),
    walk: mixer.clipAction(walkClip)
  };
  
  // Initialize the animations
  for (const name in animations) {
    animations[name].reset();
    animations[name].clampWhenFinished = false;
    animations[name].setLoop(THREE.LoopRepeat);
  }
  
  // Start with idle animation
  playAnimation('idle');
}

// Create a firework
function createFirework() {
  const colors = [
    0xff1a1a, // Bright red
    0x33ff33, // Bright green
    0x3333ff, // Bright blue
    0xffff00, // Yellow
    0xff33ff, // Magenta
    0x00ffff, // Cyan
    0xff9900, // Orange
    0xff66b2, // Pink
    0x9900ff, // Purple
    0xffdd00, // Gold
    0x00ff99, // Mint
    0xee82ee  // Violet
  ];
  
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const particles = [];
  const geometry = new THREE.SphereGeometry(0.25, 12, 12); // Bigger, more detailed shell
  const material = new THREE.MeshBasicMaterial({ 
    color: color,
    emissive: color,
    emissiveIntensity: 2.5 // Increased glow intensity
  });
  
  // Calculate random position in a wider area
  // Make fireworks appear in a wider area surrounding the cake and moon
  const angle = Math.random() * Math.PI * 2; // Random angle
  const distance = 30 + Math.random() * 40; // Increased distance range
  const heightVariation = Math.random() * 20; // Add height variation
  
  // Calculate position based on angle and distance (radial distribution)
  const x = birthdayCake.position.x + Math.cos(angle) * distance;
  const z = birthdayCake.position.z + Math.sin(angle) * distance;
  
  // Create the firework shell
  const shell = new THREE.Mesh(geometry, material);
  shell.position.set(x, 0, z);
  
  // Add a point light to the shell for extra glow
  const pointLight = new THREE.PointLight(color, 3, 15); // Brighter light with longer range
  shell.add(pointLight);
  
  scene.add(shell);
  
  // Launch properties 
  const launchVelocity = new THREE.Vector3(0, 15 + Math.random() * 7, 0); // More varied launch speed
  const explosionHeight = 15 + Math.random() * 20 + heightVariation; // More height variation
  
  // Store firework properties
  fireworks.push({
    shell: shell,
    velocity: launchVelocity,
    explosionHeight: explosionHeight,
    exploded: false,
    particles: particles,
    color: color,
    creationTime: Date.now(),
    light: pointLight,
    type: Math.floor(Math.random() * 5) // Different explosion patterns (0-4)
  });
}

function explodeFirework(firework) {
  // Remove the shell
  scene.remove(firework.shell);
  
  // Create explosion light
  const explosionLight = new THREE.PointLight(firework.color, 8, 50); // Much brighter with longer range
  explosionLight.position.copy(firework.shell.position);
  scene.add(explosionLight);
  
  // Add the light to the firework object for cleanup later
  firework.explosionLight = explosionLight;
  
  // Create particles
  const particleCount = 150 + Math.floor(Math.random() * 150); // Many more particles
  const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8); // Bigger particles
  
  // Choose pattern based on firework type
  const explosionType = firework.type || 0;
  
  for (let i = 0; i < particleCount; i++) {
    // Color variations - sometimes use complementary colors
    let particleColor;
    if (Math.random() > 0.7) {
      // White sparks for contrast
      particleColor = 0xffffff;
    } else if (Math.random() > 0.8) {
      // Complementary color
      particleColor = 0xffffff - firework.color;
    } else {
      // Main color
      particleColor = firework.color;
    }
    
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: particleColor,
      transparent: true,
      opacity: 1,
      emissive: particleColor,
      emissiveIntensity: 2.0
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(firework.shell.position);
    
    // Random direction for each particle based on explosion type
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    // Create varied explosion patterns
    let speed;
    
    switch (explosionType) {
      case 0: // Spherical pattern
        speed = 7 + Math.random() * 5;
        particle.velocity = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        ).multiplyScalar(speed);
        break;
        
      case 1: // Ring pattern
        speed = 8 + Math.random() * 4;
        particle.velocity = new THREE.Vector3(
          Math.cos(theta),
          (Math.random() - 0.5) * 0.5, // Flatter ring
          Math.sin(theta)
        ).multiplyScalar(speed);
        break;
        
      case 2: // Double ring pattern
        speed = 8 + Math.random() * 4;
        if (Math.random() > 0.5) {
          particle.velocity = new THREE.Vector3(
            Math.cos(theta),
            0.1 + Math.random() * 0.4, // Upper ring
            Math.sin(theta)
          ).multiplyScalar(speed);
        } else {
          particle.velocity = new THREE.Vector3(
            Math.cos(theta),
            -0.1 - Math.random() * 0.4, // Lower ring
            Math.sin(theta)
          ).multiplyScalar(speed);
        }
        break;
        
      case 3: // Heart shape
        speed = 7 + Math.random() * 3;
        const t = theta;
        // Heart parametric equation
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        particle.velocity = new THREE.Vector3(
          x,
          y,
          (Math.random() - 0.5) * 2 // Add some depth
        ).normalize().multiplyScalar(speed * (0.5 + Math.random() * 0.5));
        break;
        
      case 4: // Spiral pattern
        speed = 6 + Math.random() * 4;
        const spiralAngle = i * 0.15; // Create a spiral pattern
        particle.velocity = new THREE.Vector3(
          Math.cos(spiralAngle) * (1 + i/particleCount),
          (i / particleCount) * 2, // Gradually rise up
          Math.sin(spiralAngle) * (1 + i/particleCount)
        ).normalize().multiplyScalar(speed);
        break;
    }
    
    // Add "trail" effect to some particles
    if (Math.random() > 0.7) {
      particle.isTrail = true;
      particle.trailInterval = 0.05;
      particle.trailTimer = 0;
      particle.trailCount = 0;
      particle.maxTrails = 5 + Math.floor(Math.random() * 10);
      particle.trails = [];
    }
    
    // Add gravity effect to particle
    particle.gravity = new THREE.Vector3(0, -0.15 - Math.random() * 0.1, 0);
    
    // Add fade out effect with some variety
    particle.fadeRate = 0.97 + Math.random() * 0.02;
    
    // Add to scene and tracking array
    scene.add(particle);
    firework.particles.push(particle);
  }
  
  // Set as exploded
  firework.exploded = true;
  
  // Show birthday message
  if (!firework.messageShown) {
    const message = document.getElementById('message');
    message.style.opacity = '1';
    
    // Hide message after 5 seconds
    setTimeout(() => {
      message.style.opacity = '0';
    }, 5000);
    
    firework.messageShown = true;
  }
}

// Start fireworks display when cake is interacted with
function startFireworks() {
  fireworksActive = true;
  
  // Show birthday message
  const message = document.getElementById('message');
  message.style.opacity = '1';
  
  // Hide message after 5 seconds
  setTimeout(() => {
    message.style.opacity = '0';
  }, 5000);
  
  // Start immediately with fewer fireworks
  for (let i = 0; i < 5; i++) { // Reduced from 10 to 3
    setTimeout(() => {
      createFirework();
    }, i * 230); // Increased interval between initial fireworks
  }
  
  // Continue launching fireworks every 2-4 seconds (less frequent)
  const launchInterval = setInterval(() => {
    if (fireworksActive) {
      // Launch 1-2 fireworks at once for a less intense display
      const count = 1 + Math.floor(Math.random() * 3); // Reduced from 2-5 to 1-2
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          createFirework();
        }, i * 250); // Increased interval between fireworks in each batch
      }
    } else {
      clearInterval(launchInterval);
    }
  }, 2000 + Math.random() * 2000); // Increased interval between batches
  
  // End the fireworks show after 30 seconds (shorter show)
  setTimeout(() => {
    fireworksActive = false;
  }, 30000); // Reduced from 45 seconds to 30 seconds
}

// Update fireworks in animation loop
function updateFireworks(deltaTime) {
  // Process each firework
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const firework = fireworks[i];
    
    if (!firework.exploded) {
      // Update shell position
      firework.shell.position.add(firework.velocity.clone().multiplyScalar(deltaTime));
      
      // Apply gravity to velocity
      firework.velocity.y -= 9.8 * deltaTime;
      
      // Add trail effect to rising shells
      if (Math.random() > 0.7) {
        const trailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({
          color: firework.color,
          transparent: true,
          opacity: 0.7
        });
        
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.position.copy(firework.shell.position);
        trail.scale.y = 1.5; // Stretch vertically for motion blur effect
        scene.add(trail);
        
        // Add to scene with automatic cleanup
        setTimeout(() => {
          scene.remove(trail);
        }, 800);
      }
      
      // Check if reached explosion height
      if (firework.shell.position.y >= firework.explosionHeight || 
          firework.velocity.y < 0.5) { // Also explode if velocity gets too low
        explodeFirework(firework);
      }
    } else {
      // Update exploded particles
      let allParticlesDead = true;
      
      for (let j = firework.particles.length - 1; j >= 0; j--) {
        const particle = firework.particles[j];
        
        // Update particle position
        particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
        
        // Apply gravity with some variation
        particle.velocity.add(particle.gravity);
        
        // Handle trail particles
        if (particle.isTrail) {
          particle.trailTimer += deltaTime;
          
          if (particle.trailTimer > particle.trailInterval && particle.trailCount < particle.maxTrails) {
            // Create trail particle
            const trailGeometry = new THREE.SphereGeometry(0.07, 8, 8);
            const trailMaterial = new THREE.MeshBasicMaterial({
              color: particle.material.color,
              transparent: true,
              opacity: 0.7
            });
            
            const trail = new THREE.Mesh(trailGeometry, trailMaterial);
            trail.position.copy(particle.position);
            trail.material.opacity = 0.7;
            trail.fadeRate = 0.92;
            scene.add(trail);
            particle.trails.push(trail);
            
            particle.trailTimer = 0;
            particle.trailCount++;
          }
          
          // Update existing trails
          for (let k = particle.trails.length - 1; k >= 0; k--) {
            const trail = particle.trails[k];
            trail.material.opacity *= trail.fadeRate;
            
            if (trail.material.opacity < 0.01) {
              scene.remove(trail);
              particle.trails.splice(k, 1);
            }
          }
        }
        
        // Fade out
        particle.material.opacity *= particle.fadeRate;
        
        // Remove dead particles
        if (particle.material.opacity < 0.01 || particle.position.y < 0) {
          // Remove any remaining trails
          if (particle.trails) {
            particle.trails.forEach(trail => scene.remove(trail));
          }
          
          scene.remove(particle);
          firework.particles.splice(j, 1);
        } else {
          allParticlesDead = false;
        }
      }
      
      // Fade out explosion light
      if (firework.explosionLight) {
        firework.explosionLight.intensity *= 0.95;
        if (firework.explosionLight.intensity < 0.1) {
          scene.remove(firework.explosionLight);
          firework.explosionLight = null;
        }
      }
      
      // Remove firework if all particles are gone
      if (allParticlesDead && !firework.explosionLight) {
        fireworks.splice(i, 1);
      }
    }
  }
}

// MAIN ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  const time = Date.now() * 0.001;
  
  // Update animations
  if (mixer) {
    mixer.update(deltaTime);
  }
  
  // Update fireworks
  updateFireworks(deltaTime);

    /* Floating effect for lanterns
  lanterns.children.forEach(child => {
    if (child.type === 'Mesh') {
      child.position.y = child.position.y + Math.sin(time + child.floatOffset) * 0.01;
    }
  });*/
  
  // Floating effect for rose petals
  rosePetals.children.forEach(petal => {
    petal.position.x = petal.initialPosition.x + Math.sin(time + petal.floatOffset) * 0.1;
    petal.position.y = petal.initialPosition.y + Math.cos(time + petal.floatOffset) * 0.05;
    petal.position.z = petal.initialPosition.z + Math.sin(time + petal.floatOffset) * 0.1;
  });
  
  // Firefly movement
  fireflies.children.forEach(firefly => {
    firefly.position.x = firefly.initialPosition.x + Math.sin(time + firefly.floatOffset) * 0.2;
    firefly.position.y = firefly.initialPosition.y + Math.cos(time + firefly.floatOffset) * 0.1;
    firefly.position.z = firefly.initialPosition.z + Math.sin(time + firefly.floatOffset) * 0.2;
    
    // Twinkling effect
    if (firefly.children[0]) {
      firefly.children[0].intensity = 1 + Math.sin(time * 5 + firefly.floatOffset) * 0.5;
    }
  });
  
  // Check if near the cake for interaction
  if (characterLoaded && birthdayCake) {
    const distanceToCake = character.position.distanceTo(
      new THREE.Vector3(
        birthdayCake.position.x,
        character.position.y,
        birthdayCake.position.z
      )
    );
    
    // Enable interaction when within 3 units of cake
    cakeInteractable = distanceToCake < 3;
    
    // Show/hide interaction instructions
    if (cakeInteractable && !cakeInteracted) {
      cakeInstructionsElement.style.display = 'block';
    } else {
      cakeInstructionsElement.style.display = 'none';
    }
  }
  
  // Handle character movement
  if (characterLoaded) {
    // Reset direction vector
    direction.set(0, 0, 0);
    
    // Calculate forward direction based on camera angle
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraAngleX);
    
    // Calculate right direction from forward direction
    const rightDirection = new THREE.Vector3(1, 0, 0);
    rightDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraAngleX);
    
    // Add movement based on keys pressed
    if (moveForward) direction.add(cameraDirection);
    if (moveBackward) direction.sub(cameraDirection);
    if (moveLeft) direction.sub(rightDirection);
    if (moveRight) direction.add(rightDirection);
    
    // Normalize direction vector to maintain consistent speed
    if (direction.length() > 0) {
      direction.normalize();
      
      // Calculate desired character rotation
      const targetRotation = Math.atan2(direction.x, direction.z);
      
      // Smoothly rotate character
      character.rotation.y = THREE.MathUtils.lerp(
        character.rotation.y,
        targetRotation,
        rotationSpeed * deltaTime
      );
      
      // Move character
      const moveDistance = characterSpeed * deltaTime;
      character.position.add(direction.multiplyScalar(moveDistance));
      
      // Keep character on the ground
      character.position.y = 0;
    }
    
    // Update camera position and orientation for third-person view
    if (!cameraControls.enabled) {
      if (!isFirstPersonView) {
        // Third-person camera positioning
        const cameraOffset = new THREE.Vector3(
          Math.sin(cameraAngleX) * cameraDistance * Math.cos(cameraAngleY),
          Math.sin(cameraAngleY) * cameraDistance,
          Math.cos(cameraAngleX) * cameraDistance * Math.cos(cameraAngleY)
        );
        
        camera.position.copy(character.position).add(cameraOffset);
        camera.lookAt(character.position.clone().add(new THREE.Vector3(0, 1, 0)));
      } else {
        // First-person camera positioning (from character's perspective)
        const headPosition = character.position.clone().add(new THREE.Vector3(0, firstPersonHeight, 0));
        camera.position.copy(headPosition);
        
        const lookDirection = new THREE.Vector3(
          Math.sin(cameraAngleX) * Math.cos(cameraAngleY),
          Math.sin(cameraAngleY),
          Math.cos(cameraAngleX) * Math.cos(cameraAngleY)
        );
        
        camera.lookAt(headPosition.add(lookDirection));
      }
    }
  }
  
  // Render the scene
  renderer.render(scene, camera);
}

// Toggle view mode (first person / third person)
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyV') {
    isFirstPersonView = !isFirstPersonView;
    console.log(`Switched to ${isFirstPersonView ? 'first-person' : 'third-person'} view`);
  }
});

// Add instructional text at the start
const initialInstructions = document.createElement('div');
initialInstructions.style.position = 'absolute';
initialInstructions.style.bottom = '20px';
initialInstructions.style.left = '20px';
initialInstructions.style.color = 'white';
initialInstructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
initialInstructions.style.padding = '10px';
initialInstructions.style.borderRadius = '5px';
initialInstructions.style.fontFamily = 'Arial, sans-serif';
initialInstructions.innerHTML = `
  <h3>Controls (for lolos):</h3>
  <p>WASD - Move character</p>
  <p>Mouse - Look around (click to enable)</p>
  <p>E - Interact with cake</p>
  <p><strong>Make sure to look at the moon ;)<strong></p>
  <p>Also if anything goes wrong, dw just CTLR+R (refresh)</p>

`;
document.body.appendChild(initialInstructions);

// Hide instructions after 10 seconds
setTimeout(() => {
  initialInstructions.style.opacity = '0';
  initialInstructions.style.transition = 'opacity 2s';
  
  // Remove from DOM after fade out
  setTimeout(() => {
    document.body.removeChild(initialInstructions);
  }, 2000);
}, 10000);