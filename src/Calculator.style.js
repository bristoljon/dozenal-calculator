import styled from 'styled-components';

// Below this width the calculator fills the screen instead of floating as a card.
export const mobile = '@media (max-width: 500px)';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 390px;
  margin: 30px auto;
  padding: 20px 20px 15px;
  background-color: yellow;
  box-shadow: 0px 5px 0px 0px #cccc00;

  ${mobile} {
    max-width: none;
    height: 100vh;
    height: 100dvh;
    margin: 0;
    padding:
      max(16px, env(safe-area-inset-top))
      max(16px, env(safe-area-inset-right))
      max(16px, env(safe-area-inset-bottom))
      max(16px, env(safe-area-inset-left));
    border-radius: 0;
    box-shadow: none;
  }
`;

export const Keyboard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 50px;
  gap: 15px 10px;
  padding-bottom: 5px;
  font-family: monospace;

  ${mobile} {
    flex: 3 1 0;
    grid-auto-rows: 1fr;
  }
`;

// row-reverse keeps the latest input in view when the equation overflows,
// and lets the user scroll back to see the start.
export const Display = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-end;
  flex-shrink: 0;
  height: 70px;
  padding: 10px;
  box-shadow: inset 0px 5px 0px 0px #cccc00;
  background-color: #ffc560;

  font-size: 3em;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ${mobile} {
    flex: 1 1 0;
    height: auto;
    min-height: 90px;
    font-size: clamp(2.5rem, 13vw, 4rem);
  }
`;

export const Repeat = styled.span`
  text-decoration: overline;
`;
