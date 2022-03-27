import logo from './logo.svg';
import './App.css';
import './mediaqueries.css';
import Nav from './Nav.js';
import Hero from './Hero.js';
import Pricing from './Pricing.js';
import Clients from './Clients.js';
import Contact from './Contact.js';


function App() {
  return (
    <div className="App">
      <Nav />
      <main>

      <Hero />
      <Pricing />
      <Clients />
      <Contact />
      </main>
    </div>
  );
}

export default App;
