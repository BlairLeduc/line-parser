import { Token, TokenKind } from './line-common';

export class LineScanner {
  private constantRegExp: RegExp;
  private opcodeRegExp: RegExp;
  private pseudoRegExp: RegExp;
  private storageRegExp: RegExp;

  constructor() {
    this.constantRegExp = new RegExp('equ|set', 'i');

    const ob = 'c[cs]|eq|g[et]|h[is]|l[eost]|mi|ne|pl|r[an]|sr|v[cs]';
    const o1 = 'a(bx|dc[abdr]|dd[abdefrw]|im|nd([abdr]|cc)|s[lr][abd]?)|b(' + ob + '|i?and|i?eor|i?or|it([abd]|md))';
    const o2 = '|clr[abdefw]?|cmp[abefdwxyrsu]|com[abdefw]?|cwia|daa|dec[abdefw]?|div[dq]|e(im|or[abdr]|xg)|inc[abdefw]?';
    const o3 = '|j(mp|sr)|lb(' + ob + ')|ld([abdrfwxyusuq]|bt|md)|lea[xysu]|ls[lr][abdw]?|muld?|neg[abd]?|nop';
    const o4 = '|o(im|r([abdr]|cc))|psh[su]w?|pul[su]w?|ro[lr][abdw]?|rt[is]';
    const o5 = '|sbc[abdr]|sexw?|st([abefdwxysuq]|bt)|sub[abdefr]|swi[23]?|sync|t(fm|fr|im|st[abdefw]?)';
    this.opcodeRegExp = new RegExp('^(' + o1 + o2 + o3 + o4 + o5 + ')$', 'i');

    const p1 = '([.](4byte|asci[isz]|area|blkb|byte|d[bsw]|globl|module|quad|rs|str[sz]?|word))|([*]?pragma(push|pop)?)|align';
    const p2 = '|e(lse|mod|nd([cms]|sect(ion)?|struct)?|qu|rror|xport|xtdep|xtern(al)?)|fc[bcns]|fdb|f(ill|qb)';
    const p3 = '|if(def|eq|g[et]|l[et]|ndef|ne|pragma)|import|include(bin)?|m(acro|od)|nam|o(rg|s9)|pragma|rm[bdq]|set(dp)?';
    const p4 = "|struct|use|warning|zm[bdq]";
    this.pseudoRegExp = new RegExp('^(' + p1 + p2 + p3 + p4 + ')$', 'i');

    const s1 = '[.](4byte|asci[isz]|blkb|byte|d[bsw]|globl|quad|rs|str[sz]?|word)|f[dq]b|fc[bcns]|import|[zr]m[dbq]';
    const s2 = '|includebin|fill';
    this.storageRegExp = new RegExp('^(' + s1 + s2 + ')$', 'i');

  }

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
      tokens.push(new Token(commentMatch[2].trimEnd(), pos + space, pos + space + commentMatch[0].trim().length, TokenKind.Comment));
      return tokens;
    }

    // Line starting with a symbol
    const symbolMatch = /^([^\s:]+)/i.exec(text); // match everything until a space or colon
    if (symbolMatch) {
      const name = symbolMatch[1];
      const isValid = /^([a-z_@$][a-z0-9.$_@?]+)$/i.test(name);
      const isLocal = /.*[$@?].*/.test(name);
      tokens.push(new Token(name, pos, pos + name.length, isLocal ? TokenKind.LocalSymbol : TokenKind.GlobalSymbol, isValid));
      
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
        tokens.push(new Token('', pos, pos, TokenKind.GlobalSymbol, false));
      }
      tokens.push(new Token(':', pos, pos + 1, TokenKind.Operator));
      
      text = ' ' + line.substr(pos + 1); // replace the colon with a space for next match
      if (!text) {
        return tokens; // end of the line, return
      }
    }

    // Symbol followed by a comment
    commentMatch = /^(?:(\s+)[*;])(.*)/.exec(text); // 
    if (commentMatch) {
      const space = commentMatch[1].length;
      tokens.push(new Token(commentMatch[2].trim(), space + pos, space + pos + commentMatch[0].trim().length, TokenKind.Comment));
      return tokens;
    }

    // Opcode, Pseudo-op, macro or struct
    const opcodeMatch = /^(\s)([^\s]+)/i.exec(text); // match everything until a space
    if (opcodeMatch) {
      const space = opcodeMatch[1].length;
      const name = opcodeMatch[2];
      tokens.push(new Token(name, pos + space, pos + space + name.length, TokenKind.OpCode));
      
      pos += opcodeMatch[0].length;
      text = line.substr(pos);
      if (!text) {
        return tokens; // end of the line, return
      }
    }

    // End of line comment
    commentMatch = /^(?:(\s+)[*;]?)(.*)/.exec(text); // 
    if (commentMatch && commentMatch[2]) {
      const space = commentMatch[1].length;
      tokens.push(new Token(commentMatch[2].trim(), space + pos, space + pos + commentMatch[0].trim().length, TokenKind.Comment));
      return tokens;
    }    

    return tokens;
  }
}