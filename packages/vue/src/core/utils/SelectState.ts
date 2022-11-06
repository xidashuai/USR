export default class SelectState {
  constructor() {}
  selected: boolean = false
  setSelect() {
    this.selected = true
  }
  unSelect() {
    this.selected = false
  }
  toggleSelect() {
    this.selected = !this.selected
  }
}
