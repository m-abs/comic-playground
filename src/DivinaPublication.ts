import { Publication } from "r2-shared-js/dist/es8-es2017/src";
import { JsonProperty, JsonElementType } from 'ta-json-x';
import { GuidedPage } from "./GuidedPage";

export default class DivinaPublication extends Publication {
    @JsonProperty("guided")
    @JsonElementType(GuidedPage)
    public Guided: GuidedPage[] = [];
}