import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

const press = (...keys) => keys.forEach((key) => fireEvent.click(screen.getByText(key, { selector: 'button' })));
const display = () => screen.getByTestId('display');

beforeEach(() => render(<App />));

test('divides exactly in dozenal', () => {
  press('1', '/', '3', '=');
  expect(display()).toHaveTextContent(/^0\.4$/);
});

test('chains calculations on an exact result', () => {
  press('1', '/', '3', '=', '*', '3', '=');
  expect(display()).toHaveTextContent(/^1$/);
});

test('overlines recurring digits', () => {
  press('1', '/', '5', '=');
  expect(display()).toHaveTextContent(/^0\.2497$/);
  expect(screen.getByText('2497').tagName).toBe('SPAN');
});

test('switching base is lossless', () => {
  press('0', '.', '1', 'DOZ');
  expect(display()).toHaveTextContent(/^0\.083$/);
  press('DEC');
  expect(display()).toHaveTextContent(/^0\.1$/);
});

test('typing after a result starts a new number', () => {
  press('2', '+', '2', '=', '5');
  expect(display()).toHaveTextContent(/^5$/);
});

test('shows an error on division by zero', () => {
  press('1', '/', '0', '=');
  expect(display()).toHaveTextContent('Error');
});
