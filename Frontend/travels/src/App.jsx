import React, { useState } from 'react'
import Register from './componets/register/register'
import Login from './componets/Login/Login'
import { Route, Routes, Navigate } from 'react-router-dom'
import Buslist from './componets/Buslist/Buslist'
import Seats from './componets/busseats/Seats'
import Booking from './componets/Bookinghistory/Booking'
import Wrapper from './componets/wrapper/Wrapper'
import AddBus from './componets/Addbus/addbus'
import Landing from './componets/landingpage/Landingpage'

const App = () => {
  const [token, settoken] = useState(localStorage.getItem("token") || "");
  const [userid, setuserid] = useState(localStorage.getItem("userid") || "");

  const handellogin = (token, userid) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userid", userid);
    settoken(token);
    setuserid(userid);
  }

  const handellogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    settoken("");
    setuserid("");
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login onlogin={handellogin} />} />
        <Route path='*' element={
          <Wrapper handellogout={handellogout} token={token}>
            <Routes>
              
              <Route path='/buses' element={<Buslist />} />
              <Route path='/bus/:busid' element={<Seats token={token} />} />
              <Route path='/my-booking' element={<Booking token={token} userid={userid} />} />
              <Route path='/addbus' element={<AddBus />} />
              {/* Optional: Redirect to landing if route not found */}
              <Route path='*' element={<Navigate to="/" replace />} />
            </Routes>
          </Wrapper>
        } />
      </Routes>
    </>
  )
}

export default App