import React from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// antd \\\
import { ConfigProvider } from 'antd'
import enGB from 'antd/locale/en_GB'
import heIL from 'antd/locale/he_IL'
// antd ///
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import PrivateRoute from 'components/PrivateRoute'

import Admin from 'containers/Admin'
import Public from 'containers/Public'

import Client from './Client'
import FreightForwarder from './FreightForwarder'
import Rate from './Rate'
import Rates from './Rates'
import { useAuth } from './hooks/auth'

import { UserRole } from 'models'

import { theme } from 'utils/antd'
import { queryClient } from 'utils/queryClient'

const App: React.FC = () => {
  const { i18n } = useTranslation()

  const { initialized } = useAuth()

  return (
    <ConfigProvider theme={theme} locale={i18n.language === 'en' ? enGB : heIL}>
      <QueryClientProvider client={queryClient}>
        {initialized && (
          <Routes>
            <Route
              path="/rate"
              element={
                <PrivateRoute
                  allowedRoles={[UserRole.Admin, UserRole.FreightForwarder]}
                />
              }
            >
              <Route path="/rate" element={<Rate />} />
              <Route path="/rate/:id" element={<Rate />} />
            </Route>

            <Route
              path="/rates"
              element={
                <PrivateRoute
                  allowedRoles={[UserRole.Admin, UserRole.FreightForwarder]}
                />
              }
            >
              <Route path="/rates" element={<Rates />} />
              <Route path="/rates/:id" element={<Rates />} />
            </Route>

            <Route
              path="/admin/*"
              element={<PrivateRoute allowedRoles={[UserRole.Admin]} />}
            >
              <Route path="*" element={<Admin />} />
            </Route>
            <Route
              path="/client/*"
              element={<PrivateRoute allowedRoles={[UserRole.Client]} />}
            >
              <Route path="*" element={<Client />} />
            </Route>
            <Route
              path="/freight-forwarder/*"
              element={
                <PrivateRoute allowedRoles={[UserRole.FreightForwarder]} />
              }
            >
              <Route path="*" element={<FreightForwarder />} />
            </Route>
            <Route path="/*" element={<Public />} />
          </Routes>
        )}
        <Helmet defaultTitle="AUTOLOG" titleTemplate="AUTOLOG · %s" />
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
