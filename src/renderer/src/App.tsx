function App(): React.JSX.Element {
  // IPC example - sends 'ping' to main process
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="container">
      <h1>Mr. Parsypants</h1>
      <button onClick={ipcHandle}>Send IPC</button>
    </div>
  )
}

export default App
