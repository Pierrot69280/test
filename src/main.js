import kaboom from "kaboom";
// Start a kaboom game
kaboom({
    // Scale the whole game up
    scale: 4,
    // Set the default font
    font: "monospace",
})

// Loading a multi-frame sprite
loadSprite("astro", "sprites/astro.png", {
    // The image contains 9 frames layed out horizontally, slice it into individual frames
    sliceX: 15,
    // Define animations
    anims: {
        "idle": 0,

        "run": {
            from: 0,
            to: 3,
            speed: 10,
            //loop: true,
        },
        // This an imation only has 1 frame
        "jump": 8,
    },
})

const SPEED = 120
const JUMP_FORCE = 240

setGravity(640)

// Add our player character
const player = add([
    sprite("astro"),
    pos(center()),
    anchor("center"),
    area(),
    body(),
])

// .play is provided by sprite() component, it starts playing the specified animation (the animation information of "idle" is defined above in loadSprite)
player.play("idle")

// Add a platform
add([
    rect(width(), 24),
    area(),
    outline(1),
    pos(0, height() - 24),
    body({ isStatic: true }),
])

// Switch to "idle" or "run" animation when player hits ground
player.onGround(() => {
    if (!isKeyDown("left") && !isKeyDown("right")) {
        player.play("idle")
    } else {
        player.play("run")
    }
})

player.onAnimEnd((anim) => {
    if (anim === "idle") {
        // You can also register an event that runs when certain anim ends
    }
})

onKeyPress("space", () => {
    if (player.isGrounded()) {
        player.jump(JUMP_FORCE)
        player.play("jump")
    }
})

onKeyDown("left", () => {
    player.move(-SPEED, 0)
    player.flipX = true
    // .play() will reset to the first frame of the anim, so we want to make sure it only runs when the current animation is not "run"
    if (player.isGrounded() && player.curAnim() !== "run") {
        player.play("run")
    }
})

onKeyDown("right", () => {
    player.move(SPEED, 0)
    player.flipX = false
    if (player.isGrounded() && player.curAnim() !== "run") {
        player.play("run")
    }
})

;["left", "right"].forEach((key) => {
    onKeyRelease(key, () => {
        // Only reset to "idle" if player is not holding any of these keys
        if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
            player.play("idle")
        }
    })
})

const getInfo = () => `
Anim: ${player.curAnim()}
Frame: ${player.frame}
`.trim()

// Add some text to show the current animation
const label = add([
    text(getInfo(), { size: 12 }),
    color(0, 0, 0),
    pos(4),
])

label.onUpdate(() => {
    label.text = getInfo()
})

// Check out https://kaboomjs.com#SpriteComp for everything sprite() provides