import styled from 'styled-components';

import { mobile } from './Calculator.style';

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

export default function Button({ type, value, onClick, disabled }) {
  return <Btn onClick={() => onClick(value)} type={type} disabled={disabled}>{value}</Btn>
}
