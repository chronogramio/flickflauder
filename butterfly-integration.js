import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Check WebGL support
function hasWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
        return false;
    }
}

// Initialize 3D Butterfly
function init3DButterfly() {
    if (!hasWebGLSupport()) {
        console.log('WebGL not supported, using SVG fallback');
        return;
    }

    // Mark body as having 3D butterfly active
    document.body.classList.add('butterfly-3d-active');

    // Hide the HTML text version
    const logoTitle = document.querySelector('.logo-title');
    if (logoTitle) {
        logoTitle.style.opacity = '0';
        logoTitle.style.transition = 'opacity 0.5s';
    }

    const container = document.getElementById('butterfly-3d-container');
    const canvas = document.getElementById('butterfly-canvas');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30); // Pulled back to see larger text area

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // Enable transparency
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Materials
    const wingMaterial = new THREE.MeshPhongMaterial({
        color: 0xff8c42,  // Monarch orange
        side: THREE.DoubleSide,
        shininess: 30,
        transparent: true,
        opacity: 0.95
    });

    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        shininess: 50
    });

    // Create butterfly group
    const butterfly = new THREE.Group();

    // Create smooth butterfly wing
    function createSmoothWing() {
        const shape = new THREE.Shape();

        // Start at body attachment - top
        shape.moveTo(0, 1.2);

        // Upper wing section
        shape.bezierCurveTo(0.8, 1.6, 1.8, 2.2, 2.8, 2.6);
        shape.bezierCurveTo(3.6, 2.9, 4.2, 3.0, 4.6, 2.8);
        shape.bezierCurveTo(4.8, 2.5, 4.9, 2.0, 4.8, 1.4);

        // Middle indent
        shape.bezierCurveTo(4.7, 0.8, 4.5, 0.3, 4.3, 0);

        // Lower wing section
        shape.bezierCurveTo(4.5, -0.4, 4.8, -1.0, 4.9, -1.6);
        shape.bezierCurveTo(4.9, -2.1, 4.7, -2.5, 4.3, -2.7);
        shape.bezierCurveTo(3.8, -2.9, 3.2, -2.9, 2.6, -2.7);
        shape.bezierCurveTo(1.8, -2.4, 1.0, -1.8, 0.4, -1.2);
        shape.bezierCurveTo(0.2, -0.6, 0.1, 0.0, 0, 0.6);

        // Close back to start
        shape.lineTo(0, 1.2);

        return new THREE.ShapeGeometry(shape);
    }

    // Create wings (scaled down)
    const scale = 0.15; // Scale down to half size for hero section

    // Left wing
    const leftWingGeom = createSmoothWing();
    const leftWing = new THREE.Mesh(leftWingGeom, wingMaterial);
    leftWing.position.set(-0.15 * scale, 0, 0);
    leftWing.rotation.y = Math.PI;
    leftWing.scale.set(scale, scale, scale);
    butterfly.add(leftWing);

    // Right wing
    const rightWingGeom = createSmoothWing();
    const rightWing = new THREE.Mesh(rightWingGeom, wingMaterial);
    rightWing.position.set(0.15 * scale, 0, 0);
    rightWing.scale.set(scale, scale, scale);
    butterfly.add(rightWing);

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.15 * scale, 0.12 * scale, 3 * scale, 16);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    butterfly.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25 * scale, 16, 16);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 1.7 * scale;
    butterfly.add(head);

    // Antennae
    const antennaGeometry = new THREE.CylinderGeometry(0.02 * scale, 0.02 * scale, 0.8 * scale, 8);

    const leftAntenna = new THREE.Mesh(antennaGeometry, bodyMaterial);
    leftAntenna.position.set(-0.15 * scale, 2.0 * scale, 0.1 * scale);
    leftAntenna.rotation.z = 0.3;
    leftAntenna.rotation.x = 0.2;
    butterfly.add(leftAntenna);

    const rightAntenna = new THREE.Mesh(antennaGeometry, bodyMaterial);
    rightAntenna.position.set(0.15 * scale, 2.0 * scale, 0.1 * scale);
    rightAntenna.rotation.z = -0.3;
    rightAntenna.rotation.x = 0.2;
    butterfly.add(rightAntenna);

    // Antenna tips
    const antennaTipGeometry = new THREE.SphereGeometry(0.05 * scale, 8, 8);

    const leftAntennaTip = new THREE.Mesh(antennaTipGeometry, bodyMaterial);
    leftAntennaTip.position.set(-0.25 * scale, 2.4 * scale, 0.2 * scale);
    butterfly.add(leftAntennaTip);

    const rightAntennaTip = new THREE.Mesh(antennaTipGeometry, bodyMaterial);
    rightAntennaTip.position.set(0.25 * scale, 2.4 * scale, 0.2 * scale);
    butterfly.add(rightAntennaTip);

    scene.add(butterfly);

    // Create 3D Text for "flickflauder"
    let textMesh = null;
    let iDotPosition = new THREE.Vector3(0, 0, 0);

    const fontLoader = new FontLoader();
    fontLoader.load(
        'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
        function (font) {
            // Create text geometry for "fl"
            const textMaterialDark = new THREE.MeshPhongMaterial({
                color: 0x1a1a1a,
                shininess: 30
            });

            // Calculate responsive font size (similar to CSS clamp(3rem, 10vw, 7rem))
            // But converted to Three.js units (much smaller)
            const viewportWidth = window.innerWidth;
            let fontSize = Math.max(1.5, Math.min(viewportWidth * 0.005, 3.5));

            // "fl" text
            const flGeometry = new TextGeometry('fl', {
                font: font,
                size: fontSize,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            const flMesh = new THREE.Mesh(flGeometry, textMaterialDark);
            scene.add(flMesh);

            // "i" - Create stem with 45-degree tilted top (going up from left to right)
            // Get proper "i" dimensions first
            const iTempGeometry = new TextGeometry('i', {
                font: font,
                size: fontSize,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            iTempGeometry.computeBoundingBox();

            const iFullHeight = iTempGeometry.boundingBox.max.y - iTempGeometry.boundingBox.min.y;
            const iFullWidth = iTempGeometry.boundingBox.max.x - iTempGeometry.boundingBox.min.x;
            const stemWidth = iFullWidth * 0.5; // Width of the vertical stem
            const stemHeight = iFullHeight * 0.65; // Height without dot and gap

            const tiltAngle = Math.PI / 4; // 45 degrees - going up from left to right

            // Create stem with flat-topped trapezoid shape (bottom normal, top tilts DOWN from left to right)
            const iStemShape = new THREE.Shape();
            const hw = stemWidth / 2;

            // Bottom edge (flat)
            iStemShape.moveTo(-hw, 0);
            iStemShape.lineTo(hw, 0);

            // Right edge (vertical) - RIGHT side is LOWER
            const rightHeight = stemHeight - hw * Math.tan(tiltAngle);
            iStemShape.lineTo(hw, rightHeight);

            // Top edge (tilted 45 degrees DOWN from left to right like \)
            const leftHeight = stemHeight + hw * Math.tan(tiltAngle);
            iStemShape.lineTo(-hw, leftHeight);

            // Close path
            iStemShape.lineTo(-hw, 0);

            const iStemGeometry = new THREE.ExtrudeGeometry(iStemShape, {
                depth: 0.5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            const iMesh = new THREE.Mesh(iStemGeometry, textMaterialDark);
            scene.add(iMesh);

            const iStemWidth = iFullWidth * 1.5; // Add more spacing around the "i"

            // "ckflauder" text
            const ckflauderGeometry = new TextGeometry('ckflauder', {
                font: font,
                size: fontSize,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            const ckflauderMesh = new THREE.Mesh(ckflauderGeometry, textMaterialDark);
            scene.add(ckflauderMesh);

            // Calculate bounding boxes for positioning
            flGeometry.computeBoundingBox();
            ckflauderGeometry.computeBoundingBox();

            const flWidth = flGeometry.boundingBox.max.x - flGeometry.boundingBox.min.x;
            const ckflauderWidth = ckflauderGeometry.boundingBox.max.x - ckflauderGeometry.boundingBox.min.x;

            const totalWidth = flWidth + iStemWidth + ckflauderWidth;

            // Center the text (baseline at y=0)
            const startX = -totalWidth / 2;
            const baselineY = -fontSize * 0.35; // Lower the baseline

            flMesh.position.set(startX, baselineY, 0);

            // Position "i" stem (centered in its allocated space)
            const iStemCenterX = startX + flWidth + iStemWidth / 2;
            iMesh.position.set(iStemCenterX, baselineY, 0);

            ckflauderMesh.position.set(startX + flWidth + iStemWidth, baselineY, 0);

            // Calculate where butterfly should sit (on top of tilted edge)
            // Center of the tilted top edge
            const avgTopY = (leftHeight + rightHeight) / 2;

            iDotPosition.set(
                iStemCenterX + stemWidth * 0.15,     // Move slightly to the right
                baselineY + avgTopY + fontSize * 0.05,  // Move slightly up
                0.5                                      // Slightly forward
            );

            // Position butterfly on the tilted top
            butterfly.position.copy(iDotPosition);

            // Tilt butterfly to match the 45-degree tilted top edge (positive = right-side up)
            butterfly.rotation.z = tiltAngle; // Positive 45 degrees to match the upward slope
            animationState.initialRotation = tiltAngle;

            animationState.landingStartPosition.copy(iDotPosition);

            // Create attachment lines (arms) from butterfly to the i stem
            const armMaterial = new THREE.MeshPhongMaterial({
                color: 0x1a1a1a,
                shininess: 30
            });

            const armsGroup = new THREE.Group();

            // Calculate attachment points on the stem (on the tilted top edge)
            // Left attachment point
            const leftArmStemX = iStemCenterX - stemWidth * 0.3;
            const leftArmStemY = baselineY + leftHeight - stemWidth * 0.3 * Math.tan(tiltAngle);

            // Right attachment point
            const rightArmStemX = iStemCenterX + stemWidth * 0.3;
            const rightArmStemY = baselineY + leftHeight - stemWidth * 0.3 * Math.tan(tiltAngle);

            // Create left arm
            const leftArmStart = new THREE.Vector3(leftArmStemX, leftArmStemY, 0.25);
            const leftArmEnd = new THREE.Vector3(iDotPosition.x - scale * 0.3, iDotPosition.y - scale * 0.2, 0.25);
            const leftArmLength = leftArmStart.distanceTo(leftArmEnd);

            const leftArmGeometry = new THREE.CylinderGeometry(fontSize * 0.01, fontSize * 0.01, leftArmLength, 6);
            const leftArm = new THREE.Mesh(leftArmGeometry, armMaterial);

            // Position and orient left arm
            leftArm.position.copy(leftArmStart).add(leftArmEnd).multiplyScalar(0.5);
            const leftArmDirection = new THREE.Vector3().subVectors(leftArmEnd, leftArmStart);
            leftArm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), leftArmDirection.normalize());
            armsGroup.add(leftArm);

            // Create right arm
            const rightArmStart = new THREE.Vector3(rightArmStemX, rightArmStemY, 0.25);
            const rightArmEnd = new THREE.Vector3(iDotPosition.x + scale * 0.3, iDotPosition.y - scale * 0.2, 0.25);
            const rightArmLength = rightArmStart.distanceTo(rightArmEnd);

            const rightArmGeometry = new THREE.CylinderGeometry(fontSize * 0.01, fontSize * 0.01, rightArmLength, 6);
            const rightArm = new THREE.Mesh(rightArmGeometry, armMaterial);

            // Position and orient right arm
            rightArm.position.copy(rightArmStart).add(rightArmEnd).multiplyScalar(0.5);
            const rightArmDirection = new THREE.Vector3().subVectors(rightArmEnd, rightArmStart);
            rightArm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rightArmDirection.normalize());
            armsGroup.add(rightArm);

            scene.add(armsGroup);

            // Update landing spots to be relative to text (one is the "i" dot)
            landingSpots[0].position.copy(iDotPosition); // First landing spot is the "i"

            // Store text and arms references for updates
            textMesh = { fl: flMesh, i: iMesh, ckflauder: ckflauderMesh, arms: armsGroup };

            // Make text visible
            if (logoTitle) {
                logoTitle.style.display = 'none';
            }
        },
        undefined,
        function (error) {
            console.error('Error loading font:', error);
            // Fallback: use DOM positioning if font fails
            if (logoTitle) {
                logoTitle.style.opacity = '1';
            }
        }
    );

    // Get initial position from the "i" in flickflauder (fallback for before font loads)
    function getLogoIPosition() {
        const iWrapper = document.querySelector('.i-wrapper');
        if (!iWrapper) return { x: 0, y: 0 };

        const rect = iWrapper.getBoundingClientRect();
        // Convert screen coordinates to 3D space
        const x = (rect.left + rect.width / 2 - window.innerWidth / 2) / 50;
        const y = -(rect.top + rect.height / 2 - window.innerHeight / 2) / 50;
        return { x, y };
    }

    // Define landing spots in hero section (viewport coordinates)
    // First spot will be updated when font loads to be the "i" dot position
    const landingSpots = [
        { position: new THREE.Vector3(0, 0, 0), name: 'i-dot' }, // Will be set by font loader
        { position: new THREE.Vector3(8, 5, 0), name: 'top-right' },
        { position: new THREE.Vector3(-6, -2, 0), name: 'bottom-left' },
        { position: new THREE.Vector3(6, -2, 0), name: 'bottom-right' }
    ];

    // Set initial position at the "i" (using DOM fallback until font loads)
    const logoPos = getLogoIPosition();
    butterfly.position.set(logoPos.x, logoPos.y, 0);
    landingSpots[0].position.set(logoPos.x, logoPos.y, 0); // Initial fallback position

    // Create flight path within hero section
    const pathPoints = [
        new THREE.Vector3(-6, 4, 0),
        new THREE.Vector3(0, 6, -1),
        new THREE.Vector3(6, 5, 0),
        new THREE.Vector3(8, 2, 1),
        new THREE.Vector3(4, -1, 0),
        new THREE.Vector3(-2, -2, -1),
        new THREE.Vector3(-8, 1, 0),
        new THREE.Vector3(-4, 3, 1)
    ];

    const flightPath = new THREE.CatmullRomCurve3(pathPoints, true);

    // Animation state
    const animationState = {
        landingState: 'landed',     // Start landed on "i"
        landingStartTime: 0,
        targetLandingSpot: null,
        flyingDuration: 15,
        restDuration: 12,
        nextLandingTime: 2.5,       // Takeoff after 2.5 seconds (matches existing delay)
        landingStartPosition: new THREE.Vector3(),
        initialRotation: 0,         // Will store initial tilt angle for "i" stem

        pathProgress: 0,
        flightSpeed: 0.04,          // Slower for hero section
        lastPosition: new THREE.Vector3(),
        currentVelocity: 0,

        fastFlapSpeed: 12.0,
        slowFlapSpeed: 3.0,
        flapAmplitude: Math.PI / 3,
        phaseOffset: 0.1,

        wingFoldProgress: 1.0,      // Start with wings folded
        wingFoldDuration: 0.5,

        currentFlapSpeed: 0,
        currentAmplitude: 0,

        startTime: Date.now() / 1000
    };

    // Attachment lines (legs)
    let attachmentLines = null;

    function createAttachmentLines(targetPos) {
        if (attachmentLines) {
            butterfly.remove(attachmentLines);
        }

        const linesGroup = new THREE.Group();
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });

        const bodyBottom = new THREE.Vector3(0, -1.2 * scale, 0);
        const relativeTarget = targetPos.clone().sub(butterfly.position);

        // Left leg
        const leftLegGeom = new THREE.CylinderGeometry(0.01 * scale, 0.01 * scale, relativeTarget.length(), 4);
        const leftLeg = new THREE.Mesh(leftLegGeom, legMaterial);
        leftLeg.position.copy(bodyBottom).add(relativeTarget.clone().multiplyScalar(0.5));
        leftLeg.position.x -= 0.1 * scale;
        leftLeg.lookAt(relativeTarget);
        leftLeg.rotateX(Math.PI / 2);
        linesGroup.add(leftLeg);

        // Right leg
        const rightLegGeom = new THREE.CylinderGeometry(0.01 * scale, 0.01 * scale, relativeTarget.length(), 4);
        const rightLeg = new THREE.Mesh(rightLegGeom, legMaterial);
        rightLeg.position.copy(bodyBottom).add(relativeTarget.clone().multiplyScalar(0.5));
        rightLeg.position.x += 0.1 * scale;
        rightLeg.lookAt(relativeTarget);
        rightLeg.rotateX(Math.PI / 2);
        linesGroup.add(rightLeg);

        butterfly.add(linesGroup);
        attachmentLines = linesGroup;
    }

    // Animation function
    function animateButterfly(elapsedTime, delta) {
        let targetSpeed, targetAmplitude;

        // State machine
        if (animationState.landingState === 'flying') {
            // Check if time to land
            if (elapsedTime >= animationState.nextLandingTime) {
                animationState.landingState = 'approaching';
                animationState.landingStartTime = elapsedTime;
                animationState.targetLandingSpot = landingSpots[Math.floor(Math.random() * landingSpots.length)];
                animationState.landingStartPosition.copy(butterfly.position);
            }

            // Normal flight
            animationState.pathProgress += animationState.flightSpeed * delta;
            if (animationState.pathProgress > 1.0) animationState.pathProgress -= 1.0;

            const newPosition = flightPath.getPoint(animationState.pathProgress);
            butterfly.position.copy(newPosition);

            const distance = newPosition.distanceTo(animationState.lastPosition);
            animationState.currentVelocity = distance / (delta || 0.016);
            animationState.lastPosition.copy(newPosition);

            // Velocity-based flapping
            if (animationState.currentVelocity > 1.0) {
                targetSpeed = animationState.fastFlapSpeed;
                targetAmplitude = animationState.flapAmplitude;
            } else {
                targetSpeed = animationState.slowFlapSpeed;
                targetAmplitude = animationState.flapAmplitude * 0.4;
            }

            animationState.wingFoldProgress += (0 - animationState.wingFoldProgress) * 0.1;

        } else if (animationState.landingState === 'approaching') {
            // Fly toward landing spot
            const approachDuration = 2.0;
            const timeSinceStart = elapsedTime - animationState.landingStartTime;
            const progress = Math.min(timeSinceStart / approachDuration, 1.0);
            const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            butterfly.position.lerpVectors(
                animationState.landingStartPosition,
                animationState.targetLandingSpot.position,
                eased
            );

            // Rotate to match landing spot angle (if landing on "i" stem)
            const isLandingOnIStem = animationState.targetLandingSpot && animationState.targetLandingSpot.name === 'i-dot';
            if (isLandingOnIStem) {
                butterfly.rotation.z = animationState.initialRotation * progress;
                // Fade in arms during landing
                if (textMesh && textMesh.arms) {
                    textMesh.arms.traverse((child) => {
                        if (child.material) {
                            child.material.opacity = progress;
                            child.material.transparent = true;
                        }
                    });
                }
            }

            targetSpeed = animationState.slowFlapSpeed * (1 - progress);
            targetAmplitude = animationState.flapAmplitude * (1 - progress * 0.6);

            animationState.wingFoldProgress += (1 - animationState.wingFoldProgress) * 0.15;

            if (progress >= 1.0) {
                animationState.landingState = 'landed';
                animationState.landingStartTime = elapsedTime;
                createAttachmentLines(animationState.targetLandingSpot.position);
            }

        } else if (animationState.landingState === 'landed') {
            // Rest on spot
            if (elapsedTime - animationState.landingStartTime >= animationState.restDuration) {
                animationState.landingState = 'takingOff';
                animationState.landingStartTime = elapsedTime;
            }

            targetSpeed = 0;
            targetAmplitude = 0;
            animationState.wingFoldProgress = 1.0;

        } else if (animationState.landingState === 'takingOff') {
            // Take off
            const takeoffDuration = 1.0;
            const timeSinceStart = elapsedTime - animationState.landingStartTime;
            const progress = Math.min(timeSinceStart / takeoffDuration, 1.0);

            // Small hop up
            const startY = animationState.targetLandingSpot ? animationState.targetLandingSpot.position.y : logoPos.y;
            butterfly.position.y = startY + progress * 2;

            // Rotate from tilted to upright during takeoff
            const isOnIStem = animationState.targetLandingSpot && animationState.targetLandingSpot.name === 'i-dot';
            if (isOnIStem) {
                butterfly.rotation.z = animationState.initialRotation * (1 - progress);
                // Fade out arms during takeoff
                if (textMesh && textMesh.arms) {
                    textMesh.arms.traverse((child) => {
                        if (child.material) {
                            child.material.opacity = 1 - progress;
                            child.material.transparent = true;
                        }
                    });
                }
            }

            animationState.wingFoldProgress += (0 - animationState.wingFoldProgress) * 0.2;

            targetSpeed = animationState.fastFlapSpeed * progress;
            targetAmplitude = animationState.flapAmplitude * progress;

            if (progress >= 1.0) {
                animationState.landingState = 'flying';
                animationState.nextLandingTime = elapsedTime + 15 + Math.random() * 5;
                butterfly.rotation.z = 0; // Ensure upright when flying
                if (attachmentLines) {
                    butterfly.remove(attachmentLines);
                    attachmentLines = null;
                }
            }
        }

        // Interpolate wing parameters
        animationState.currentFlapSpeed += (targetSpeed - animationState.currentFlapSpeed) * 0.1;
        animationState.currentAmplitude += (targetAmplitude - animationState.currentAmplitude) * 0.1;

        // Wing animation with folding
        const leftPhase = elapsedTime * animationState.currentFlapSpeed;
        const rightPhase = leftPhase + animationState.phaseOffset;

        const openRotationLeft = Math.PI + Math.sin(leftPhase) * animationState.currentAmplitude;
        const openRotationRight = -Math.sin(rightPhase) * animationState.currentAmplitude;
        const closedRotation = 0;

        leftWing.rotation.y = openRotationLeft * (1 - animationState.wingFoldProgress) + closedRotation * animationState.wingFoldProgress;
        rightWing.rotation.y = openRotationRight * (1 - animationState.wingFoldProgress) + closedRotation * animationState.wingFoldProgress;

        // Subtle bobbing when flying
        if (animationState.landingState === 'flying') {
            const bobbing = Math.sin(elapsedTime * 2) * 0.05;
            butterfly.position.y += bobbing;
        }
    }

    // Animation loop
    let lastTime = Date.now() / 1000;

    function animate() {
        requestAnimationFrame(animate);

        const currentTime = Date.now() / 1000;
        const delta = currentTime - lastTime;
        lastTime = currentTime;

        const elapsedTime = currentTime - animationState.startTime;

        animateButterfly(elapsedTime, delta);

        renderer.render(scene, camera);
    }

    // Initialize last position
    animationState.lastPosition.copy(butterfly.position);

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Note: 3D text size is fixed, but could be recalculated here for full responsiveness
        // For now, the text will maintain its size and the viewport will adjust around it
    });
}

// Export for potential external use
window.init3DButterfly = init3DButterfly;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DButterfly);
} else {
    init3DButterfly();
}
