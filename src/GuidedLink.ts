import { JsonProperty, JsonType } from 'ta-json-x';


export class GuidedLink {
    @JsonProperty("href")
    @JsonType(String)
    public Href = "";
}
