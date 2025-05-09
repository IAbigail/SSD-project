import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const Menu: React.FC = () => {
  return (
    <div style={{ background: '#eee', padding: '1rem', marginBottom: '1rem' }}>
      <h3>Menu</h3>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/guests">Guest List</Link></li>
        <li><Link to="/budget">Budget</Link></li>
        <li><Link to="/vendors">Vendors</Link></li>
      </ul>
    </div>
  );
};

export default Menu;
