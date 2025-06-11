import { render } from '@testing-library/react';

import App from './App';

test('renders the application', () => {
  render(<App />);
  // Basic test to ensure the app renders without crashing
  expect(document.body).toBeDefined();
});

export {}; // Add this to make TypeScript treat the file as a module
