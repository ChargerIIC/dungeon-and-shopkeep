import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthProvider';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Shopkeeper',
      icon: 'pi pi-shopping-bag',
      command: () => navigate('/shopkeeper')
    }
  ];

  const end = (
    <>
      {user ? (
        <Button
          label="Sign Out"
          icon="pi pi-sign-out"
          className="p-button-text"
          onClick={signOut}
        />
      ) : (
        <Button
          label="Sign In"
          icon="pi pi-sign-in"
          className="p-button-text"
          onClick={signIn}
        />
      )}
    </>
  );

  return <Menubar model={items} end={end} />;
};

export default Navbar;
