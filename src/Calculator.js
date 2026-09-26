import { useCallback, useState } from 'react';

import { Container, Keyboard, Display, Repeat } from './Calculator.style';
import Button from './Button';
import { add, subtract, multiply, divide, parse, toDigits } from './rational';

const opMap = {
  '+': add,
  '-': subtract,
  '/': divide,
  '*': multiply,
};

const isOperator = (token) => token && token.op !== undefined;

// Renders a computed value, overlining any recurring digits.
function Value({ value, base }) {
  const { negative, int, frac, repeat, approx } = toDigits(value, base);
  return (
    <>
      {negative && '-'}
      {int}
      {(frac || repeat) && '.'}
      {frac}
      {repeat && <Repeat>{repeat}</Repeat>}
      {approx && '…'}
    </>
  );
}

function Calculator() {
  const [base, setBase] = useState(12);
  // Alternating numbers and operators. Numbers hold an exact rational `value`;
  // `text` is what the user is typing, or null for a computed result.
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);

  const handleDigit = useCallback(
    (value) => {
      setError(null);
      setTokens((tokens) => {
        const last = tokens[tokens.length - 1];
        const isNumber = last && !isOperator(last);
        const prevText = (isNumber && last.text) || '';
        if (value === '.' && prevText.includes('.')) return tokens;
        const text = `${prevText}${value}`;
        const token = { text, value: parse(text, base) };
        // Typing over a computed result starts a new number.
        return isNumber ? [...tokens.slice(0, -1), token] : [...tokens, token];
      });
    },
    [base],
  );

  const handleOperator = useCallback(
    (op) => {
      setError(null);
      setTokens((tokens) => {
        if (!tokens.length) return tokens;
        const last = tokens[tokens.length - 1];
        return isOperator(last) ? [...tokens.slice(0, -1), { op }] : [...tokens, { op }];
      });
    },
    [],
  );

  const handlebase = useCallback(
    () => {
      // Values are exact, so switching base only changes how they're displayed.
      setTokens((tokens) => tokens.map((token) => (
        isOperator(token) ? token : { value: token.value, text: null }
      )));
      setBase((base) => (base === 12 ? 10 : 12));
    },
    [],
  );

  const handleEquals = useCallback(
    () => {
      const terms = isOperator(tokens[tokens.length - 1]) ? tokens.slice(0, -1) : tokens;
      if (!terms.length) return;

      try {
        let sum = terms[0].value;
        for (let i = 1; i < terms.length; i += 2) {
          sum = opMap[terms[i].op](sum, terms[i + 1].value);
        }
        setTokens([{ value: sum, text: null }]);
      } catch (e) {
        setTokens([]);
        setError('Error');
      }
    },
    [tokens],
  );

  const handleClear = useCallback(
    () => {
      setTokens([]);
      setError(null);
    },
    [],
  );

  return (
    <Container>
      <Display data-testid="display">
        <span>
          {error || tokens.map((token, i) => {
            if (isOperator(token)) return token.op;
            if (token.text !== null) return token.text;
            return <Value key={i} value={token.value} base={base} />;
          })}
        </span>
      </Display>
      <Keyboard>
        <Button  value="a" onClick={handleDigit} disabled={base !== 12}/>
        <Button  value="b" onClick={handleDigit} disabled={base !== 12}/>
        <Button  value="." onClick={handleDigit}/>
        <Button type="operator" value="*" onClick={handleOperator}/>
        <Button  value="7" onClick={handleDigit}/>
        <Button  value="8" onClick={handleDigit}/>
        <Button  value="9" onClick={handleDigit}/>
        <Button type="operator" value="/" onClick={handleOperator}/>
        <Button  value="4" onClick={handleDigit}/>
        <Button  value="5" onClick={handleDigit}/>
        <Button  value="6" onClick={handleDigit}/>
        <Button type="operator" value="-" onClick={handleOperator}/>
        <Button  value="1" onClick={handleDigit}/>
        <Button  value="2" onClick={handleDigit}/>
        <Button  value="3" onClick={handleDigit}/>
        <Button type="operator" value="+" onClick={handleOperator}/>
        <Button type="operator" value="C" onClick={handleClear}/>
        <Button  value="0" onClick={handleDigit}/>
        <Button type="mode" value={base === 12 ? 'DOZ' : 'DEC'} onClick={handlebase}/>
        <Button type="operator" value="=" onClick={handleEquals}/>
      </Keyboard>
    </Container>
  );
}

export default Calculator;
