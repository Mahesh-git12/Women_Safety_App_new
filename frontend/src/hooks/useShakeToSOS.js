import { useEffect, useRef } from "react";

export default function useShakeToSOS(triggerSOS) {
  const lastShakeTime = useRef(0);
  const lastAccel = useRef({ x: null, y: null, z: null });

  useEffect(() => {
    function handleMotion(event) {
      const acc = event.accelerationIncludingGravity;
      if (acc.x === null || acc.y === null || acc.z === null) return;

      if (
        lastAccel.current.x !== null &&
        (
          Math.abs(acc.x - lastAccel.current.x) > 18 ||
          Math.abs(acc.y - lastAccel.current.y) > 18 ||
          Math.abs(acc.z - lastAccel.current.z) > 18
        )
      ) {
        const now = Date.now();
        if (now - lastShakeTime.current > 3000) { // 3 seconds cooldown
          triggerSOS();
          lastShakeTime.current = now;
        }
      }
      lastAccel.current = { x: acc.x, y: acc.y, z: acc.z };
    }

    window.addEventListener('devicemotion', handleMotion, false);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [triggerSOS]);
}
