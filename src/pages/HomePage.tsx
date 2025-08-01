import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Card title="Welcome to Dungeon and Shopkeeper" className="m-4">
        <p className="m-0">
          Welcome to Dungeon and Shopkeeper, your ultimate tool for managing your D&D shop inventory!
          Create and manage your fantasy shop with ease, set custom prices, and keep track of your
          items from the Dungeons & Dragons universe.
        </p>
        <span className="mt-3">
          Features:
          <ul>
            <li>Create and customize your shop</li>
            <li>Manage D&D items and their prices</li>
            <li>Multiple theme options</li>
            <li>Secure authentication</li>
          </ul>
        </span>
        <Button
          label="Get Started"
          icon="pi pi-arrow-right"
          className="mt-3"
          onClick={() => navigate('/shopkeeper')}
        />
      </Card>
    </div>
  );
};

export default HomePage;
