import {Route,Routes} from 'react-router-dom'
import Home from './Components/Home'
import Chats from './Components/Chats'
import "./App.css"


function App() {
  return (
    <div className="App">
   <Routes>
   <Route  path='/' Component={  Home} exact></Route>
    <Route path='/chat' Component={ Chats}  exact ></Route>
   </Routes>
    </div>
  );
}

export default App;
