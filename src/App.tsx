import Alerts from './components/Alerts'
import Clock from './components/Clock'
import Containers from './components/Containers'
import Links from './components/Links'
import Processes from './components/Processes'
import ServerActivity from './components/ServerActivity'
import ServerInfo from './components/ServerInfo'
import Shellys from './components/Shellys'
import { useConfig } from './hooks/useConfig'

function App() {
  const { data: config, error: configError } = useConfig()

  return (
    <div className="container py-4">
      <header className="mb-5">
        <Clock />
      </header>
      <main>
        <Alerts />
        {configError && !config && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-x" />
            Não foi possível ler <code>config/config.json</code>.
          </div>
        )}
        <Shellys devices={config?.shellys} />
        <ServerInfo />
        <ServerActivity />
        <section className="row g-3 mb-5">
          <div className="col-lg-7">
            <Containers />
          </div>
          <div className="col-lg-5">
            <Processes />
          </div>
        </section>
        <Links links={config?.links} />
      </main>
    </div>
  )
}

export default App
