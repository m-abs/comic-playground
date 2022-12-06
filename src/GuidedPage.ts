import { JsonProperty, JsonElementType, JsonType } from 'ta-json-x';
import { GuidedLink } from "./GuidedLink";
import { GuidedPanel } from "./GuidedPanel";


export class GuidedPage extends GuidedLink {
    @JsonProperty("title")
    @JsonType(String)
    public Title = "";

    @JsonProperty("panels")
    @JsonElementType(GuidedPanel)
    public Panels: GuidedPanel[] = [];
}
