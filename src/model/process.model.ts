import { action, computed, observable } from 'mobx'

class Process {
  @observable private _curStep = 2

  @observable editing = false

  @action.bound
  changeStep(step: number) {
    this._curStep = step
  }

  @action.bound
  toggleEditState(state: boolean) {
    this.editing = state
  }

  @computed
  get step() {
    return this._curStep
  }
}

export const process = new Process()
