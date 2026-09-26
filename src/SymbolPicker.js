import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from './Button';

const STORAGE_KEY = 'dozenal-symbols';

export const DEFAULT_SYMBOLS = { a: 'a', b: 'b' };

const presets = {
  a: ['a', 'X', 'T', '↊'],
  b: ['b', 'Ɛ', 'E', '↋'],
};

const names = { a: 'ten', b: 'eleven' };

// Symbols that would make the display ambiguous.
const reserved = /[\d.+\-*/\s]/;

function loadSymbols() {
  try {
    return { ...DEFAULT_SYMBOLS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch (e) {
    return DEFAULT_SYMBOLS;
  }
}

// The display symbols for the digits ten and eleven, remembered across visits.
export function useDigitSymbols() {
  const [symbols, setSymbols] = useState(loadSymbols);

  const setSymbol = useCallback((digit, symbol) => {
    setSymbols((symbols) => {
      const next = { ...symbols, [digit]: symbol };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        // Storage unavailable (e.g. private mode): keep the choice for this visit only.
      }
      return next;
    });
  }, []);

  return [symbols, setSymbol];
}

// Keeps only the last character typed, treating emoji and accented
// characters as one character where the browser supports it.
function lastCharacter(str) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segments = Array.from(new Intl.Segmenter().segment(str));
    return segments.length ? segments[segments.length - 1].segment : '';
  }
  return Array.from(str).pop() || '';
}

export default function SymbolPicker({ digit, symbols, onChoose, onClose }) {
  const [draft, setDraft] = useState('');
  const other = symbols[digit === 'a' ? 'b' : 'a'];

  const problem = (symbol) => {
    if (reserved.test(symbol)) return 'Digits, operators and spaces are taken';
    if (symbol === other) return `${symbol} is already used for ${names[digit === 'a' ? 'b' : 'a']}`;
    return null;
  };
  const error = draft && problem(draft);

  const choose = (symbol) => {
    if (problem(symbol)) return;
    onChoose(digit, symbol);
    onClose();
  };

  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Panel role="dialog" aria-modal="true" aria-labelledby="symbol-picker-title">
        <Title id="symbol-picker-title">Symbol for {names[digit]}</Title>
        <Grid>
          {presets[digit].map((symbol) => (
            <Button
              key={symbol}
              type={symbol === symbols[digit] ? 'mode' : undefined}
              value={symbol}
              onClick={choose}
              disabled={symbol === other}
            />
          ))}
        </Grid>
        <Form onSubmit={(e) => { e.preventDefault(); if (draft) choose(draft); }}>
          <Input
            aria-label="Custom symbol"
            placeholder="or type…"
            value={draft}
            onChange={(e) => setDraft(lastCharacter(e.target.value))}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <Button type="operator" value="OK" onClick={() => draft && choose(draft)} disabled={!draft || !!error} />
        </Form>
        <Message role="status">{error}</Message>
      </Panel>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 360px;
  padding: 20px 20px 10px;
  background-color: yellow;
  box-shadow: 0px 5px 0px 0px #cccc00;
`;

const Title = styled.h2`
  font-size: 1.5em;
  font-weight: normal;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 50px;
  gap: 10px;
  padding-bottom: 5px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 80px;
  grid-auto-rows: 50px;
  gap: 10px;
`;

const Input = styled.input`
  min-width: 0;
  padding: 0 10px;
  border: none;
  background-color: #ffc560;
  box-shadow: inset 0px 5px 0px 0px #cccc00;
  font-size: 2em;
  text-align: center;
  -webkit-user-select: text;
  user-select: text;

  &::placeholder {
    font-size: 0.6em;
    color: rgba(0, 0, 0, 0.5);
  }
`;

const Message = styled.p`
  min-height: 1.2em;
  color: #a00;
`;
