/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TaJson } from 'ta-json-x';
import DivinaPublication from './DivinaPublication';

@customElement('divina-element')
export class DivinaElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 0;
      margin: 0;
      position: relative;
    }

    :host > div.container, :host > div.container > div {
      position: absolute;
      max-height: 100vh;
      top: 0;
      left: 0;
      box-sizing: border-box;
    }

    :host > div.container img {
      max-height: 100vh;
      max-width: 100vw;
    }
    
    :host div.balloon-highlight {
      background-color: rgba(116, 116, 116, 0.4);
    }

    :host div.balloon-highlight img {
      clip-path: var(--balloon-clip-path);
    }

    :host div.panel-highlight {
      background-color: rgba(30, 30, 30, 0.45);
    }

    :host div.panel-highlight img {
      clip-path: var(--panel-clip-path);
    }
  `;

  @property()
  private publication?: DivinaPublication;

  private _divinaJsonUrl?: string;

  @property()
  public loading = true;

  public get divinaJsonUrl() {
    return this._divinaJsonUrl;
  }

  @property({ attribute: "divina" })
  public set divinaJsonUrl(value: string) {
    if (this._divinaJsonUrl != value) {
      this._divinaJsonUrl = new URL(value, location.href).href;

      this._loadComic();
    }
  }

  @property()
  public pageIdx = 0;

  private get page() {
    return this.publication?.Guided?.[this.pageIdx];
  }

  private get readingItem()
  {
    return this.publication?.Spine?.[this.pageIdx];
  }

  private get comicPageUrl() {
    const path = this.page?.Href;
    if (!path) {
      return null;
    }

    return new URL(path, this.divinaJsonUrl).href;
  }

  @property()
  public panelIdx = 0;

  private get currentPanel() {
    return this.page?.Panels?.[this.panelIdx];
  }

  @property()
  public balloonIdx = 0;

  private get currentBalloon() {
    return this.currentPanel?.Balloons?.[this.balloonIdx];
  }

  private get balloonClipPath()
  {
    return this.currentBalloon?.ClipPath;
  }

  private get panelClipPath()
  {
    const readingItem = this.readingItem;
    if (!readingItem)
    {
      return null;
    }

    const { Height: pageHeight, Width: pageWidth } = readingItem;

    const panel = this.currentPanel;
    if (!panel)
    {
      return null;
    }

    const hash = new URL(panel.Href, this.comicPageUrl).hash;

    const pxRegexp = /#xywh=([\d]+),([\d]+),([\d]+),([\d]+)/;
    const m = hash.match(pxRegexp);
    if (!m)
    {
      return null;
    }

    const [, x, y, width, height ] = m.map((v) => Number(v));

    const topPct = y / pageHeight * 100;
    const rightPct = 100 - (x + width) / pageWidth * 100;
    const leftPct = x / pageWidth * 100;
    const bottomPct = 100 - (y + height) / pageHeight * 100;

    return `inset(
      ${topPct}%
      ${rightPct}%
      ${bottomPct}%
      ${leftPct}%
    )`;
  }

  public get styles()
  {
    return {
      '--balloon-clip-path': this.balloonClipPath,
      '--panel-clip-path': this.panelClipPath,
    }
  }

  private async _loadComic() {
    const response = await fetch(this._divinaJsonUrl);
    this.publication = TaJson.parse(await response.text(), DivinaPublication);
  }

  override render() {
    const comicPageUrl = this.comicPageUrl;
    if (!comicPageUrl) {
      return html`<div>Loading</div>`;
    }

    return html`
      <div class="container" style=${styleMap(this.styles)}>
        <div class="page">
          <img src="${this.comicPageUrl}" />
        </div>
        <div class="panel-highlight">
          <img src="${this.comicPageUrl}" />
        </div>
        <div class="balloon-highlight">
          <img src="${this.comicPageUrl}" />
        </div> 
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': DivinaElement;
  }
}
