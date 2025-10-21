import { BrowserRouter , Routes , Route} from 'react-router';
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Header from './components/Header';
import PrivateProfile from './pages/PrivateProfile';
import FooterComponent from './components/FooterComponent';
import Callback from './pages/Callback';


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<PrivateProfile />} />
          <Route path='/sign-in' element={<Signin />} />
          <Route path='/sign-up' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/auth/callback' element={<Callback/>} />
        </Routes>
        <FooterComponent/>
      </BrowserRouter>
    </div>
  )
}

export default App
