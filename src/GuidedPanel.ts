import { GuidedBalloon } from './GuidedBalloon';
import { JsonElementType, JsonProperty, JsonType } from 'ta-json-x';
import { GuidedLink } from "./GuidedLink";

export class GuidedPanel extends GuidedLink {
    @JsonProperty("title")
    @JsonType(String)
    public Title?: string;

    @JsonProperty("audio")
    @JsonType(String)
    public Audio?: string;

    @JsonProperty("balloons")
    @JsonElementType(GuidedBalloon)
    public Balloons?: GuidedBalloon[];
}
