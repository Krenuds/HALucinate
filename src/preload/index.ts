import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  windowMinimize: (): void => electronAPI.ipcRenderer.send('window-minimize'),
  windowMaximize: (): void => electronAPI.ipcRenderer.send('window-maximize'),
  windowClose: (): void => electronAPI.ipcRenderer.send('window-close'),
  getProjectFolder: (): Promise<string | null> =>
    electronAPI.ipcRenderer.invoke('get-project-folder'),
  selectProjectFolder: (): Promise<string | null> =>
    electronAPI.ipcRenderer.invoke('select-project-folder')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
