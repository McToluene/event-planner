export abstract class AbstractError extends Error {
  message: string;
  code?: string;
  params?: Record<any, any>;

  constructor(message: string);
  constructor(message: string, code: string);
  constructor(message: string, code: string, params: Record<any, any>);
  constructor(message: string, code?: string, params?: Record<any, any>) {
    super(message);

    this.code = code;
    this.params = params;
  }

  toString() {
    if (this.code) {
      return `${this.code}: ${this.message}`;
    }

    return `${this.message}`;
  }
}
