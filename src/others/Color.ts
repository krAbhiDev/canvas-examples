import { toInt } from "./utils";
import { immerable, produce } from "immer";

export class Color {
  [immerable] = true;
  colorString = "";
  constructor(public r = 0, public g = 0, public b = 0, public a = 255) {}
  // Create a Color instance from a hexadecimal color string
  public static fromHex(hex: string): Color {
    // Remove the leading '#' if present
    hex = hex.replace("#", "");

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = parseInt(hex.slice(6, 8), 16) || 255;

    return new Color(r, g, b, a);
  }
  public static fromString(colorString: string): Color {
    const color = new Color();
    color.colorString = colorString;
    return color;
  }

  //return color in canvas color format
  public toString(): string {
    if (this.colorString) return this.colorString;
    //to #RRGGBB format
    return `#${this.r.toString(16).padStart(2, "0")}${this.g
      .toString(16)
      .padStart(2, "0")}${this.b.toString(16).padStart(2, "0")}`;
    // return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
  // static random:Color
  public static random(alpha?: number): Color {
    return new Color(
      toInt(Math.random() * 255),
      toInt(Math.random() * 255),
      toInt(Math.random() * 255),
      (alpha || 255) / 255
    );
  }
}
