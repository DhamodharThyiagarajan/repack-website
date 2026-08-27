import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import RepackDetails from './pages/RepackDetails';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/repack/:id" element={<RepackDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}
