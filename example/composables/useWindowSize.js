export function useWindowSize() {
  // This would normally use Vue's reactive system
  // For this example, we're just returning static values
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}