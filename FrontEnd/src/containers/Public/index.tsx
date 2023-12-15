import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import AdminSignUp from './AdminSignUp'
import ChangePassword from './ChangePassword'
import ClientSignUp from './ClientSignUp'
import ForgotPassword from './ForgotPassword'
import ForwarderSignUp from './ForwarderSignUp'
import SignIn from './SignIn'
import Verification from './Verification'

const Public = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<ClientSignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/freight-forwarder-sign-up" element={<ForwarderSignUp />} />
      <Route path="/admin-sign-up" element={<AdminSignUp />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  )
}

export default Public
