import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanySettings } from '../types';
import { api } from '../services/api';

const defaultSettings: CompanySettings = {
  company_name: 'AR Tours & Travel',
  tagline: 'Your Journey. Our Responsibility.',
  phone: '+91 81214 34741',
  alt_phone: '+91 81214 34741',
  whatsapp: '+918121434741',
  email: 'contact@artours.com',
  support_email: 'support@artours.com',
  address: 'AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099',
  business_hours: 'Monday – Sunday: 8:00 AM – 10:00 PM (24/7 Roadside Assistance)',
  booking_slot_fee: 99,
  currency: 'INR',
  currency_symbol: '₹',
  standard_security_deposit: 3000,
  tax_rate_percent: 5,
  free_cancellation_hours: 24,
};

interface SettingsContextType {
  settings: CompanySettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
  updateSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data && data.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (err) {
      console.warn('Using default business settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    const res = await api.admin.updateSettings(newSettings);
    if (res && res.settings) {
      setSettings(prev => ({ ...prev, ...res.settings }));
    } else {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

