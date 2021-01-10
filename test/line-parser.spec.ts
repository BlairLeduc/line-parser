import { inherentOpcodes, operandOpcodes, Token, TokenKind } from '../src/line-common';
import { LineScanner } from '../src/line-parser';

describe('LineScanner', () => {
  it('Can create', () => {

    const lineScanner = new LineScanner();

    expect(lineScanner).toBeTruthy();
  });

  it('Empty string returns empty token list', () => {
    const line = '';
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens).toBeTruthy();
    expect(tokens.length).toBe(0);
  });

  it('String with whitespace returns empty token list', () => {
    const line = '\t   \n\n   ';
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens).toBeTruthy();
    expect(tokens.length).toBe(0);
  });

  it('Line with only line number returns empty token list', () => {
    const line = '00010';
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(0);
  });

  it('Line with only global symbol returns global symbol token', () => {
    const expectedSymbol = 'GlobalSymbol';
    const line = `${expectedSymbol}`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.GlobalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with line number, global symbol returns global symbol token', () => {
    const expectedSymbol = 'GlobalSymbol';
    const line = `12345 ${expectedSymbol}`;
    const expectedToken = new Token(
      expectedSymbol,
      line.indexOf(expectedSymbol),
      line.indexOf(expectedSymbol) + expectedSymbol.length,
      TokenKind.GlobalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with only local Symbol returns single local symbol token', () => {
    const expectedSymbol = 'Local@Symbol';
    const line = `${expectedSymbol}`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.LocalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with only local Symbol returns single local symbol token', () => {
    const expectedSymbol = 'LocalSymbol?';
    const line = `${expectedSymbol}`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.LocalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with only local Symbol returns single local symbol token', () => {
    const expectedSymbol = '$LocalSymbol';
    const line = `${expectedSymbol}`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.LocalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });


  it('Line with only local Symbol returns single local symbol token', () => {
    const expectedSymbol = '_?$@.';
    const line = `${expectedSymbol}`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.LocalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with global symbol followed by whitespace returns single global symbol token', () => {
    const expectedSymbol = 'GlobalSymbol';
    const line = `${expectedSymbol}\t`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.GlobalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with local symbol followed by whitespace returns single local symbol token', () => {
    const expectedSymbol = 'Local?Symbol';
    const line = `${expectedSymbol}\t`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.LocalSymbol);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with invalid local symbol followed by whitespace returns invalid local symbol token', () => {
    const expectedSymbol = '?LocalSymbol';
    const line = `${expectedSymbol}\t`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.LocalSymbol, false);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with invalid global symbol followed by whitespace returns invalid global symbol token', () => {
    const expectedSymbol = '.LocalSymbol';
    const line = `${expectedSymbol}\t`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.GlobalSymbol, false);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with invalid global symbol followed by whitespace returns invalid global symbol token', () => {
    const expectedSymbol = 'foo-bar';
    const line = `${expectedSymbol}\t`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.GlobalSymbol, false);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with invalid global symbol (*) followed by whitespace returns invalid global symbol token', () => {
    const expectedSymbol = 'foo*bar';
    const line = `${expectedSymbol}\t`;
    const expectedToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.GlobalSymbol, false);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedToken);
  });

  it('Line with invalid global symbol starting with a colon followed by whitespace returns invalid global symbol token', () => {
    const expectedSymbol = ':';
    const line = `${expectedSymbol}\t`;
    const expectedToken = new Token('', 0, 0, TokenKind.GlobalSymbol, false);
    const expectedColonToken = new Token(':', 0, 1, TokenKind.Operator);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(2);
    expect(tokens[0]).toEqual(expectedToken);
    expect(tokens[1]).toEqual(expectedColonToken);
  });

  it('Line with global symbol followed by colon returns a global symbol and operator token', () => {
    const expectedSymbol = 'GlobalSymbol';
    const line = `${expectedSymbol}:`;
    const expectedSymbolToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.GlobalSymbol);
    const expectedColonToken = new Token(':', expectedSymbol.length, expectedSymbol.length + 1, TokenKind.Operator);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(2);
    expect(tokens[0]).toEqual(expectedSymbolToken);
    expect(tokens[1]).toEqual(expectedColonToken);
  });

  it('Line with invalid local symbol followed by colon returns invalid local symbol and operator token', () => {
    const expectedSymbol = 'foo-bar@';
    const line = `${expectedSymbol}:`;
    const expectedSymbolToken = new Token(expectedSymbol, 0, expectedSymbol.length, TokenKind.LocalSymbol, false);
    const expectedColonToken = new Token(':', expectedSymbol.length, expectedSymbol.length + 1, TokenKind.Operator);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(2);
    expect(tokens[0]).toEqual(expectedSymbolToken);
    expect(tokens[1]).toEqual(expectedColonToken);
  });

  it('* Comment at start of the line returns comment token', () => {
    const expectedComment = 'Hello there';
    const commentString = `*${expectedComment}`;
    const line = commentString;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('Line number followed by * Comment returns comment token', () => {
    const expectedComment = 'Hello there';
    const commentString = `*${expectedComment}`;
    const line = `1 ${commentString}`;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('* Comment at start of the line followed by whitespace returns comment token', () => {
    const expectedComment = 'Hello Bob!';
    const commentString = `* ${expectedComment}`;
    const line = `${commentString}\t   `;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('; Comment at start of the line returns comment token', () => {
    const expectedComment = 'This is a comment';
    const commentString = `; ${expectedComment}`;
    const line = commentString;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('; Comment at start of the line followed by whitespace returns comment token', () => {
    const expectedComment = 'Loop around the world';
    const commentString = `;${expectedComment}`;
    const line = `${commentString}\t   `;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('* Only comment in the line returns comment token', () => {
    const expectedComment = 'Hello';
    const commentString = `* ${expectedComment}`;
    const line = `\t${commentString}`;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('* Only comment in the line followed by whitespace returns comment token', () => {
    const expectedComment = 'Bob\'s your uncle';
    const commentString = `*${expectedComment}`;
    const line = `           ${commentString}\t   `;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('; Only comment in the line returns comment token', () => {
    const expectedComment = 'Hello';
    const commentString = `; ${expectedComment}`;
    const line = `\t     ${commentString}`;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('; Only comment in the line followed by whitespace returns comment token', () => {
    const expectedComment = ';;;;;;;;;;;;;;;;;;;;;;;';
    const commentString = `;${expectedComment}`;
    const line = `\t\t${commentString}\t   `;
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toEqual(expectedCommentToken);
  });

  it('Global Symbol followed by comment returns global symbol and comment token', () => {
    const expectedSymbol = 'GlobalSymbol';
    const expectedComment = 'Egad, a comment';
    const commentString = `*${expectedComment}`;
    const line = `${expectedSymbol} ${commentString}`;
    const expectedSymbolToken = new Token(
      expectedSymbol,
      line.indexOf(expectedSymbol),
      line.indexOf(expectedSymbol) + expectedSymbol.length,
      TokenKind.GlobalSymbol);
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(2);
    expect(tokens[0]).toEqual(expectedSymbolToken);
    expect(tokens[1]).toEqual(expectedCommentToken);
  });

  it('Local Symbol, colon, comment returns local symbol, colon, comment tokens', () => {
    const expectedSymbol = 'Local@Symbol';
    const expectedComment = '372hf7bv7 62736v-=][;/,';
    const commentString = `; ${expectedComment}`;
    const line = `${expectedSymbol}:${commentString}`;
    const expectedSymbolToken = new Token(
      expectedSymbol,
      line.indexOf(expectedSymbol),
      line.indexOf(expectedSymbol) + expectedSymbol.length,
      TokenKind.LocalSymbol);
    const expectedColonToken = new Token(
      ':',
      line.indexOf(':'),
      line.indexOf(':') + 1,
      TokenKind.Operator);
    const expectedCommentToken = new Token(
      expectedComment,
      line.indexOf(commentString),
      line.indexOf(commentString) + commentString.length,
      TokenKind.Comment);
    const lineScanner = new LineScanner();

    const tokens = lineScanner.parse(line);

    expect(tokens.length).toBe(3);
    expect(tokens[0]).toEqual(expectedSymbolToken);
    expect(tokens[1]).toEqual(expectedColonToken);
    expect(tokens[2]).toEqual(expectedCommentToken);
  });

  ['abx'].forEach(opcode => {

    it(`Inherent opcode ${opcode} returns opcode token`, () => {
      const expectedOpcode = opcode;
      const line = ` ${expectedOpcode}`;
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual(expectedOpcodeToken);
    });

    it(`Inherent opcode ${opcode}, comment returns opcode, comment tokens`, () => {
      const expectedOpcode = opcode;
      const expectedComment = 'Hello there';
      const commentString = `${expectedComment}`;
      const line = ` ${expectedOpcode} ${commentString}`;
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const expectedCommentToken = new Token(
        expectedComment,
        line.indexOf(commentString),
        line.indexOf(commentString) + commentString.length,
        TokenKind.Comment);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(2);
      expect(tokens[0]).toEqual(expectedOpcodeToken);
      expect(tokens[1]).toEqual(expectedCommentToken);
    });

    it(`Symbol, inherent opcode ${opcode}, comment returns symbol, opcode, comment tokens`, () => {
      const expectedSymbol = 'GlobalSymbol';
      const expectedOpcode = opcode;
      const expectedComment = 'Hello there';
      const commentString = `${expectedComment}`;
      const line = `${expectedSymbol} ${expectedOpcode} ${commentString}`;
      const expectedSymbolToken = new Token(
        expectedSymbol,
        line.indexOf(expectedSymbol),
        line.indexOf(expectedSymbol) + expectedSymbol.length,
        TokenKind.GlobalSymbol);
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const expectedCommentToken = new Token(
        expectedComment,
        line.indexOf(commentString),
        line.indexOf(commentString) + commentString.length,
        TokenKind.Comment);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual(expectedSymbolToken);
      expect(tokens[1]).toEqual(expectedOpcodeToken);
      expect(tokens[2]).toEqual(expectedCommentToken);
    });

    it(`Inherent opcode ${opcode}, * comment returns inherent opcode, comment tokens`, () => {
      const expectedOpcode = opcode;
      const expectedComment = 'Hello there';
      const commentString = `* ${expectedComment}`;

      const line = ` ${expectedOpcode} ${commentString}`;
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const expectedCommentToken = new Token(
        expectedComment,
        line.indexOf(commentString),
        line.indexOf(commentString) + commentString.length,
        TokenKind.Comment);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(2);
      expect(tokens[0]).toEqual(expectedOpcodeToken);
      expect(tokens[1]).toEqual(expectedCommentToken);
    });

    it(`Symbol, inherent opcode ${opcode}, comment returns symbol, opcode, comment tokens`, () => {
      const expectedSymbol = 'GlobalSymbol';
      const expectedOpcode = opcode;
      const expectedComment = 'Hello there';
      const commentString = `;${expectedComment}`;
      const line = `${expectedSymbol}:${expectedOpcode} ${commentString}`;
      const expectedSymbolToken = new Token(
        expectedSymbol,
        line.indexOf(expectedSymbol),
        line.indexOf(expectedSymbol) + expectedSymbol.length,
        TokenKind.GlobalSymbol);
      const expectedColonToken = new Token(
        ':',
        line.indexOf(':'),
        line.indexOf(':') + 1,
        TokenKind.Operator);
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const expectedCommentToken = new Token(
        expectedComment,
        line.indexOf(commentString),
        line.indexOf(commentString) + commentString.length,
        TokenKind.Comment);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(4);
      expect(tokens[0]).toEqual(expectedSymbolToken);
      expect(tokens[1]).toEqual(expectedColonToken);
      expect(tokens[2]).toEqual(expectedOpcodeToken);
      expect(tokens[3]).toEqual(expectedCommentToken);
    });
  });

  ['clr'].forEach(opcode => {

    it(`Operand opcode ${opcode}, operand returns opcode, operand tokens`, () => {
      const expectedOpcode = opcode;
      const expectedOperand = '42';
      const line = ` ${expectedOpcode} ${expectedOperand}`;
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const expectedOperandToken = new Token(
        expectedOperand,
        line.indexOf(expectedOperand),
        line.indexOf(expectedOperand) + expectedOperand.length,
        TokenKind.Number);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(2);
      expect(tokens[0]).toEqual(expectedOpcodeToken);
      expect(tokens[1]).toEqual(expectedOperandToken);
    });

    it(`Operand opcode ${opcode}, comment returns opcode, operand, comment tokens`, () => {
      const expectedOpcode = opcode;
      const expectedOperand = '42';
      const expectedComment = 'Hello there';
      const commentString = `${expectedComment}`;
      const line = ` ${expectedOpcode} ${expectedOperand} ${commentString}`;
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const expectedOperandToken = new Token(
        expectedOperand,
        line.indexOf(expectedOperand),
        line.indexOf(expectedOperand) + expectedOperand.length,
        TokenKind.Number);
      const expectedCommentToken = new Token(
        expectedComment,
        line.indexOf(commentString),
        line.indexOf(commentString) + commentString.length,
        TokenKind.Comment);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual(expectedOpcodeToken);
      expect(tokens[1]).toEqual(expectedOperandToken);
      expect(tokens[2]).toEqual(expectedCommentToken);
    });

    it(`Symbol, operand opcode ${opcode}, comment returns symbol, opcode, operand, comment tokens`, () => {
      const expectedSymbol = 'GlobalSymbol';
      const expectedOpcode = opcode;
      const expectedOperand = '42';
      const expectedComment = 'Hello there';
      const commentString = `${expectedComment}`;
      const line = `${expectedSymbol} ${expectedOpcode} ${expectedOperand} ${commentString}`;
      const expectedSymbolToken = new Token(
        expectedSymbol,
        line.indexOf(expectedSymbol),
        line.indexOf(expectedSymbol) + expectedSymbol.length,
        TokenKind.GlobalSymbol);
      const expectedOpcodeToken = new Token(
        expectedOpcode,
        line.indexOf(expectedOpcode),
        line.indexOf(expectedOpcode) + expectedOpcode.length,
        TokenKind.OpCode);
      const expectedOperandToken = new Token(
        expectedOperand,
        line.indexOf(expectedOperand),
        line.indexOf(expectedOperand) + expectedOperand.length,
        TokenKind.Number);
      const expectedCommentToken = new Token(
        expectedComment,
        line.indexOf(commentString),
        line.indexOf(commentString) + commentString.length,
        TokenKind.Comment);
      const lineScanner = new LineScanner();

      const tokens = lineScanner.parse(line);

      expect(tokens.length).toBe(4);
      expect(tokens[0]).toEqual(expectedSymbolToken);
      expect(tokens[1]).toEqual(expectedOpcodeToken);
      expect(tokens[2]).toEqual(expectedOperandToken);
      expect(tokens[3]).toEqual(expectedCommentToken);
    });
  });
});