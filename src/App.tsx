import Clock from './components/Clock'
import Containers from './components/Containers'
import Links from './components/Links'
import Processes from './components/Processes'
import ServerActivity from './components/ServerActivity'
import ServerInfo from './components/ServerInfo'
import Shellys from './components/Shellys'

function App() {
  return (
    <div className="container py-4">
      <header className="mb-5">
        <Clock />
      </header>
      <main>
        <Shellys />
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
        <Links />
      </main>
    </div>
  )
}

export default App
