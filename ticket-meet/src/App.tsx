import './App.css'
import GenerateTicket from './GenerateTicket/GenerateTicket';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    // <BrowserRouter >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GenerateTicket />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
