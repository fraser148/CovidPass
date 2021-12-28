import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import { Checkout, CheckoutSuccess, CheckoutFail } from './Checkout';
import Payments from './Payments'
import Customers from './Customers'
import Subscriptions from './Subscriptions';
import QRscanner from './QRscanner';
import Dashboard from './dashboard/Dashboard';
import Employees from './dashboard/Employees';
import Groups from './dashboard/Groups';
import Group from './dashboard/Group';
import Login from './Login';
import Register from './Register';
import EmployeeRegister from './EmployeeRegister';
import Reset from './Reset';
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
        <Route exact path="/dashboard" element={<Dashboard />}/>
        <Route path="/dashboard/employees" element={<Employees />}/>
        <Route path="/dashboard/groups" element={<Groups />}/>
        <Route path="/dashboard/group/:groupId" element={<Group />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/employee-register" element={<EmployeeRegister />}/>
        <Route path="/reset" element={<Reset />}/>
        <Route path="/qr" element={<QRscanner />}/>
        {/* <Route path="/qr" element={<QRscanner />}/> */}
      </Routes>
    </div>
  );
}

export default App;
