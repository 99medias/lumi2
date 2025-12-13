export interface PhoneInfo {
  number: string;
  localNumber: string;
  countryCode: string;
  countryName: string;
  flag: string;
}

const phoneNumbers: Record<string, PhoneInfo> = {
  BE: {
    number: '+32 16 18 60 98',
    localNumber: '016 18 60 98',
    countryCode: 'BE',
    countryName: 'Belgium',
    flag: '🇧🇪'
  },
  CH: {
    number: '+41 22 518 14 56',
    localNumber: '022 518 14 56',
    countryCode: 'CH',
    countryName: 'Switzerland',
    flag: '🇨🇭'
  },
  ES: {
    number: '+34 91 718 95 86',
    localNumber: '91 718 95 86',
    countryCode: 'ES',
    countryName: 'Spain',
    flag: '🇪🇸'
  },
  FR: {
    number: '+32 16 18 60 98',
    localNumber: '016 18 60 98',
    countryCode: 'FR',
    countryName: 'France',
    flag: '🇫🇷'
  }
};

export const getPhoneInfoByCountry = (countryCode: string | null): PhoneInfo => {
  if (!countryCode || !phoneNumbers[countryCode]) {
    return {
      number: '+32 16 18 60 98',
      localNumber: '016 18 60 98',
      countryCode: 'BE',
      countryName: 'Belgium',
      flag: '🇧🇪'
    };
  }
  return phoneNumbers[countryCode];
};

export const formatPhoneForTel = (phoneInfo: PhoneInfo): string => {
  return phoneInfo.number.replace(/\s+/g, '');
};
