import React from 'react'

const Employee = React.lazy(() => import('./views/pages/People/Employee'))
const Owner = React.lazy(() => import('./views/pages/People/Owner'))
const Customer = React.lazy(() => import('./views/pages/People/Customer'))
const Profile = React.lazy(() => import('./views/pages/People/Profile'))
const ChangePassword = React.lazy(() => import('./views/pages/People/ChangePassword'))

const Form = React.lazy(() => import('./views/pages/Service/Form'))
const Service = React.lazy(() => import('./views/pages/Service/Service'))
const History = React.lazy(() => import('./views/pages/Service/History'))

const Job = React.lazy(() => import('./views/pages/Job/Job'))
const Ticket = React.lazy(() => import('./views/pages/Job/Ticket'))
const Assign = React.lazy(() => import('./views/pages/Job/Assign'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/People/Employee', name: 'Employee', element: Employee },
  { path: '/People/Owner', name: 'Owner', element: Owner },
  { path: '/People/Customer', name: 'Customer', element: Customer },
  { path: '/People/Profile', name: 'Profile', element: Profile },
  { path: '/People/ChangePassword', name: 'ChangePassword', element: ChangePassword },
  { path: '/Service/Service', name: 'Service', element: Service },
  { path: '/Service/Form', name: 'Form', element: Form },
  { path: '/Service/History', name: 'History', element: History },
  { path: '/Job/Job', name: 'Job', element: Job },
  { path: '/Job/Assign', name: 'Assign', element: Assign },
  { path: '/Job/Ticket', name: 'Ticket', element: Ticket },
]

export default routes
