import logo from './logo.svg';
import Welcome from './components/Welcome.js'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div>
          <Router>
            <Switch>
              <Route path="/" component={Welcome} />          
            </Switch>
          </Router>
      </div>
  );
}

export default App;
