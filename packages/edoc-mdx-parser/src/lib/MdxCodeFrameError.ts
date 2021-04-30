export interface IMdxCodeFrameErrorOptions {
  message?: string;
  line?: number;
  column?: number;
}

export default class MdxCodeFrameError extends SyntaxError {
  line: number;
  column: number;

  constructor(options: IMdxCodeFrameErrorOptions = {}) {
    super(options.message);

    this.line = options.line;
    this.column = options.column;
  }
}