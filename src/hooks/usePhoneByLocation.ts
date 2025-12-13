import { useEffect, useState } from 'react';
import { getPhoneInfoByCountry, type PhoneInfo } from '../utils/phoneNumber';

interface IPData {
  country_code: string;
}

export const usePhoneByLocation = () => {
  const [phoneInfo, setPhoneInfo] = useState<PhoneInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data: IPData = await response.json();
        const info = getPhoneInfoByCountry(data.country_code);
        setPhoneInfo(info);
      } catch (error) {
        console.error('Error fetching location:', error);
        const defaultInfo = getPhoneInfoByCountry(null);
        setPhoneInfo(defaultInfo);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { phoneInfo, loading };
};
