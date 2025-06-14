// === DOM Elements ===
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');
const messages = document.getElementById('messages');
const microphoneDeniedMessage = document.getElementById('microphone-denied-message');
const openSettingsButton = document.getElementById('open-settings-button');

// === Speech Recognition ===
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    const micBtn = document.getElementById('mic');
    micBtn.onclick = () => {
        recognition.start();
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        input.value = text;
        sendBtn.click();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        if (event.error === 'not-allowed') {
            microphoneDeniedMessage.style.display = 'block';
            openSettingsButton.addEventListener('click', () => {
                alert('Please go to your browser settings, find Privacy and Security, then Site Settings (or Permissions), and allow microphone access for this website.');
            });
        } else {
            console.error('Speech recognition other error', event);
            // Handle other types of errors
        }
    };
} else {
    alert('Speech Recognition not supported in your browser.');
}

// === Send Chat Message ===
sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    appendMessage('You', text);
    const res = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    appendMessage('Bot', data.reply);
    animateAvatar(data.reply);
};

function appendMessage(sender, text) {
    const el = document.createElement('div');
    el.textContent = `${sender}: ${text}`;
    messages.appendChild(el);
}

// === Three.js Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('avatar'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
camera.position.z = 2;

// === Load Avatar ===
const loader = new THREE.GLTFLoader();
let avatar;

loader.load(
    'avatar/model.gltf',
    gltf => {
        avatar = gltf.scene;
        scene.add(avatar);
        console.log('Avatar loaded successfully:', avatar);
        console.log('Scene children after adding avatar:', scene.children);
        if (avatar) {
            console.log('Avatar exists and is:', avatar);
             if (avatar.children) {
                console.log('Avatar has children:', avatar.children);
             }
        } else {
            console.log('Avatar is null or undefined!');
        }

        avatar.traverse(obj => {
            if (obj.isMesh && obj.morphTargetInfluences) {
                console.log('Morph Target Mesh Found:', obj.name, obj.morphTargetDictionary);
            }
        });

        animate();
        animateBlink();
        startHeadMovement();
    },
    undefined,
    error => {
        console.error('Error loading avatar:', error);
        if (error) {
             console.log("Full error object:", error)
        }
    }
);

// === Render Loop ===
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// === Avatar Speaking Animation (Enhanced) ===
function animateAvatar(reply) {
    if (!avatar) return;

    const faceMesh = avatar.getObjectByName('Head');
    if (faceMesh && faceMesh.morphTargetInfluences && faceMesh.morphTargetDictionary['mouthOpen']) {
        const mouthOpenIndex = faceMesh.morphTargetDictionary['mouthOpen'];
        const words = reply.split(/\s+/);
        const animationDuration = 150;
        let i = 0;
        let isMouthOpen = false;

        function animateMouth() {
            if (i < words.length * 3) {
                // Open on vowels, close on consonants (simplified)
                const word = words[Math.floor(i / 3)];
                if (i % 3 === 0) {
                  isMouthOpen = word.match(/[aeiouAEIOU]/);
                }
                const intensity = isMouthOpen ? 0.7 : 0;
                faceMesh.morphTargetInfluences[mouthOpenIndex] = intensity;
                setTimeout(animateMouth, animationDuration);
                i++;
            } else {
                faceMesh.morphTargetInfluences[mouthOpenIndex] = 0;
            }
        }
        animateMouth();
    }
}

// === Avatar Blinking Animation ===
function animateBlink() {
    if (!avatar) return;

    const faceMesh = avatar.getObjectByName('Head');
    if (faceMesh && faceMesh.morphTargetInfluences) {
        const blinkLeftIndex = faceMesh.morphTargetDictionary['eyeBlinkLeft'];
        const blinkRightIndex = faceMesh.morphTargetDictionary['eyeBlinkRight'] || blinkLeftIndex;

        if (blinkLeftIndex !== undefined) {
            const blinkDuration = 120;

            function blink() {
                faceMesh.morphTargetInfluences[blinkLeftIndex] = 1;
                if (blinkRightIndex !== undefined) {
                    faceMesh.morphTargetInfluences[blinkRightIndex] = 1;
                }
                setTimeout(() => {
                    faceMesh.morphTargetInfluences[blinkLeftIndex] = 0;
                    if (blinkRightIndex !== undefined) {
                        faceMesh.morphTargetInfluences[blinkRightIndex] = 0;
                    }
                }, blinkDuration);
            }

            setInterval(() => {
                const randomDelay = Math.random() * 6000 + 1500;
                setTimeout(blink, randomDelay);
            }, 5000);
        }
    }
}

// === Avatar Head Movement ===
let headDirection = 1;
let headAngleX = 0;
let headAngleY = 0;
const maxHeadAngle = 0.08;
let isNodding = false;
let nodTimeout;

function updateHeadRotation() {
    if (!avatar) return;
    const head = avatar.getObjectByName('Head');
    if(head) {
        head.rotation.x = headAngleX;
        head.rotation.y = headAngleY;
    }
}

function animateHeadNod() {
    if (!avatar || isNodding) return;

    isNodding = true;
    headDirection = 1;
    headAngleX = 0;

    const nodSpeed = 0.02;
    const nodDuration = 800;

    function nodStep() {
        headAngleX += nodSpeed * headDirection;
        updateHeadRotation();

        if (Math.abs(headAngleX) > maxHeadAngle) {
            headDirection *= -1;
        }

        if (Math.abs(headAngleX) < 0.01 && headDirection === -1) {
            isNodding = false;
            nodTimeout = setTimeout(startHeadMovement, 2000);
        } else {
            setTimeout(nodStep, 50);
        }
    }
    nodStep();
}

function animateHeadLookAround() {
    if (!avatar) return;

    headAngleY += 0.015 * headDirection;
    updateHeadRotation();

    if (headAngleY > maxHeadAngle || headAngleY < -maxHeadAngle) {
        headDirection *= -1;
    }
}


function startHeadMovement() {
    if (nodTimeout) {
      clearTimeout(nodTimeout);
    }
    const randomAction = Math.random();
    if (randomAction < 0.2) {
        animateHeadNod();
    } else {
        setInterval(animateHeadLookAround, 100);
        setTimeout(() => {
            clearInterval(animateHeadLookAround);
            headAngleY = 0;
            updateHeadRotation();
            setTimeout(startHeadMovement, 1000 + Math.random() * 3000);
        }, 2000 + Math.random() * 4000);
    }
}
