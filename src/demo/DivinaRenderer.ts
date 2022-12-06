import { DivinaElement } from 'DivinaElement';
import { css, html, LitElement, nothing, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('divina-renderer')
export default class DivinaRenderer extends LitElement {
  @property()
  public books = ['tts'];

  @property()
  public selectedBook?: string = "tts";

  private get canGoBack() {
    return this.navIdx > 0;
  }

  private get canGoForward() {
    return this.navIdx + 1 < 0;
  }

  @query("#divina")
  DivinaElement: DivinaElement;

  @property()
  public navIdx = 0;

  private buttonControlClasses(enabled: boolean) {
    return classMap({
      disabled: !enabled,
    });
  }

  protected renderBook(): TemplateResult | typeof nothing {
    if (!this.selectedBook) {
      return nothing;
    }

    const divinaJsonUrl = `/divina/${this.selectedBook}/manifest.json`;

    return html`<divina-element id="divina" divina="${divinaJsonUrl}"></divina-element>`;
  }

  protected renderControlButton(click: (e: Event) => void, isEnabled: boolean, label: string): TemplateResult {
    return html` <button @click="${click}" class="${this.buttonControlClasses(isEnabled)}" ?disabled="${!isEnabled}">${label}</button> `;
  }

  protected renderControls(): TemplateResult | typeof nothing {
    if (!this.selectedBook) {
      return nothing;
    }

    return html`
      <div class="book-controls">
        ${this.renderControlButton(this.prevSegmentEvent, this.canGoBack, 'PREV')}
        <div class="nav-idx"><span>${this.navIdx + 1} / ${0}</span></div>
        ${this.renderControlButton(this.nextSegmentEvent, this.canGoForward, 'NEXT')}
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <header class="book-selector">${this.books.map((book) => html`<button data-book="${book}" @click="${this.selectBookEvent}">${book}</button>`)}</header>

      ${this.renderControls()}

      <section class="content-viewer">${this.renderBook()}</section>

      <footer>DEMO</footer>
    `;
  }

  private readonly prevSegmentEvent = () => {
    if (this.navIdx > 0) {
      this.navIdx -= 1;
    }

    this.updateNarration();
  };

  private readonly nextSegmentEvent = () => {
    this.navIdx = 0;// Math.min(this.navLength - 1, this.navIdx + 1);

    this.updateNarration();
  };

  private updateNarration() {
    this.requestUpdate();
  }

  private readonly selectBookEvent = async (e: MouseEvent) => {
    this.navIdx = 0;

    this.selectedBook = (e.target as HTMLButtonElement).dataset.book;

    this.requestUpdate();
  };

  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    :host .book-selector,
    :host .book-controls {
      display: flex;
      flex-direction: row;
      background-color: blue;
      height: 50px;
      justify-content: center;
    }

    :host .book-controls > .nav-idx {
      line-height: 50px;
      margin: 0 2em;
    }

    :host .book-controls > .nav-idx > span {
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
      color: white;
      font-weight: bolder;
    }

    :host button {
      cursor: pointer;
    }

    :host button[disabled],
    :host button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    :host .content-viewer,
    :host .placeholder {
      flex-grow: 1;
      flex-shrink: 0;
    }

    :host .content-viewer {
      overflow: hidden;
    }

    :host .content-viewer iframe {
      border: 0;
      padding: 0;
      margin: 0 auto;
      height: 100%;
      width: 100vw;
      opacity: 0;
    }

    :host .content-viewer iframe.loaded {
      opacity: 1;
    }

    :host footer {
      background-color: yellow;
      display: block;
      text-align: center;
      justify-content: flex-end;
    }
  `;
}

export interface MediaOverlay {
  role: string;
  narration: MediaOverlayNarration[];
}

export interface MediaOverlayNarration {
  narration: MediaOverlayNarrationNode[];
}

export interface MediaOverlayNarrationNode {
  text: string;
  audio: string;
}
