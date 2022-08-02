import NavBar from '../components/NavBar'
import '../styles/globals.css'
import 'antd/dist/antd.css';
function MyApp({ Component, pageProps }) {
  return <div className="body">
    <NavBar />
    <Component {...pageProps} />
  </div>
}

export default MyApp
