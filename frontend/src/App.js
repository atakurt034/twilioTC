import { screen } from './screens/index'
import { Header } from './components/header'
import { Footer } from './components/footer'

import { BrowserRouter, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Route path='/login' component={screen.Login} />
      <Route path='/' component={screen.Home} exact />
      <Footer />
    </BrowserRouter>
  )
}

export default App
