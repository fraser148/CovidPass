import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import { fetchFromAPI, isEmployee, isUserPremium } from '../helpers';
import { Container, Row, Col }  from 'react-bootstrap';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase';
import { SignIn  } from '../Customers';
import SideNav from './SideNav';
import Tick from '../images/tick.png';
import Cross from '../images/cross.png';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';



const usePremiumStatus = (user) => {
    const [premiumStatus, setPremiumStatus] = useState(undefined);
    const [company, setCompany] = useState(null)

    useEffect(() => {
        if (user) {
            const checkPremiumStatus = async function () {
                  const role = await isEmployee();
                  if (role === "company"){
                      setPremiumStatus(true);
                  } else {
                      setPremiumStatus(false)
                  }
            };
            checkPremiumStatus();
          }
      }, [user]);
    
      return premiumStatus;
}

const Group = () => {
    const [user, userLoading] = useAuthState(auth);
    const [employees, setEmployees] = useState({})
    const userIsPremium = usePremiumStatus(user);
    const [stats, setStats] = useState([]);
    const [allChecker, setAllChecker] = useState(false);
    const [group, setGroup] = useState({})

    const { groupId } = useParams();
    

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (user && !userLoading) {
            const getGroups = async () => {

                var employ = await fetchFromAPI('company/group/'+ groupId, { method: "GET"});
                console.log(employ);       
                await employ.employees.untested.map(o => o.checked = false);
                setStats(employ.data)
                setEmployees({...employees,
                    tested: employ.employees.tested,
                    untested: employ.employees.untested
                });
                setGroup(employ.group)
                setLoading(false)
            }
            getGroups()
        }
        if (userIsPremium === false || (!user && !userLoading)) navigate("/");
      }, [user, navigate, userLoading]);
    
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    const checker = (e) => {
        if (e.target.checked) {
            // setChecked([...checked, e.target.value]);
            let new_arr = {...employees};
            new_arr.untested.find(x => x.id === e.target.value).checked = true
            setEmployees(new_arr)
        } else {
            // setChecked(checked.filter(item => item !== e.target.value))
            let new_arr = {...employees};
            new_arr.untested.find(x => x.id === e.target.value).checked = false
            setEmployees(new_arr)
            setAllChecker(false)
        }
    }

    const sendReminder = () => {
        var arr = employees.untested.filter(o => o.checked === true)
        let arr_new = {...employees};
        arr_new.untested.forEach(o => o.checked = false);
        setEmployees(arr_new);
        setAllChecker(false);
    }

    const setAllchecked = (e) => {
        let new_arr = {...employees};
        new_arr.untested.forEach(o => o.checked = e.target.checked)
        setEmployees(new_arr)
        setAllChecker(e.target.checked);
    }

    return (
        <div className="main">
            <div className="dashboard">
                <SideNav />
                <div className="content">
                    {!user && userLoading && <span>Loading...</span>}
                    {!user && !userLoading && !userIsPremium && <SignIn />}
                    {user && !userLoading && !loading && userIsPremium && (
                        <Container className="dashboard-container">
                        <Row className="dashboard-row">
                            <Col className="dashboard-col header" lg={12}>
                                <div className="content-holder">
                                    <input
                                        className="searchbar"
                                        type="text"
                                        placeholder={"Search..."}
                                    />
                                    <div className="links">
                                        <a href="/">Home</a>
                                        <a href="/">Home</a>
                                        <a href="/">Home</a>
                                    </div>
                                </div>
                            </Col>
                            <Col className="dashboard-col" lg={12}>
                                <div className="stats content-holder">
                                    <h2>Group: {group.group_name}</h2>
                                    <span className="timing">Here are your departments.</span>
                                </div>
                            </Col>
                            <Col className="dashboard-col" xl={4} lg={6} md={12}>
                                <div className="stats content-holder">
                                    <h3 className="bad">Untested</h3>
                                    <button className="action-btn" onClick={sendReminder}><h3 className="neutral">Send Reminder</h3></button>
                                    <div className='employee-holder'>
                                        <div className='employee'>
                                            <input type="checkbox" checked={allChecker} onChange={(e) => setAllchecked(e)}/>
                                            <span className="name"><strong>Name</strong></span>
                                            <img src={Cross} alt='cross'/>
                                        </div>
                                        
                                        {employees.untested.map((employee, i) => (
                                            <div key={employee.name} className='employee'>
                                                <input type="checkbox" checked={employee.checked} value={employee.id} onChange={(e) => checker(e)}/>
                                                <span className="name">{employee.fname + " " + employee.lname}</span>
                                                <img src={Cross} alt='cross'/>
                                            </div>
                                        ))}
                                    </div>
                                    
                                </div>
                            </Col>
                            <Col className="dashboard-col" xl={4} lg={6} md={12}>
                                <div className="stats content-holder">
                                    <h3 className="good">Tested</h3>
                                    <div className='employee-holder'>
                                        <div className='employee'>
                                            <span className="name"><strong>Name</strong></span>
                                            <img src={Tick} alt='tick'/>
                                        </div>
                                        {employees.tested.map((employee) => (
                                            <div key={employee.name} className='employee'>
                                                <span className="name">{employee.fname + " " + employee.lname}</span>
                                                <div className="tick">
                                                    <img src={Tick} alt="tick"/>
                                                    <div className="date">
                                                        {new Date(employee.tests[0].createdAt).toLocaleTimeString("en-GB")}
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                    
                                </div>
                            </Col>
                            <Col className="dashboard-col" xl={4} lg={6} md={12}>
                                <div className="stats content-holder">
                                <h3 className="neutral">Tested Pie Chart</h3>    
                                    <div className="stat-box chart">
                                    <ResponsiveContainer width="100%" height="100%">
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            data={stats}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label
                                        >
                                            {stats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                            
                                        </Pie>
                                        <Tooltip/>
                                        <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    </div>
                                    
                                </div>
                            </Col>

                        </Row>
                        </Container>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Group;