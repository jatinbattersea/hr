import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import AllEmployee from './Pages/AllEmployee';
import AddMember from './Pages/AddMember';
import AddShift from './Pages/AddShift';
import Attendence from './Pages/Attendence';
import Holiday from './Pages/Holiday';
import SingleEmployee from './Pages/SingleEmployee';
import Profile from './Pages/Profile';
import PageNotFound from "./Pages/PageNotFound";
import AppLayout from "./Layouts/AppLayout";
import { useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const App = () => {

    const { user } = useContext(AuthContext);

    // Routes
    const paths = {
        "": (user?._doc.designation == "Admin" ? <Dashboard /> : <EmployeeDashboard />),
        "employees": <AllEmployee />,
        "employee": <SingleEmployee />,
        "add-member": <AddMember />,
        "add-shift": <AddShift />,
        "attendence": <Attendence />,
        "holidays": <Holiday />,
        "profile": <Profile />,
    };

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/accounts/login" element={<Login />} />
                    <Route path="/accounts/signup" element={<Signup />} />
                    {
                        user?.authorizedPages.map((page) => (
                            <Route path={page} key={page} element={
                                <AppLayout>
                                    {paths[page.split("/")[1]]}
                                </AppLayout>
                            } />
                        ))
                    }
                    <Route path="*" element={
                        <AppLayout>
                            <PageNotFound />
                        </AppLayout>
                    } />
                </Routes>
            </Router>
        </>
    )
}

export default App;
