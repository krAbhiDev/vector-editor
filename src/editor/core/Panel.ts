export abstract class Panel {
  protected htmlDiv: HTMLDivElement | undefined = undefined;
  protected createHTML() {}
  onStart() {}
  html(): HTMLDivElement | undefined {
    return this.htmlDiv;
  }
  clearHtml() {
    if (this.htmlDiv) {
      this.htmlDiv.innerHTML = "";
    }
  }
  update() {}
}
