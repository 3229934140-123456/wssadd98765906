import { Component } from 'react'
import './app.scss'
import { TripProvider } from '@/store/TripContext'

class App extends Component {
  render() {
    return (
      <TripProvider>
        {this.props.children}
      </TripProvider>
    )
  }
}

export default App
