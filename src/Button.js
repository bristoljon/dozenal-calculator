import styled from 'styled-components';

const colorMap = {
  operator: 'pink',
  mode: '#ffc560',
};

const Btn = styled.button`
  width: 80px;
  height: 50px;
  margin: 0 0 15px 10px;
  position:relative;
  border: none;
  background-color: ${({ type }) => colorMap[type] || 'lightblue'};
  box-shadow: 0px 5px 0px 0px #cccc00;

  text-align: center;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    box-shadow: none;
    top:5px;
  }
`;

export default function Button({ type, value, onClick }) {
  return <Btn onClick={() => onClick(value)} type={type}>{value}</Btn>
}
