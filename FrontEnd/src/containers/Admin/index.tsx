import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import Header from 'components/Header'

import Clients from '../../components/Clients'
import Admins from './Admins'
import AllShipments from './AllShipments'
import FreightForwardersManagement from './FreightForwarders'

const Admin: React.FC = () => {
  return (
    <>
      <Header />
      <div className="wrapper">
        <Routes>
          <Route path="/admins/" element={<Admins />} />
          <Route path="/admins/:id" element={<Admins />} />

          <Route path="/clients/" element={<Clients />} />
          <Route path="/clients/:id/:tab" element={<Clients />} />

          <Route
            path="/freight-forwarders/"
            element={<FreightForwardersManagement />}
          />
          <Route
            path="/freight-forwarders/:id/:tab"
            element={<FreightForwardersManagement />}
          />

          <Route path="/all-shipments/:tab" element={<AllShipments />} />

          <Route
            path="/*"
            element={<Navigate to="/admin/clients/" replace />}
          />
        </Routes>
      </div>
    </>
  )
}

export default Admin
