import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { useAuth } from '../services/AuthProvider';

interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
}

const ShopkeeperApp: React.FC = () => {
  const [shopName, setShopName] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('lara-light-indigo');
  const [showAddItemDialog, setShowAddItemDialog] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({});
  const { user } = useAuth();

  useEffect(() => {
    // Load saved data from local storage or backend
    const savedShopName = localStorage.getItem('shopName');
    if (savedShopName) {
      setShopName(savedShopName);
    }

    const savedItems = localStorage.getItem('items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      // Apply theme change
      const currentTheme = document.getElementById('theme-link');
      if (currentTheme) {
        currentTheme.setAttribute('href', `primereact/resources/themes/${savedTheme}/theme.css`);
      }
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('shopName', shopName);
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('theme', selectedTheme);
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name,
        price: Number(newItem.price),
        category: newItem.category
      };
      setItems([...items, item]);
      setNewItem({});
      setShowAddItemDialog(false);
      saveData();
    }
  };

  const handleDeleteItem = (item: Item) => {
    setItems(items.filter(i => i.id !== item.id));
    saveData();
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    const link = document.getElementById('theme-link');
    if (link) {
      link.setAttribute('href', `primereact/resources/themes/${theme}/theme.css`);
    }
    saveData();
  };

  if (!user) {
    return (
      <div className="p-4">
        <Card title="Authentication Required">
          <p>Please log in to access the Shopkeeper Application.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card title="Shop Configuration">
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="shopName">Shop Name</label>
            <InputText
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter your shop name"
            />
          </div>

          <div className="field">
            <label>Theme</label>
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="theme1"
                  name="theme"
                  value="lara-light-indigo"
                  onChange={(e) => handleThemeChange(e.value)}
                  checked={selectedTheme === 'lara-light-indigo'}
                />
                <label htmlFor="theme1" className="ml-2">Light</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="theme2"
                  name="theme"
                  value="lara-dark-indigo"
                  onChange={(e) => handleThemeChange(e.value)}
                  checked={selectedTheme === 'lara-dark-indigo'}
                />
                <label htmlFor="theme2" className="ml-2">Dark</label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Inventory" className="mt-4">
        <Button
          label="Add Item"
          icon="pi pi-plus"
          onClick={() => setShowAddItemDialog(true)}
          className="mb-3"
        />

        <DataTable value={items} responsiveLayout="scroll">
          <Column field="name" header="Item Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column
            field="price"
            header="Price"
            body={(rowData) => `${rowData.price} gp`}
          ></Column>
          <Column
            body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => handleDeleteItem(rowData)}
              />
            )}
          ></Column>
        </DataTable>
      </Card>

      <Dialog
        visible={showAddItemDialog}
        header="Add New Item"
        modal
        onHide={() => setShowAddItemDialog(false)}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="itemName">Item Name</label>
            <InputText
              id="itemName"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="itemCategory">Category</label>
            <InputText
              id="itemCategory"
              value={newItem.category || ''}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="itemPrice">Price (gp)</label>
            <InputText
              id="itemPrice"
              type="number"
              value={newItem.price?.toString() || ''}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
            />
          </div>
          <Button label="Add" onClick={handleAddItem} />
        </div>
      </Dialog>
    </div>
  );
};

export default ShopkeeperApp;
