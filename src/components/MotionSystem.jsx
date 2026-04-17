import { useEffect } from "react";

export default function MotionSystem() {
  useEffect(() => {
    function clearSurfaceState(element) {
      if (!element) {
        return;
      }

      element.classList.remove("is-magnetic-active");
      element.style.removeProperty("--magnetic-x");
      element.style.removeProperty("--magnetic-y");
      element.style.removeProperty("--tilt-x");
      element.style.removeProperty("--tilt-y");
    }

    function handlePointerMove(event) {
      const magneticTarget = event.target.closest?.("[data-magnetic]");

      document.querySelectorAll("[data-magnetic].is-magnetic-active").forEach((element) => {
        if (element !== magneticTarget) {
          clearSurfaceState(element);
        }
      });

      if (!magneticTarget) {
        return;
      }

      const bounds = magneticTarget.getBoundingClientRect();
      const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
      const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14;
      const tiltX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;
      const tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;

      magneticTarget.classList.add("is-magnetic-active");
      magneticTarget.style.setProperty("--magnetic-x", `${offsetX}px`);
      magneticTarget.style.setProperty("--magnetic-y", `${offsetY}px`);
      magneticTarget.style.setProperty("--tilt-x", `${tiltX}deg`);
      magneticTarget.style.setProperty("--tilt-y", `${tiltY}deg`);
    }

    function handlePointerLeave() {
      document.querySelectorAll("[data-magnetic].is-magnetic-active").forEach(clearSurfaceState);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return null;
}
