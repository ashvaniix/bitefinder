import { useCallback, useEffect, useRef, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismissToast = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setToast(null);
  }, []);

  const showToast = useCallback((message, action = null) => {
    window.clearTimeout(timerRef.current);
    setToast({ message, action });
    timerRef.current = window.setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return { toast, showToast, dismissToast };
}
