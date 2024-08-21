import { useEffect } from "react";

export function useBeforeUnload(callback: () => void) {
  useEffect(() => {
    let userConfirmed = false;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      userConfirmed = true;
    };

    const handleUnload = () => {
      if (userConfirmed) {
        callback();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [callback]);
}
