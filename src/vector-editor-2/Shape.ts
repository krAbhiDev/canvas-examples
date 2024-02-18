import { Color } from "../others/Color";
import Point from "../others/Point";
import { Rect } from "../others/Rect";
import { Render } from "../others/Render";
import { immerable, produce } from "immer";
export class Shape {
  private static _idCounter = 0;
  color = Color.fromString("aqua");
  center = new Point(0, 0);
  private _id = Shape._idCounter++;
  [immerable] = true;
  constructor() {}
  get id() {
    return this._id;
  }
  get x() {
    return this.center.x;
  }
  get y() {
    return this.center.y;
  }

  toString() {
    return `color: ${this.color}, center: ${this.center.toString()}`;
  }
  draw(render: Render) {}
  getBounds() {
    return new Rect(this.x, this.y, 0, 0);
  }
}

export class CircleShape extends Shape {
  radius = 10;
  [immerable] = true;

  override toString(): string {
    return super.toString() + `, radius: ${this.radius}`;
  }
  draw(render: Render) {
    render.drawCircle(this.center, this.radius, {
      fillColor: this.color.toString(),
      mode: "fill",
    });
  }
  getBounds(): Rect {
    return new Rect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}

export class RectShape extends Shape {
  width = 10;
  height = 10;
  [immerable] = true;
  override toString(): string {
    return super.toString() + `, width: ${this.width}, height: ${this.height}`;
  }
  draw(render: Render) {
    render.drawRect2(Rect.fromCenter(this.center, this.width, this.height), {
      fillColor: this.color.toString(),
      mode: "fill",
    });
  }
}
