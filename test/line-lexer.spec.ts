import { Token, TokenKind } from '../src/line-common';
import { Capture, Line, LineParser } from '../src/line-parser';

describe('LineScanner', () => {
  it('Can create', () => {

    const lineScanner = new LineParser();

    expect(lineScanner).toBeTruthy();
  });

  it('isWhitespace: whitespace with a space returns true', () => {
    const parser = new LineParser();

    const result = parser.isWhitespace(' ');

    expect(result).toBe(true);
  });

  it('isWhitespace: whitespace with a tab returns true', () => {
    const parser = new LineParser();

    const result = parser.isWhitespace('\t');

    expect(result).toBe(true);
  });
  
  it('isWhitespace: whitespace with non-whitespace returns false', () => {
    const parser = new LineParser();

    const result = parser.isWhitespace('f');

    expect(result).toBe(false);
  });

  it('isLetter: lowercase letter returns true', () => {
    const parser = new LineParser();

    const result = parser.isLetter('f');

    expect(result).toBe(true);
  });

  it('isLetter: uppercase letter returns true', () => {
    const parser = new LineParser();

    const result = parser.isLetter('A');

    expect(result).toBe(true);
  });

  it('isLetter: number letter returns false', () => {
    const parser = new LineParser();

    const result = parser.isLetter('7');

    expect(result).toBe(false);
  });

  it('isLetter: symbol letter returns false', () => {
    const parser = new LineParser();

    const result = parser.isLetter('.');

    expect(result).toBe(false);
  });

  it('isDigit: number returns true', () => {
    const parser = new LineParser();

    const result = parser.isDigit('5');

    expect(result).toBe(true);
  });

  it('isDigit: letter returns false', () => {
    const parser = new LineParser();

    const result = parser.isDigit('z');

    expect(result).toBe(false);
  });

  it('isDigit: symbol returns false', () => {
    const parser = new LineParser();

    const result = parser.isDigit('.');

    expect(result).toBe(false);
  });
  

  it('getLine: empty', () => {
    const text = '';
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: contains line number only is valid', ()=> {
    const text = '1234';
    const expected: Line = { isValid: true, lineNumber: 1234, symbol: null, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  })
  it('getLine: line number followed by whitespace is valid', ()=> {
    const text = '1234 ';
    const expected: Line = { isValid: true, lineNumber: 1234, symbol: null, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: line number followed by non-whitespace is not valid', ()=> {
    const text = '1234alpha';
    const expected: Line = { isValid: false, lineNumber: null, symbol: null, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: Symbol with letter first only is valid', ()=> {
    const symbol: Capture = { text: 'alpha', position: 0 };
    const text = symbol.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: Symbol with dot first only is valid', ()=> {
    const symbol: Capture = { text: '.alpha', position: 0 };
    const text = symbol.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: Symbol with underscore first only is valid', ()=> {
    const symbol: Capture = { text: '_alpha', position: 0 };
    const text = symbol.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: Symbol with numbers only is valid', ()=> {
    const symbol: Capture = { text: 'alpha7bravo2', position: 0 };
    const text = symbol.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: Symbol with dollar signs only is valid', ()=> {
    const symbol: Capture = { text: 'alpha$bravo', position: 0 };
    const text = symbol.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: Symbol with @ only is valid', ()=> {
    const symbol: Capture = { text: 'alpha@bravo', position: 0 };
    const text = symbol.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: Symbol with ? only is valid', ()=> {
    const symbol: Capture = { text: 'alpha?', position: 0 };
    const text = symbol.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: line number followed by symbol is valid', ()=> {
    const lineNumber = 5678;
    const symbol: Capture = { text: 'alpha', position: 5 };
    const text = `${lineNumber} ${symbol.text}`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: line number followed by symbol followed by whitespace is valid', ()=> {
    const lineNumber = 5678;
    const symbol: Capture = { text: 'alpha', position: 5 };
    const text = `${lineNumber}\t${symbol.text}\t`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: symbol, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: opcode only is valid', () => {
    const opcode: Capture = { text: 'clra', position: 1 };
    const text = ` ${opcode.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: bad symbol and opcode only is not valid', () => {
    const symbol: Capture = { text: 'bob', position: 0 };
    const opcode: Capture = { text: 'clra', position: 1 };
    const text = `${symbol}+${opcode.text}`;
    const expected: Line = { isValid: false, lineNumber: null, symbol: null, opcode: null, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: opcode followed by whitespace is valid', () => {
    const opcode: Capture = { text: 'clra', position: 1 };
    const text = ` ${opcode.text}\t`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: psuedo opcode (with period) followed by whitespace is valid', () => {
    const opcode: Capture = { text: '.globl', position: 1 };
    const text = ` ${opcode.text}\t`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: null, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: inherent opcode followed comment is valid', () => {
    const opcode: Capture = { text: 'clra', position: 1 };
    const comment: Capture = { text: 'Clear the index', position: opcode.position + opcode.text.length + 1 };
    const text = ` ${opcode.text}\t${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: inherent psuedo opcode followed comment is valid', () => {
    const opcode: Capture = { text: 'else', position: 1 };
    const comment: Capture = { text: 'Otherwise', position: opcode.position + opcode.text.length + 1 };
    const text = ` ${opcode.text}\t${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: opcode, operand and no comment is valid', () => {
    const opcode: Capture = { text: 'lda', position: 1 };
    const operand: Capture = { text: '#hello', position: opcode.position + opcode.text.length + 1 };
    const text = ` ${opcode.text}\t${operand.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: operand, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);

  });

  it('getLine: lineNumber, opcode, operand and no comment is valid', () => {
    const lineNumber = 32768;
    const opcode: Capture = { text: 'lda', position: 7 };
    const operand: Capture = { text: '#hello', position: opcode.position + opcode.text.length + 1 };
    const text = `${lineNumber} \t${opcode.text}\t${operand.text}`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: null, opcode: opcode, operand: operand, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: lineNumber, symbol, opcode, operand and no comment is valid', () => {
    const lineNumber = 32768;
    const symbol: Capture = { text: 'Loop', position: 6 };
    const opcode: Capture = { text: 'lda', position: symbol.position + symbol.text.length + 1 };
    const operand: Capture = { text: '#hello', position: opcode.position + opcode.text.length + 1 };
    const text = `${lineNumber} ${symbol.text}\t${opcode.text}\t${operand.text}`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: symbol, opcode: opcode, operand: operand, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: lineNumber, symbol, opcode, operand, whitespace and no comment is valid', () => {
    const lineNumber = 32768;
    const symbol: Capture = { text: 'Loop', position: 6 };
    const opcode: Capture = { text: 'lda', position: symbol.position + symbol.text.length + 1 };
    const operand: Capture = { text: '#hello', position: opcode.position + opcode.text.length + 1 };
    const text = `${lineNumber} ${symbol.text}\t${opcode.text}\t${operand.text}\t`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: symbol, opcode: opcode, operand: operand, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: lineNumber, symbol, opcode, operand and comment is valid', () => {
    const lineNumber = 32768;
    const symbol: Capture = { text: 'Loop', position: 6 };
    const opcode: Capture = { text: 'lda', position: symbol.position + symbol.text.length + 1 };
    const operand: Capture = { text: '#hello', position: opcode.position + opcode.text.length + 1 };
    const comment: Capture = { text: 'Start of the loop', position: operand.position + operand.text.length + 1 };
    const text = `${lineNumber} ${symbol.text}\t${opcode.text}\t${operand.text}\t${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: symbol, opcode: opcode, operand: operand, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: psuedo opcode, operand is valid', () => {
    const opcode: Capture = { text: 'fcb', position: 1 };
    const operand: Capture = { text: '$c5,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$cf,$ca', position: opcode.position + opcode.text.length + 1 };
    const text = `\t${opcode.text}\t${operand.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: operand, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: delimited string psueoo opcode, delimited string is valid', () => {
    const opcode: Capture = { text: 'fcn', position: 1 };
    const operand: Capture = { text: '/This is a test|/', position: opcode.position + opcode.text.length + 1 };
    const text = `\t${opcode.text}\t${operand.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: operand, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: string psuedo opcode, string is valid', () => {
    const opcode: Capture = { text: 'error', position: 1 };
    const operand: Capture = { text: 'This is an error!', position: opcode.position + opcode.text.length + 1 };
    const text = `\t${opcode.text}\t${operand.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: opcode, operand: operand, comment: null };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: comment is valid', () => {
    const comment: Capture = { text: '* This is a comment', position: 0 };
    const text = comment.text;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: null, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: whitespace comment is valid', () => {
    const comment: Capture = { text: '* This is a comment', position: 2 };
    const text = `\t\t${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: null, opcode: null, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: lineNumber, comment is valid', () => {
    const lineNumber = 65535;
    const comment:Capture = { text: '* This is a comment', position: 6};
    const text = `${lineNumber} ${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: null, opcode: null, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: lineNumber, symbol, comment is valid', () => {
    const lineNumber = 65535;
    const symbol: Capture = { text: 'comment', position: 6 };
    const comment: Capture = { text: '# This is a comment', position: symbol.position + symbol.text.length + 2 };
    const text = `${lineNumber} ${symbol.text}\t\t${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: lineNumber, symbol: symbol, opcode: null, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: symbol, comment is valid', () => {
    const symbol: Capture = { text: 'comment', position: 0 };
    const comment: Capture = { text: '# This is a comment', position: symbol.position + symbol.text.length + 2 };
    const text = `${symbol.text}\t\t${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: null, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: symbol, opcode, comment is valid', () => {
    const symbol: Capture = { text: 'comment', position: 0 };
    const opcode: Capture = { text: 'clra', position: symbol.position + symbol.text.length + 1 };
    const comment: Capture = { text: '# This is a comment', position: opcode.position + opcode.text.length + 1 };
    const text = `${symbol.text}\t${opcode.text}\t${comment.text}`;
    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: opcode, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

  it('getLine: symbol, opcode, comment is valid', () => {
    const symbol: Capture = { text: 'comment', position: 0 };
    const opcode: Capture = { text: 'bob', position: symbol.position + symbol.text.length + 1 };
    const comment: Capture = { text: '; This is a comment', position: opcode.position + opcode.text.length + 1 };
    const text = `${symbol.text}\t${opcode.text}\t${comment.text}`;

    const expected: Line = { isValid: true, lineNumber: null, symbol: symbol, opcode: opcode, operand: null, comment: comment };
    const lexer = new LineParser();

    const line = lexer.getLine(text);

    expect(line).toBeTruthy();
    expect(line).toEqual(expected);
  });

});
