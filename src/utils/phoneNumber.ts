export interface PhoneInfo {
  number: string;
  localNumber: string;
  countryCode: string;
  countryName: string;
  flag: string;
}

const phoneNumbers: Record<string, PhoneInfo> = {
  BE: {
    number: '+32 2 808 94 47',
    localNumber: '02 808 94 47',
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
    number: '+33 1 89 71 28 66',
    localNumber: '01 89 71 28 66',
    countryCode: 'FR',
    countryName: 'France',
    flag: '🇫🇷'
  }
};

export const getPhoneInfoByCountry = (countryCode: string | null): PhoneInfo => {
  if (!countryCode || !phoneNumbers[countryCode]) {
    return {
      number: '+33 1 89 71 28 66',
      localNumber: '01 89 71 28 66',
      countryCode: 'FR',
      countryName: 'France',
      flag: '🇫🇷'
    };
  }
  return phoneNumbers[countryCode];
};

export const formatPhoneForTel = (phoneInfo: PhoneInfo): string => {
  return phoneInfo.number.replace(/\s+/g, '');
};
