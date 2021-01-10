export const inherentOpcodes = new Set([
  'abx',
  'asla', 'aslb', 'asld', 'asra', 'asrb', 'asrd',
  'clra', 'clrb', 'clrd', 'clre', 'clrf', 'clrw',
  'coma', 'comb', 'comd', 'come', 'comf', 'comw',
  'daa',
  'deca', 'decb', 'decd', 'dece', 'decf', 'decw',
  'inca', 'incb', 'incd', 'ince', 'incf', 'incw',
  'lsla', 'lslb', 'lsld', 'lsra', 'lsrb', 'lsrd', 'lsrw',
  'mul',
  'nega', 'negb', 'negd',
  'nop',
  'pshsw', 'pshuw', 'pulsw', 'puluw',
  'rola', 'rolb', 'rold', 'rolw', 'rora', 'rorb', 'rord', 'rorw',
  'rti', 'rts',
  'sex', 'sexw',
  'swi', 'swi2', 'swi3',
  'sync',
  'tsta', 'tstb', 'tstd', 'tste', 'tstf', 'tstw',
]);

export const operandOpcodes = new Set([
  'adca', 'adcb', 'adcd', 'adcr',
  'adda', 'addb', 'addd', 'adde', 'addf', 'addr', 'addw',
  'aim',
  'anda', 'andb', 'andcc', 'andd', 'andr',
  'asl', 'asr', 'band', 'biand', 'beor', 'bieor',
  'bita', 'bitb', 'bitd', 'bitmd',
  'bor', 'bior',
  'bcc', 'lbcc', 'bcs', 'lbcs', 'beq', 'lbeq', 'bge', 'lbge', 'bgt', 'lbgt',
  'bhi', 'lbhi', 'bhs', 'lbhs', 'ble', 'lble', 'blo', 'lblo', 'bls', 'lbls',
  'blt', 'lblt', 'bmi', 'lbmi', 'bne', 'lbne', 'bpl', 'lbpl', 'bra', 'lbra',
  'brn', 'lbrn', 'bsr', 'lbsr', 'bvc', 'lbvc', 'bvs', 'lbvs',
  'clr',
  'cmpa', 'cmpb', 'cmpd', 'cmpe', 'cmpf', 'cmpr', 'cmps', 'cmpu', 'cmpw', 'cmpx', 'cmpu',
  'com', 'cwai', 'dec', 'divd', 'divq', 'eim',
  'eora', 'eorb', 'eord', 'eorr', 'exg', 'inc',
  'jmp', 'jsr',
  'lda', 'ldb', 'ldd', 'lde', 'ldf', 'ldmd', 'ldq', 'lds', 'ldu', 'ldw', 'ldx', 'ldy',
  'ldbt',
  'leas', 'leau', 'leax', 'leay',
  'lsl', 'lsr', 'muld', 'neg', 'oim',
  'ora', 'orb', 'orcc', 'ord', 'orr',
  'pshu', 'pshs', 'pulu', 'puls',
  'rol', 'ror',
  'sbca', 'sbcb', 'sbcd', 'sbcr',
  'sta', 'stb', 'std', 'ste', 'stf', 'stq', 'sts', 'stu', 'stw', 'stx', 'sty',
  'stbt',
  'suba', 'subb', 'subd', 'sube', 'subf', 'subr', 'subw',
  'tfm', 'tim', 'tst'
]);

export const inherentPseudoOps = new Set([
  'reorg', 'else', 'endc', 'emod', 'endm', 'endstruct', 'ends', 'endsection', 'endsect',
  'extern', 'external', 'import', 'export', '.globl', 'extdep', 
]);

export const pseudoOps = new Set([
  '.4byte', '.area', '.ascii', '.ascis', '.asciz', '.blkb', '.byte', 
  '.db', '.ds', '.dw', '.quad', '.rs', '.str', '.strs', '.strz', '.word', 
  '*pragma', '*pragmapop', '*pragmapush', 
  'align', 'end', 'equ', 'error', 
  'fcb', 'fcc', 'fcn', 'fcs', 'fdb', 'fill', 
  'fqb', 'ifdef', 'ifeq', 'ifge', 'ifgt', 'ifle', 'iflt', 'ifndef', 'ifne', 'ifpragma', 
  'import', 'include', 'includebin', 'macro', 'mod', 'nam', 'org', 'os9', 'pragma', 
  'rmb', 'rmd', 'rmq', 'sect', 'section', 'set', 'setdp', 'struct', 'use', 'warning', 
  'zmb', 'zmd', 'zmq', 
]);


export enum TokenKind {
    Constant,
    Variable,
    Type,
    GlobalSymbol,
    GlobalReference,
    LocalSymbol,
    LocalReference,
    OpCode,
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
  