import { JsonProperty, JsonType } from 'ta-json-x';
import { GuidedLink } from './GuidedLink';

export class GuidedBalloon extends GuidedLink {
  @JsonProperty('audio')
  @JsonType(String)
  public Audio?: string;

  @JsonProperty('clip-path')
  @JsonType(String)
  public ClipPath?: string;

  @JsonProperty('text')
  @JsonType(String)
  public Text?: string;
}
