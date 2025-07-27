import KanbanBoard from './components/KanbanBoard'
import WeeklyKanbanBoard from './components/WeeklyKanbanBoard'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="boards-container">
        <KanbanBoard />
        <WeeklyKanbanBoard />
      </div>
    </div>
  )
}

export default App
