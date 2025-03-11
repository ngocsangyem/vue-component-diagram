export function useTheme() {
  // This would normally use Vue's reactive system
  // For this example, we're just returning static values
  return {
    theme: 'light',
    toggleTheme: () => console.log('Theme toggled')
  };
}