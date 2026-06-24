import Navbar from "./components/Navbar"
import Movies from "./pages/Movies"
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import Favorites from './pages/Favorites'

import {Route, Routes, useLocation} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import Footer from "./components/Footer"
import Layout from "./pages/admin/Layout"
import AddShows from "./pages/admin/AddShows"
import ListBooking from "./pages/admin/ListBooking"
import Dashboard from "./pages/admin/Dashboard"
import ListShows from "./pages/admin/ListShows"


function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin') 
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar/>}
     

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movies" element={<Movies/>} />
        <Route path="/movies/:id" element={<MovieDetails/>} />
        <Route path="/movie/:id/:seat" element={<SeatLayout/>} />
        <Route path="/favorite" element={<Favorites/>} />
        <Route path='/admin/*' element ={<Layout/>}>
          <Route path="add-shows" element ={<AddShows />} />
          <Route path="list-shows" element ={<ListShows />} />
          <Route path="" element ={<Dashboard />} />
          <Route path="list-bookings" element ={<ListBooking />} />
        </Route>

      </Routes>

      {!isAdminRoute && <Footer/>}
    
    </>
  )
}

export default App