import styled from 'styled-components';

export const Container = styled.div`
  width:390px;
  padding:10px 10px 5px 10px;
  
  margin:30px auto;
  background-color: yellow;
  box-shadow: 0px 5px 0px 0px #cccc00;
`;

export const Keyboard = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-family: monospace;
`;

export const Display = styled.div`
  width:350px;
  height:70px;
  margin:10px 10px 15px 10px;
  box-shadow: inset 0px 5px 0px 0px #cccc00;
  background-color: #ffc560;
  padding:10px 10px 0 0;

  text-align: right;
  font-size: 3em;
`;
