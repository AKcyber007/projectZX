import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { UserProvider } from './contexts/UserContext';
import { ContractProvider } from './contexts/ContractContext';
import { ContractAccountingProvider } from './contexts/ContractAccountingContext';
import Layout from './components/Layout';
import ContractAccountingLayout from './components/ContractAccountingLayout';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ContractMarketplacePage from './pages/ContractMarketplacePage';
import PostContractPage from './pages/PostContractPage';
import MyContractsPage from './pages/MyContractsPage';
import PointsRewardsPage from './pages/PointsRewardsPage';
import PremiumSubscriptionPage from './pages/PremiumSubscriptionPage';
import ContractReservationDemoPage from './pages/ContractReservationDemoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Contract Accounting Pages
import ContractAccountingDashboard from './pages/contract-accounting/ContractAccountingDashboard';
import ContractSalesInvoices from './pages/contract-accounting/ContractSalesInvoices';
import ContractPurchaseInvoices from './pages/contract-accounting/ContractPurchaseInvoices';
import ContractDrafts from './pages/contract-accounting/ContractDrafts';

function App() {
  return (
    <Router>
      <UserProvider>
        <ContractProvider>
          <ContractAccountingProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Contract Accounting Module Routes */}
                  <Route path="/contract-accounting/*" element={
                    <ContractAccountingLayout>
                      <Routes>
                        <Route path="/dashboard" element={<ContractAccountingDashboard />} />
                        <Route path="/sales-invoices" element={<ContractSalesInvoices />} />
                        <Route path="/purchase-invoices" element={<ContractPurchaseInvoices />} />
                        <Route path="/drafts" element={<ContractDrafts />} />
                      </Routes>
                    </ContractAccountingLayout>
                  } />
                  
                  {/* Contract Module Routes */}
                  <Route path="/*" element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/marketplace" element={<ContractMarketplacePage />} />
                        <Route path="/post-contract" element={<PostContractPage />} />
                        <Route path="/my-contracts" element={<MyContractsPage />} />
                        <Route path="/points-rewards" element={<PointsRewardsPage />} />
                        <Route path="/subscription" element={<PremiumSubscriptionPage />} />
                        <Route path="/reserve-demo" element={<ContractReservationDemoPage />} />
                      </Routes>
                    </Layout>
                  } />
                </Routes>
                <Toast />
              </div>
            </SidebarProvider>
          </ContractAccountingProvider>
        </ContractProvider>
      </UserProvider>
    </Router>
  );
}

export default App;