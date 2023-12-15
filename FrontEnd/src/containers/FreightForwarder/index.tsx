import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import Header from 'components/Header'

import Rates from 'containers/Rates'

import Dashboard from './Dashboard'
import Profile from './Profile'

const FreightForwarder: React.FC = () => {
  return (
    <>
      <Header />
      <div className="wrapper">
        <Routes>
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/dashboard/:id/:tab" element={<Dashboard />} />

          <Route path="/rates" element={<Rates />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default FreightForwarder
