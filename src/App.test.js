import { render, screen, fireEvent, within, act } from '@testing-library/react';
import App from './App';

const key = (label) => screen.getByText(label, { selector: 'button' });
const press = (...keys) => keys.forEach((label) => fireEvent.click(key(label)));
const display = () => screen.getByTestId('display');

const longPress = (label) => {
  const button = key(label);
  fireEvent.pointerDown(button);
  act(() => jest.advanceTimersByTime(500));
  fireEvent.pointerUp(button);
  fireEvent.click(button);
};

let app;
beforeEach(() => {
  localStorage.clear();
  app = render(<App />);
});

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

test('links to the project page from the folded corner', () => {
  expect(screen.getByRole('link', { name: /project page/i }))
    .toHaveAttribute('href', 'https://bristoljon.uk/project/dozenal');
});

describe('choosing symbols for ten and eleven', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('long press opens the picker without typing the digit', () => {
    longPress('a');
    expect(screen.getByRole('dialog', { name: 'Symbol for ten' })).toBeInTheDocument();
    expect(display()).toHaveTextContent(/^$/);
  });

  test('a short press still types the digit', () => {
    fireEvent.pointerDown(key('a'));
    act(() => jest.advanceTimersByTime(200));
    fireEvent.pointerUp(key('a'));
    fireEvent.click(key('a'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(display()).toHaveTextContent(/^a$/);
  });

  test('a chosen preset relabels the key and the display', () => {
    press('a', '+');
    longPress('a');
    fireEvent.click(within(screen.getByRole('dialog')).getByText('↊'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(display()).toHaveTextContent(/^↊\+$/);

    longPress('b');
    fireEvent.click(within(screen.getByRole('dialog')).getByText('↋'));
    press('1', '=');
    expect(display()).toHaveTextContent(/^↋$/);
  });

  test('accepts a typed symbol but not a digit or the other symbol', () => {
    longPress('b');
    const dialog = within(screen.getByRole('dialog'));
    const input = dialog.getByLabelText('Custom symbol');

    fireEvent.change(input, { target: { value: '5' } });
    expect(dialog.getByRole('status')).toHaveTextContent('taken');
    expect(dialog.getByText('OK')).toBeDisabled();

    fireEvent.change(input, { target: { value: 'a' } });
    expect(dialog.getByRole('status')).toHaveTextContent('already used for ten');

    fireEvent.change(input, { target: { value: 'a£' } });
    expect(input).toHaveValue('£');
    fireEvent.click(dialog.getByText('OK'));
    expect(key('£')).toBeInTheDocument();
  });

  test('remembers the chosen symbols', () => {
    longPress('a');
    fireEvent.click(within(screen.getByRole('dialog')).getByText('X'));
    app.unmount();
    render(<App />);
    expect(key('X')).toBeInTheDocument();
  });
});

describe('the last calculation', () => {
  const history = () => screen.getByTestId('history');

  test('is shown above its result', () => {
    press('1', '/', '3', '=');
    expect(history()).toHaveTextContent(/^1\/3=$/);
    expect(display()).toHaveTextContent(/^0\.4$/);
  });

  test('stays while the next sum is typed, and is replaced by it', () => {
    press('2', '+', '2', '=', '*', '3');
    expect(history()).toHaveTextContent(/^2\+2=$/);
    press('=');
    expect(history()).toHaveTextContent(/^4\*3=$/);
    expect(display()).toHaveTextContent(/^10$/);
  });

  test('follows a change of base', () => {
    press('1', '0', '/', '4', '=');
    press('DOZ');
    expect(history()).toHaveTextContent(/^12\/4=$/);
  });

  test('is cleared by C', () => {
    press('1', '+', '1', '=', 'C');
    expect(history()).toHaveTextContent(/^$/);
  });
});
