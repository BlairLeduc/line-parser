import { operandOpcodes, Token, TokenKind } from './line-common';

export class LineScanner {

  public parse(line: string): Token[] {

    // Empty line
    if (line.trim() === '') {
      return [];
    }

    const tokens: Token[] = [];
    let pos = 0;
    let text = line;

    // Line number
    const lineNumberMatch = /^[0-9]+([ ]|$)/.exec(text);
    if (lineNumberMatch) {
      pos += lineNumberMatch[0].length;
      text = line.substr(pos);
      if (!text) {
        return tokens; // end of the line, return
      }
    }

    // Line with only comment
    let commentMatch = /^(?:(\s*)[*;#])\s*(.*)/.exec(text);
    if (commentMatch) {
      const space = commentMatch[1].length;
      tokens.push(new Token(commentMatch[2].trimEnd(), pos + space, commentMatch[0].trim().length, TokenKind.Comment));
      return tokens;
    }

    // Line starting with a symbol
    const symbolMatch = /^([^\s:]+)/i.exec(text); // match everything until a space or colon
    if (symbolMatch) {
      const name = symbolMatch[1];
      const isValid = /^([a-z_@$][a-z0-9.$_@?]+)$/i.test(name);
      const isLocal = /.*[$@?].*/.test(name);
      tokens.push(new Token(name, pos, name.length, TokenKind.Symbol, isValid, isLocal));

      pos += symbolMatch[0].length;
      text = line.substr(pos);
      if (!text) {
        return tokens; // end of the line, return
      }
    }

    // Symbol can be followed bt a colon (acts like a space)
    const colonFound = text.startsWith(':');
    if (colonFound) {
      if (!symbolMatch) {
        // A colon preceeded by nothing is an empty symbol (invalid)
        tokens.push(new Token('', pos, 0, TokenKind.Symbol, false));
      }
      tokens.push(new Token(':', pos, 1, TokenKind.Operator));

      text = ' ' + line.substr(pos + 1); // replace the colon with a space for next match
      if (text === ' ') {
        return tokens; // end of the line, return
      }
    }

    // Symbol followed by a comment
    commentMatch = /^(?:(\s+)[*;])(.*)/.exec(text); // 
    if (commentMatch) {
      const space = commentMatch[1].length;
      tokens.push(new Token(commentMatch[2].trim(), space + pos, commentMatch[0].trim().length, TokenKind.Comment));
      return tokens;
    }

    // Opcode, Pseudo-op, macro or struct
    let opcode: string = '';
    const opcodeMatch = /^(\s)([^\s]+)/i.exec(text); // match everything until a space
    if (opcodeMatch) {
      const space = opcodeMatch[1].length;
      opcode = opcodeMatch[2];
      tokens.push(new Token(opcode, pos + space, opcode.length, TokenKind.OpCode));

      pos += opcodeMatch[0].length;
      text = line.substr(pos);
      if (!text) {
        return tokens; // end of the line, return
      }
    }

    // if opcode needs operand, match and consume
    if (opcode && operandOpcodes.has(opcode)) {
      const operandMatch = /^(\s)([^\s]+)/i.exec(text); // match everything until a space
      if (operandMatch) {
        const space = operandMatch[1].length;
        let expression = operandMatch[2];
        let offset = 0;
        while (expression.length > 0) {
          const match = this.findMatch(expression);
          const length = match[0][0].length;

          tokens.push(new Token(match[0][0], pos + space + offset, length, match[1]));
          expression = expression.substring(length);
          offset += length;
        }

        pos += operandMatch[0].length;
        text = line.substr(pos);
        if (!text) {
          return tokens; // end of the line, return
        }
      }
    }

    // End of line comment
    commentMatch = /^(?:(\s+)[*;]?)(.*)/.exec(text); // 
    if (commentMatch && commentMatch[2]) {
      const space = commentMatch[1].length;
      tokens.push(new Token(commentMatch[2].trim(), space + pos, commentMatch[0].trim().length, TokenKind.Comment));
      return tokens;
    }

    return tokens;
  }


  private findMatch(s: string): [RegExpMatchArray, TokenKind] {
    let tokenKind = TokenKind.Number;
    let match = /^(('.)|("..))/.exec(s); // character constant
    if (!match) {
      match = /^((\$|(0x))[0-9a-f]*)|([0-9][0-9a-f]*h)/i.exec(s); // hex number
    }
    if (!match) {
      match = /^((@[0-7]+)|([0-7]+[qo]))/i.exec(s); // octal number
    }
    if (!match) {
      match = /^((%[01]+)|([01]+b))/i.exec(s); // binary number
    }
    if (!match) {
      match = /^((&[0-9]+)|([0-9]+))/i.exec(s); // decimal number
    }
    if (!match) {
      match = /^([a-z_@$][a-z0-9.$_@?]*)/i.exec(s); // reference
      if (match) {
        tokenKind = TokenKind.Reference;
      }
    }
    if (!match) {
      tokenKind = TokenKind.Operator;
      match = /^((&&)|(\|\|)|(\+\+)|(--))/.exec(s); // two character operator
      if (!match) {
        match = /./.exec(s); // if all else fails, match the next character as an operator.
      }
    }
    
    return [match!, tokenKind];
  };
}