import { playAnimation } from "./animator.js";

export default function Mascot({
  mascotName,
  role = "player",
}) {
  const div = document.createElement("div");
  div.className = `mascot mascot-${role}`;

  const img = document.createElement("img");
  img.draggable = false;

  if (role === "enemy") {
    img.style.transform = "scaleX(-1)";
  }

  div.appendChild(img);

  let currentAnim = null;
  let currentState = "idle";

  function stopCurrent() {
    if (currentAnim) currentAnim.stop();
    currentAnim = null;
  }

  function idle() {
    stopCurrent();
    currentState = "idle";

    currentAnim = playAnimation({
      img,
      path: `/assets/mascots/${mascotName}/idle`,
      loop: true,
    });
  }

  function happy() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "happy";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/happy`,
        loop: false,
        onEnd: () => {
          idle();
          resolve();
        },
      });
    });
  }

  function sad() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "sad";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/sad`,
        loop: false,
        onEnd: () => {
          idle();
          resolve();
        },
      });
    });
  }

  function dead() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "dead";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/dead`,
        loop: false,
        onEnd: () => {
          resolve();
        },
      });
    });
  }

  function run({ from = -200, to = 1400, duration = 800 } = {}) {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "run";

      // reset vị trí ban đầu
      div.style.position = "absolute";
      div.style.left = from + "px";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/run`,
        loop: true,
        totalFrames: 8,
      });

      // chạy ngang
      div.animate(
        [
          { transform: `translateX(0)` },
          { transform: `translateX(${to - from}px)` },
        ],
        {
          duration,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      setTimeout(() => {
        stopCurrent();
        idle();
        resolve();
      }, duration);
    });
  }

  function openDoor() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "openDoor";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/openDoor`,
        loop: false,
        totalFrames: 10,
        onEnd: () => {
          // giữ frame cuối (frame 10)
          img.src = `/assets/mascots/${mascotName}/openDoor/10.png`;
          resolve();
        },
      });
    });
  }

  function closeDoor() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "closeDoor";

      let frame = 10;

      const interval = setInterval(() => {
        img.src = `/assets/mascots/${mascotName}/openDoor/${frame}.png`;
        frame--;

        if (frame < 1) {
          clearInterval(interval);

          // giữ frame 1
          img.src = `/assets/mascots/${mascotName}/openDoor/1.png`;
          resolve();
        }
      }, 80); // chỉnh speed nếu cần
    });
  } 


  idle();

  return {
    el: div,
    role,
    idle,
    happy,
    sad,
    dead,
    run,
    openDoor,
    closeDoor,
    getState: () => currentState,
  };
}
