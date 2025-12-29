import { useEffect, useState } from "react";

export default function useScrollIndicator(ref) {
  const [canScroll, setCanScroll] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const check = () => {
      const scrollable = el.scrollHeight > el.clientHeight + 2;
      setCanScroll(scrollable);
      setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    const resizeObs = new ResizeObserver(check);
    resizeObs.observe(el);

    return () => {
      el.removeEventListener("scroll", check);
      resizeObs.disconnect();
    };
  }, [ref]);

  return { canScroll, atBottom };
}
