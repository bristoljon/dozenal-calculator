import { useCallback, useState } from 'react';
import BigNumber from 'bignumber.js'

import { Container, Keyboard, Display } from './Calculator.style';
import Button from './Button';

const opMap = {
  '+': 'plus',
  '-': 'minus',
  '/': 'dividedBy',
  '*': 'times'
};

function Calculator() {
  window.BigNumber = BigNumber;
  const [base, setBase] = useState(12);
  const [equation, setEquation] = useState('');

  const handleDigit = useCallback(
    (value) => setEquation(`${equation}${value}`),
    [setEquation, equation],
  );

  const handleOperator = useCallback(
    (value) => setEquation(`${equation}${value}`),
    [setEquation, equation],
  );

  const handlebase = useCallback(
    () => {
      const nextBase = base === 12 ? 10 : 12;
      const bigs = equation
        .split(/([^\dab.])/g)
        .filter((part) => part !== '')
        .map(part => {
          const isDigit = !!part.match(/[\dab.]/g);
          if (isDigit) return new BigNumber(part, base).toString(nextBase);
          return part;
        })
        .join('');
      setEquation(bigs);
      setBase(nextBase);
    },
    [setBase, setEquation, equation, base],
  );

  const handleEquals = useCallback(
    (value) => {
      const bigs = equation
        .split(/([^\dab.])/g)
        .filter((part) => part !== '')
        .map(part => {
          const isDigit = !!part.match(/[\dab.]/g);
          if (isDigit) return new BigNumber(part, base);
          return part;
        })

      let sum = bigs[0];

      for (let i = 1; i < bigs.length; i += 2) {
        sum = sum[opMap[bigs[i]]](bigs[i + 1]);
      };

      setEquation(sum.toString(base));
    },
    [setEquation, equation, base],
  );

  const handleClear = useCallback(
    (value) => setEquation(''),
    [setEquation],
  );

  return (
    <Container>
      <Display>{equation}</Display>
      <Keyboard>
        <Button  value="a" onClick={handleDigit}/>
        <Button  value="b" onClick={handleDigit}/>
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
