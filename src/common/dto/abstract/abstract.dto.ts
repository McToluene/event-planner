import AbstractEntity from './entity.abstract';

export abstract class AbstractDto {
  constructor(data?: AbstractEntity) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  abstract getEntity();
}
