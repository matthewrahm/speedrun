import Hero from './components/Hero'
import LiveMetrics from './components/LiveMetrics'
import SpeedrunSplits from './components/SpeedrunSplits'
import Chart from './components/Chart'
import MilestoneMoments from './components/MilestoneMoments'
import Tokenomics from './components/Tokenomics'
import Roadmap from './components/Roadmap'
import Community from './components/Community'
import Footer from './components/Footer'
import SpeedLines from './components/SpeedLines'

function App() {
  return (
    <div className="app">
      <SpeedLines intensity="low" />
      <Hero />
      <LiveMetrics />
      <SpeedrunSplits />
      <Chart />
      <MilestoneMoments />
      <Tokenomics />
      <Roadmap />
      <Community />
      <Footer />
    </div>
  )
}

export default App
