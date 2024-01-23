import { ButtonType } from '../typings/button.js';

export class Button {
  constructor(buttonOptions: ButtonType) {
    Object.assign(this, buttonOptions);
  }
}
