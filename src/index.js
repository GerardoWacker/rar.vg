import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import {Home} from './pages/home'
import {AppError} from './pages/error'
import {RouterProvider} from './router/router'
import {Route} from './router/route'
import Profile from "./pages/profile"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import Register from "./pages/register"
import ChangePassword from './pages/changepassword'
import Verify from './pages/verify'
import VerifyPasswordChange from "./pages/verifypasswordchange"
import DeleteAccount from "./pages/deleteaccount"
import VerifyAccountDeletion from "./pages/verifyaccountdeletion"

// Get the subdomain.
const host = window.location.host.split('.')

// GET parameters.
const getParameters = new URLSearchParams(window.location.search)

export const WebRoutes = [
    {
        path: "/",
        component: <Home/>
    },
    {
        path: "/login",
        component: <Login justRegistered={getParameters.get("jr")}/>
    },
    {
        path: "/verify",
        component: <Verify token={getParameters.get("vt")}/>
    },
    {
        path: "/change-password",
        component: <VerifyPasswordChange token={getParameters.get("t")}/>
    },
    {
        path: "/forgot-password",
        component: <ChangePassword/>
    },
    {
        path: "/register",
        component: <Register/>
    },
    {
        path: "/dashboard",
        component: <Dashboard/>
    },
    {
        path: "/delete-account",
        component: <DeleteAccount/>,
    },
    {
        path: "/verify-account-deletion",
        component: <VerifyAccountDeletion token={getParameters.get("t")}/>,
    },
    {
        path: "",
        component: <AppError></AppError>,
        status: 404
    },
]

const AppRoutes = () => <RouterProvider>
    {WebRoutes.map((route, k) => <Route key={k} status={route.status ? route.status : 200}
                                        path={route.path}>{route.component}</Route>)}
</RouterProvider>

if (host[1] === 'b' || host[0] === 'b')
{
    // Testing environment.
    if (((host.length === 3 && host[2].includes('localhost')) || (host.length === 4)) && host[0] !== 'www')
    {
        const subdomain = host[0]
        ReactDOM.render(<Profile username={subdomain}/>, document.getElementById('root'))
    }
    else
    {
        ReactDOM.render(
            <AppRoutes></AppRoutes>,
            document.getElementById("root")
        );
    }
}
else
{

    if (((host.length === 2 && host[1].includes('localhost')) || (host.length === 3)) && host[0] !== 'www')
    {
        const subdomain = host[0]
        ReactDOM.render(<Profile username={subdomain}/>, document.getElementById('root'))
    }
    else
    {
        ReactDOM.render(
            <AppRoutes></AppRoutes>,
            document.getElementById("root")
        );
    }
}

export default AppRoutes;
