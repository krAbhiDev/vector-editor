export class Tool {
  name: string = "Tool";
  icon?: string;
  div?: HTMLDivElement;

  constructor(props: { name: string; icon?: string }) {
    this.name = props.name;
    this.icon = props.icon;
  }
}
