export enum TokenKind {
    Constant,
    Variable,
    Type,
    GlobalSymbol,
    GlobalReference,
    LocalSymbol,
    LocalReference,
    Keyword,
    String,
    Number,
    Operator,
    Comment,
    FileName,
    Property,
    PropertyReference,
  }
  
  export class Token {
    constructor(
      public text: string,
      public start: number,
      public end: number,
      public kind: TokenKind,
      public isValid: boolean = true,
    ) {}
  }
  