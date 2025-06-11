import { Route, Routes } from 'react-router-dom'

import './App.css'
import RegistrationForm from './components/RegistrationForm'
import SuccessPage from './components/SuccessPage'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </div>
  )
}

export default App
