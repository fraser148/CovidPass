import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchFromAPI, isEmployee, isUserPremium } from '../helpers';
import { Container, Row, Col }  from 'react-bootstrap';
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import { SignIn, SignOut } from '../Customers';
import Header from '../Header';
import SideNav from './SideNav';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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

function UserData(props) {

  const [data, setData] = useState({});

  // Subscribe to the user's data in Firestore
    useEffect(
        () => {
            //   const unsubscribe = db.collection('users').doc(props.user.uid).onSnapshot(doc => setData(doc.data()) )
            const unsubscribe = onSnapshot(doc(db, 'users', props.user.uid), doc => setData(doc.data()))
            return () => unsubscribe()
        },
        [props.user]
    )

    return (
        <pre>
            Stripe Customer ID: {data.stripeCustomerId} <br />
            Subscriptions: {JSON.stringify(data.activePlans || [])}<br/>
            UserRole: {data.userRole}
        </pre>
    );
}


export default function Dashboard() {
    const [user, userLoading] = useAuthState(auth);
    const [employees, setEmployees] = useState([])
    const userIsPremium = usePremiumStatus(user);
    const [stats, setStats] = useState({})

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
          // maybe trigger a loading screen
          return;
        }
        if (!loading && user && !userLoading) {
            const getEmployees = async () => {
                const q = query(collection(db, "users"), where("company", "==", "Failte Foods"));
                const querySnapshot = await getDocs(q);
                const snapshot = querySnapshot.docs.map(x => x.data())
                console.log(snapshot);
                setEmployees(snapshot)
            }

            const Last10Days = () => {
                var dates = [];
                for (var i=0; i<10; i++) {
                    var d = new Date();
                    d.setDate(d.getDate() - i);
                    dates.push(d.setHours(0,0,0,0))
                }
                return dates;
            }
            const getStats = async () => {
                var stat = await fetchFromAPI('company/stats', { method: "GET"});
                stat.tests.forEach(test => {
                    test.createdAt = new Date(test.createdAt).setHours(0,0,0,0);
                });
                // Get array of last 10 dates
                const dates = Last10Days();
                // Check missing dates (i.e. there were no tests on a date) and then insert the date.
                dates.forEach(date => {
                    const found = stat.tests.some(el => el.createdAt === date);
                    if (!found) stat.tests.push({ createdAt: date, testCount: 0})
                })
                // Sort the array by date due to new dates of zero test count
                stat.tests.sort((a,b) => {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                // Convert dates to dd/mm/yyy
                stat.tests.forEach(test => {
                    test.createdAt = new Date(test.createdAt).toLocaleDateString("en-GB");
                });
                setStats({...stats,
                    negative: stat.negative,
                    positive: stat.positive,
                    total: stat.total,
                    tests: stat.tests,
                    percentage: stat.percentage,
                });
            }
            getEmployees()
            getStats()
            console.log(stats)
        }
        if (userIsPremium === false || (!user && !userLoading)) navigate("/");
      }, [user, loading, navigate]);

  return (
    <div className="main">
        <div className="dashboard">
            <SideNav />
            <div className="content">
                {!user && userLoading && <span>Loading...</span>}
                {!user && !userLoading && !userIsPremium && <SignIn />}
                {user && !userLoading && userIsPremium && (
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
                        <Col className="main-col">
                            <Container className='main-dashboard-container'>
                                <Row>
                                <Col className="dashboard-col" lg={12}>
                                    <div className="stats content-holder">
                                        <h2>Dashboard</h2>
                                        <span className="timing">Your last 10 days:</span>
                                    </div>
                                </Col>
                                <Col className="dashboard-col" lg={2}>
                                    <div className="stats content-holder">
                                        <div className="stats-container">
                                            <div className="stat-box neutral">
                                                <span className="value">{stats.percentage}%</span>
                                                <span className="metric">tested (48 hrs)</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="dashboard-col" lg={2}>
                                    <div className="stats content-holder">
                                        <div className="stats-container">
                                            <div className="stat-box negative">
                                                <span className="value">{stats.negative}</span>
                                                <span className="metric">Negative Tests</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="dashboard-col" lg={2}>
                                    <div className="stats content-holder">
                                        <div className="stats-container">
                                            <div className="stat-box positive">
                                                <span className="value">{stats.positive}</span>
                                                <span className="metric">Positive Tests</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col className="dashboard-col" lg={2}>
                                </Col>
                                <Col className="dashboard-col" lg={6}>
                                    <div className="stats content-holder">
                                        {stats.tests && (
                                            <div className="stat-box chart">
                                                
                                                <div className="header-stat">
                                                    <h3>Tests Reported</h3>
                                                    <span className="total">{stats.total}</span>
                                                </div>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart
                                                    width={500}
                                                    height={300}
                                                    data={stats.tests}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="createdAt"
                                                        domain={["dataMin", "dataMax + 1"]}
                                                        tick={{fontSize: 12}} />
                                                        <YAxis
                                                            width={6}
                                                            tick={{fontSize: 12}}
                                                        />
                                                        <Tooltip />
                                                        {/* <Legend /> */}
                                                        <Line type="monotone" dataKey="testCount" stroke="#8884d8" activeDot={{ r: 8 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                        
                                        
                                    </div>
                                </Col>
                                </Row>
                            </Container>
                        </Col>
                        
                    </Row>
                )}
            </div>
        </div>
    </div>
  );
}