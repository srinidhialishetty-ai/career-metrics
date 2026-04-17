import { useEffect, useRef } from "react";

export default function MotionSystem() {
  const cursorRef = useRef(null);
  const auraRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const aura = auraRef.current;

    if (!cursor || !aura) {
      return undefined;
    }

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      currentX: window.innerWidth / 2,
      currentY: window.innerHeight / 2,
      auraX: window.innerWidth / 2,
      auraY: window.innerHeight / 2,
      pressed: false,
    };

    function setInteractiveState(target) {
      const interactiveTarget = target?.closest?.("[data-magnetic]");
      document.body.dataset.cursorMode = interactiveTarget ? "interactive" : "default";
    }

    function animate() {
      pointer.currentX += (pointer.x - pointer.currentX) * 0.22;
      pointer.currentY += (pointer.y - pointer.currentY) * 0.22;
      pointer.auraX += (pointer.x - pointer.auraX) * 0.12;
      pointer.auraY += (pointer.y - pointer.auraY) * 0.12;

      cursor.style.transform = `translate3d(${pointer.currentX}px, ${pointer.currentY}px, 0) translate(-50%, -50%) scale(${pointer.pressed ? 0.82 : 1})`;
      aura.style.transform = `translate3d(${pointer.auraX}px, ${pointer.auraY}px, 0) translate(-50%, -50%) scale(${pointer.pressed ? 0.92 : 1})`;

      rafRef.current = window.requestAnimationFrame(animate);
    }

    function handlePointerMove(event) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);

      const magneticTarget = event.target.closest?.("[data-magnetic]");

      document.querySelectorAll("[data-magnetic].is-magnetic-active").forEach((element) => {
        if (element !== magneticTarget) {
          element.classList.remove("is-magnetic-active");
          element.style.removeProperty("--magnetic-x");
          element.style.removeProperty("--magnetic-y");
          element.style.removeProperty("--tilt-x");
          element.style.removeProperty("--tilt-y");
        }
      });

      if (magneticTarget) {
        const bounds = magneticTarget.getBoundingClientRect();
        const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
        const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
        const tiltX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
        const tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;

        magneticTarget.classList.add("is-magnetic-active");
        magneticTarget.style.setProperty("--magnetic-x", `${offsetX}px`);
        magneticTarget.style.setProperty("--magnetic-y", `${offsetY}px`);
        magneticTarget.style.setProperty("--tilt-x", `${tiltX}deg`);
        magneticTarget.style.setProperty("--tilt-y", `${tiltY}deg`);
      }

      setInteractiveState(event.target);
    }

    function handlePointerDown() {
      pointer.pressed = true;
      document.body.dataset.cursorPressed = "true";
    }

    function handlePointerUp() {
      pointer.pressed = false;
      document.body.dataset.cursorPressed = "false";
    }

    function handlePointerLeave() {
      document.body.dataset.cursorMode = "default";
      document.querySelectorAll("[data-magnetic].is-magnetic-active").forEach((element) => {
        element.classList.remove("is-magnetic-active");
        element.style.removeProperty("--magnetic-x");
        element.style.removeProperty("--magnetic-y");
        element.style.removeProperty("--tilt-x");
        element.style.removeProperty("--tilt-y");
      });
    }

    rafRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <>
      <div ref={auraRef} className="pointer-aura" aria-hidden="true" />
      <div ref={cursorRef} className="pointer-core" aria-hidden="true" />
    </>
  );
}
