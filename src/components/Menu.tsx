import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Menu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ background: '#eee', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{t('menu')}</h3>
      <ul>
        <li><Link to="/">{t('home')}</Link></li>
        <li><Link to="/tasks">{t('tasks')}</Link></li>
        <li><Link to="/guests">{t('guest_list')}</Link></li>
        <li><Link to="/budget">{t('budget')}</Link></li>
        <li><Link to="/vendors">{t('vendors')}</Link></li>
      </ul>
    </div>
  );
};

export default Menu;
