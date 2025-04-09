import { BrowserWindow } from 'electron'
import { getDevicesStore } from '../lib/store'
import * as window from 'share/main/lib/window'
import once from 'licia/once'
import { handleEvent } from 'share/main/lib/util'
import { IpcGetStore, IpcSetStore } from 'share/common/types'

const store = getDevicesStore()

let win: BrowserWindow | null = null

export function showWin() {
  if (win) {
    win.focus()
    return
  }

  initIpc()

  win = window.create({
    name: 'devices',
    minWidth: 960,
    minHeight: 640,
    ...store.get('bounds'),
    onSavePos: () => window.savePos(win, store),
  })

  win.on('close', () => {
    win?.destroy()
    win = null
  })

  window.loadPage(win, { page: 'devices' })
}

const initIpc = once(() => {
  handleEvent('setDevicesStore', <IpcSetStore>(
    ((name, val) => store.set(name, val))
  ))
  handleEvent('getDevicesStore', <IpcGetStore>((name) => store.get(name)))
})
