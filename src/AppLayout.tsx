import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './pages/Header';

export const AppLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};