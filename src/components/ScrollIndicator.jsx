function ScrollIndicator({ visible }) {
  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center"
    >
      <div className="scroll-indicator-arrow animate-scroll-indicator" />
    </div>
  );
}

export default ScrollIndicator;
