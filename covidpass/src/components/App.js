import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import { Checkout, CheckoutSuccess, CheckoutFail } from './Checkout';
import Payments from './Payments'
import Customers from './Customers'
import Subscriptions from './Subscriptions';
import QRscanner from './QRscanner';
import Dashboard from './Dashboard';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/checkout" element={<Checkout />}/>
        <Route path="/success" element={<CheckoutSuccess />}/>
        <Route path="/failed" element={<CheckoutFail />}/>
        <Route path="/payments" element={<Payments />}/>
        <Route path="/customers" element={<Customers />}/>
        <Route path="/subscriptions" element={<Subscriptions />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/qr" element={<QRscanner />}/>
        {/* <Route path="/qr" element={<QRscanner />}/> */}
      </Routes>
    </div>
  );
}

export default App;
