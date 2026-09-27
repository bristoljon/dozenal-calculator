import styled from 'styled-components';

// Below this width the calculator fills the screen instead of floating as a card.
export const mobile = '@media (max-width: 500px)';

const FOLD = '40px';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 390px;
  margin: 30px auto;
  padding: 20px 20px 15px;
  background-color: yellow;
  box-shadow: 0px 5px 0px 0px #cccc00;
  /* Cut away the top-right corner, which Fold draws folded over. The extra
     10px below keeps the bottom shadow. */
  clip-path: polygon(
    0 0,
    calc(100% - ${FOLD}) 0,
    100% ${FOLD},
    100% calc(100% + 10px),
    0 calc(100% + 10px)
  );

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

// The folded-down corner of the card, linking to the project page.
export const Fold = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  width: ${FOLD};
  height: ${FOLD};
  padding: 0 0 4px 7px;
  background: linear-gradient(to bottom left, transparent 50%, #e6e600 50%);
  border-bottom-left-radius: 6px;
  filter: drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.25));
  color: rgba(0, 0, 0, 0.55);
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;

  &:hover,
  &:focus-visible {
    background: linear-gradient(to bottom left, transparent 50%, #cccc00 50%);
    color: black;
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

export const Display = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-shrink: 0;
  height: 112px;
  padding: 10px;
  box-shadow: inset 0px 5px 0px 0px #cccc00;
  background-color: #ffc560;
  font-size: 3em;

  ${mobile} {
    flex: 1 1 0;
    height: auto;
    min-height: 110px;
    font-size: clamp(2.5rem, 13vw, 4rem);
  }
`;

// row-reverse keeps the latest input in view when a line overflows,
// and lets the user scroll back to see the start.
export const Line = styled.div`
  display: flex;
  flex-direction: row-reverse;
  /* Tall enough that the overline on recurring digits isn't clipped. */
  line-height: 1.4;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// The calculation that gave the result below it. Always takes up its line
// so the result doesn't jump when it appears.
export const History = styled(Line)`
  min-height: 1.4em;
  margin-bottom: 0.3em;
  font-size: 0.4em;
  opacity: 0.6;
`;

export const Repeat = styled.span`
  text-decoration: overline;
`;
