import { GuidedBalloon } from './GuidedBalloon';
import { JsonElementType, JsonProperty, JsonType } from 'ta-json-x';
import { GuidedLink } from './GuidedLink';

export class GuidedPanel extends GuidedLink {
  @JsonProperty('title')
  @JsonType(String)
  public Title?: string;

  @JsonProperty('audio')
  @JsonType(String)
  public Audio?: string;

  @JsonProperty('balloons')
  @JsonElementType(GuidedBalloon)
  public Balloons?: GuidedBalloon[];

  public get SizeInfo() {
    const pxRegexp = /#xywh=([\d]+),([\d]+),([\d]+),([\d]+)/;
    const m = pxRegexp.exec(this.Href);
    if (!m) {
      return null;
    }

    const [, x, y, width, height] = m.map((v) => Number(v));

    return {
      x,
      y,
      width,
      height,
    };
  }

  public get Width() {
    return this.SizeInfo?.width;
  }

  public get Height() {
    return this.SizeInfo?.height;
  }

  public get X() {
    return this.SizeInfo?.x;
  }

  public get Y() {
    return this.SizeInfo?.y;
  }
}
