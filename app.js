"use strict"

class App {
    constructor() {
        // VARIABLES
        this.time = 0

        this.settings = {
            progress: 0
        }
    }

    init() {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.physicallyCorrectLights = true

        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        this.camera.position.set(10, 10, 20)
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.update()

        // Helpers
        const axesHelpers = new THREE.AxesHelper(5)
        // this.scene.add(axesHelpers)

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        this.scene.add(ambientLight)

        const spotLight = new THREE.SpotLight(0xffffff, 15, 0, 2)
        spotLight.position.z = 5
        spotLight.position.y = 5
        this.scene.add(spotLight)

        // Torus
        const loader = new THREE.GLTFLoader()
        loader.load("./assets/torus.glb", gltf => {
            this.model = gltf.scene
            this.scene.add(this.model)

             // Animations
            this.update()
        })
    }

    update() {
        this.time += 0.02
        let progress = Math.sin(this.time) / 150
        
        this.model.children.forEach((child, index) => {
            // Position
            let direction = child.position.clone().sub(this.model.position).normalize()
            child.position.add(direction.multiplyScalar(progress * index/5))
            // child.position.add(direction.multiplyScalar(progress))

            // Rotation
            let rotate = (Math.sin(this.time - Math.PI/2) * 1/2 + 1/2 ) * index / this.model.children.length
            child.rotation.set(rotate * child.position.x, rotate * child.position.y, rotate * child.position.z)
        })

        this.model.rotation.y = -this.time/2

        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this));
    }
}

// DECLARATIONS
new App().init()

// UTILS : TIME, PROGRESS, POSiTION, ROTATION, DIRECTION
// https://tympanus.net/codrops/2019/03/26/exploding-3d-objects-with-three-js/

// position = rotate(position);
// position += position + direction*progress;