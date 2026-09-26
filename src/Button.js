import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { mobile } from './Calculator.style';

const LONG_PRESS_MS = 500;

const colorMap = {
  operator: 'pink',
  mode: '#ffc560',
};

const Btn = styled.button`
  position:relative;
  border: none;
  color: black;
  background-color: ${({ type }) => colorMap[type] || 'lightblue'};
  box-shadow: 0px 5px 0px 0px #cccc00;

  text-align: center;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;

  ${mobile} {
    font-size: clamp(1.75rem, 9vw, 2.75rem);
  }

  &:disabled {
    opacity: 0.4;
  }

  &:active:enabled {
    box-shadow: none;
    top:5px;
  }
`;

// `value` is passed to the handlers; `label` is what the key shows.
export default function Button({ type, value, label = value, onClick, onLongPress, disabled }) {
  const timer = useRef();
  const longPressed = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const longPress = () => {
    clearTimeout(timer.current);
    longPressed.current = true;
    onLongPress(value);
  };

  const handlers = onLongPress && {
    onPointerDown: () => {
      longPressed.current = false;
      timer.current = setTimeout(longPress, LONG_PRESS_MS);
    },
    onPointerUp: () => clearTimeout(timer.current),
    onPointerLeave: () => clearTimeout(timer.current),
    onPointerCancel: () => clearTimeout(timer.current),
    // Right-click on desktop; also fired by some mobile browsers on long press.
    onContextMenu: (e) => {
      e.preventDefault();
      if (!longPressed.current) longPress();
    },
  };

  return (
    <Btn
      type={type}
      disabled={disabled}
      onClick={() => {
        // The release that ends a long press shouldn't also type the key.
        if (longPressed.current) {
          longPressed.current = false;
          return;
        }
        onClick(value);
      }}
      {...handlers}
    >
      {label}
    </Btn>
  );
}
