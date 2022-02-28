import { Capture, Line, 
         delimitedStringPseudoOps, inherentOpcodes, inherentPseudoOps, stringPseudoOps, TokenSequence, TokenKind, Token } from './line-common';


export class LineParser {

  public getLine(text: string): Line {
    const line = new Line();
    let pos = 0;
    const length = text.length;
    let ch = text[0];

    if (text.trim() === '') {
      return line;
    }

    // Line number at the start of a line?
    if (this.isDigit(ch)) {
      let lineNumber = '';

      // Consume all digits
      while (pos < length && this.isDigit(ch)) {
        lineNumber += ch;
        ch = text[++pos];
      }

      // A line number must be followed by the end of line or a single whitespace character
      // Fail if not
      if (pos < length && !this.isWhitespace(text[pos])) {
        line.isValid = false;
        return line;
      }

      line.lineNumber = Number(lineNumber);

      if (pos < length) {
        ch = text[++pos]; // Consume the whitespace character after the line number
      }
    }

    // Comment? Consume and end
    if (pos < length && (this.isCommentStarter(ch))) {
      line.comment = { text: text.substring(pos), position: pos };
      return line;
    }

    // Symbol at the start of line (after the optional line number)?
    if (pos < length && (this.isLetter(ch) || ch[0] === '.' || ch[0] === '_')) {
      let symbol: Capture = { text: '', position: pos };

      // Consume the symbol
      while (pos < length
        && (this.isLetter(ch) || this.isDigit(ch)
          || ch[0] === '.' || ch[0] === '_' || ch[0] === '$'
          || ch[0] === '@' || ch[0] === '?')) {
        symbol.text += ch;
        ch = text[++pos];
      }

      line.symbol = symbol;
    }

    // Now look for opcode

    // Opcodes need at least one whitespace character or this is an error
    if (pos < length && !this.isWhitespace(ch)) {
      line.isValid = false;
      return line;
    }

    // Consume whitespace
    //pos = this.consumeWhitespace(text, pos, length);
    while (pos < length && this.isWhitespace(ch)) {
      ch = text[++pos];
    }

    // is this an opcode here?
    if (pos < length && (this.isLetter(ch) || ch[0] === '.')) {
      let opcode: Capture = { text: '', position: pos };

      // Consume all opcode
      while (pos < length && !this.isWhitespace(ch)) {
        opcode.text += ch;
        ch = text[++pos];
      }
      line.opcode = opcode;
    }

    // End of line?
    if (pos >= length) {
      return line;
    }

    // Consume whitespace
    while (pos < length && this.isWhitespace(ch)) {
      ch = text[++pos];
    }

    // End of line?
    if (pos >= length) {
      return line;
    }

    // Comment? Consume and end
    if (pos < length && this.isCommentStarter(ch)) {
      line.comment = { text: text.substring(pos), position: pos };
      return line;
    }

    if (line.opcode) {
      // Should we expect an operand?
      const lowerOpcode = line.opcode.text.toLowerCase();

      if (!(inherentOpcodes.has(lowerOpcode) || inherentPseudoOps.has(lowerOpcode))) {
        let operand: Capture = { text: '', position: pos };

        if (delimitedStringPseudoOps.has(lowerOpcode)) {
          // Comsume the delimited string
          operand.text += ch;

          const endCh = ch;
          ch = text[++pos];

          while (pos < length && ch[0] != endCh) {
            operand.text += ch;
            ch = text[++pos];
          }

          operand.text += ch;
          pos++;
        } else if (stringPseudoOps.has(lowerOpcode)) {
          // Consume the rest of the line for these pseudo ops
          operand.text = text.substring(pos);
          pos = length;
        } else {
          // Consume the operand
          while (pos < length && !this.isWhitespace(ch)) {
            operand.text += ch;
            ch = text[++pos];
          }
        }

        line.operand = operand;
      }
    }

    // End of line?
    if (pos >= length) {
      return line;
    }

    // Consume whitespace
    while (pos < length && this.isWhitespace(ch)) {
      ch = text[++pos];
    }

    // End of line?
    if (pos >= length) {
      return line;
    }

    // Consume the comment, if any
    if (pos < length) {
      let comment: Capture = { text: '', position: pos };

      while (pos < length) {
        comment.text += ch;
        ch = text[++pos];
      }

      line.comment = comment;
    }

    return line;
  }

  public getTokens(text: string): TokenSequence {
    const sequence: TokenSequence = [];
    const length = text.length;
    let pos = 0;

    if (text.trim() === '') {
      return [];
    }

    while(pos < length) {
      let ch = text[pos];

      if (this.isDigit(ch)) {
        let capture: Capture = { text: '', position: pos };

        while (pos < length && this.isDigit(ch)) {
          capture.text += ch;
          ch = text[++pos];
        }

        sequence.push(new Token(capture, TokenKind.Number));
      }

    }
    return sequence;
  }

  public isLetter(ch: string): boolean {
    return ((ch[0] >= 'a' && ch[0] <= 'z') || (ch[0] >= 'A' && ch[0] <= 'Z'));
  }

  public isDigit(ch: string): boolean {
    return ch[0] >= '0' && ch[0] <= '9';
  }

  public isWhitespace(ch: string): boolean {
    return ch[0] === ' ' || ch[0] === '\t';
  }

  public isCommentStarter(ch: string): boolean {
    return ch[0] === '*' || ch[0] === ';';
  }

}
