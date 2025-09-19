import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import CenteredModal from '../CenteredModal';

export type Country = { name: string; dial: string; iso2: string };

type Props = {
  visible: boolean;
  activeCountry: Country;
  onSelect: (c: Country) => void;
  onClose: () => void;
  countries?: Country[];
};

// ✅ Tüm dünya ülke kodları
const ALL_COUNTRIES: Country[] = [
  { name: 'Afghanistan', dial: '+93', iso2: 'AF' },
  { name: 'Albania', dial: '+355', iso2: 'AL' },
  { name: 'Algeria', dial: '+213', iso2: 'DZ' },
  { name: 'Andorra', dial: '+376', iso2: 'AD' },
  { name: 'Angola', dial: '+244', iso2: 'AO' },
  { name: 'Argentina', dial: '+54', iso2: 'AR' },
  { name: 'Armenia', dial: '+374', iso2: 'AM' },
  { name: 'Australia', dial: '+61', iso2: 'AU' },
  { name: 'Austria', dial: '+43', iso2: 'AT' },
  { name: 'Azerbaijan', dial: '+994', iso2: 'AZ' },
  { name: 'Bahamas', dial: '+1-242', iso2: 'BS' },
  { name: 'Bahrain', dial: '+973', iso2: 'BH' },
  { name: 'Bangladesh', dial: '+880', iso2: 'BD' },
  { name: 'Belarus', dial: '+375', iso2: 'BY' },
  { name: 'Belgium', dial: '+32', iso2: 'BE' },
  { name: 'Belize', dial: '+501', iso2: 'BZ' },
  { name: 'Benin', dial: '+229', iso2: 'BJ' },
  { name: 'Bhutan', dial: '+975', iso2: 'BT' },
  { name: 'Bolivia', dial: '+591', iso2: 'BO' },
  { name: 'Bosnia and Herzegovina', dial: '+387', iso2: 'BA' },
  { name: 'Botswana', dial: '+267', iso2: 'BW' },
  { name: 'Brazil', dial: '+55', iso2: 'BR' },
  { name: 'Brunei', dial: '+673', iso2: 'BN' },
  { name: 'Bulgaria', dial: '+359', iso2: 'BG' },
  { name: 'Burkina Faso', dial: '+226', iso2: 'BF' },
  { name: 'Burundi', dial: '+257', iso2: 'BI' },
  { name: 'Cambodia', dial: '+855', iso2: 'KH' },
  { name: 'Cameroon', dial: '+237', iso2: 'CM' },
  { name: 'Canada', dial: '+1', iso2: 'CA' },
  { name: 'Chile', dial: '+56', iso2: 'CL' },
  { name: 'China', dial: '+86', iso2: 'CN' },
  { name: 'Colombia', dial: '+57', iso2: 'CO' },
  { name: 'Costa Rica', dial: '+506', iso2: 'CR' },
  { name: 'Croatia', dial: '+385', iso2: 'HR' },
  { name: 'Cuba', dial: '+53', iso2: 'CU' },
  { name: 'Cyprus', dial: '+357', iso2: 'CY' },
  { name: 'Czech Republic', dial: '+420', iso2: 'CZ' },
  { name: 'Denmark', dial: '+45', iso2: 'DK' },
  { name: 'Dominican Republic', dial: '+1-809', iso2: 'DO' },
  { name: 'Ecuador', dial: '+593', iso2: 'EC' },
  { name: 'Egypt', dial: '+20', iso2: 'EG' },
  { name: 'El Salvador', dial: '+503', iso2: 'SV' },
  { name: 'Estonia', dial: '+372', iso2: 'EE' },
  { name: 'Ethiopia', dial: '+251', iso2: 'ET' },
  { name: 'Finland', dial: '+358', iso2: 'FI' },
  { name: 'France', dial: '+33', iso2: 'FR' },
  { name: 'Georgia', dial: '+995', iso2: 'GE' },
  { name: 'Germany', dial: '+49', iso2: 'DE' },
  { name: 'Greece', dial: '+30', iso2: 'GR' },
  { name: 'Guatemala', dial: '+502', iso2: 'GT' },
  { name: 'Honduras', dial: '+504', iso2: 'HN' },
  { name: 'Hong Kong', dial: '+852', iso2: 'HK' },
  { name: 'Hungary', dial: '+36', iso2: 'HU' },
  { name: 'Iceland', dial: '+354', iso2: 'IS' },
  { name: 'India', dial: '+91', iso2: 'IN' },
  { name: 'Indonesia', dial: '+62', iso2: 'ID' },
  { name: 'Iran', dial: '+98', iso2: 'IR' },
  { name: 'Iraq', dial: '+964', iso2: 'IQ' },
  { name: 'Ireland', dial: '+353', iso2: 'IE' },
  { name: 'Israel', dial: '+972', iso2: 'IL' },
  { name: 'Italy', dial: '+39', iso2: 'IT' },
  { name: 'Japan', dial: '+81', iso2: 'JP' },
  { name: 'Jordan', dial: '+962', iso2: 'JO' },
  { name: 'Kazakhstan', dial: '+7', iso2: 'KZ' },
  { name: 'Kenya', dial: '+254', iso2: 'KE' },
  { name: 'Kuwait', dial: '+965', iso2: 'KW' },
  { name: 'Kyrgyzstan', dial: '+996', iso2: 'KG' },
  { name: 'Latvia', dial: '+371', iso2: 'LV' },
  { name: 'Lebanon', dial: '+961', iso2: 'LB' },
  { name: 'Libya', dial: '+218', iso2: 'LY' },
  { name: 'Lithuania', dial: '+370', iso2: 'LT' },
  { name: 'Luxembourg', dial: '+352', iso2: 'LU' },
  { name: 'Malaysia', dial: '+60', iso2: 'MY' },
  { name: 'Maldives', dial: '+960', iso2: 'MV' },
  { name: 'Malta', dial: '+356', iso2: 'MT' },
  { name: 'Mexico', dial: '+52', iso2: 'MX' },
  { name: 'Moldova', dial: '+373', iso2: 'MD' },
  { name: 'Monaco', dial: '+377', iso2: 'MC' },
  { name: 'Mongolia', dial: '+976', iso2: 'MN' },
  { name: 'Montenegro', dial: '+382', iso2: 'ME' },
  { name: 'Morocco', dial: '+212', iso2: 'MA' },
  { name: 'Nepal', dial: '+977', iso2: 'NP' },
  { name: 'Netherlands', dial: '+31', iso2: 'NL' },
  { name: 'New Zealand', dial: '+64', iso2: 'NZ' },
  { name: 'Nigeria', dial: '+234', iso2: 'NG' },
  { name: 'North Korea', dial: '+850', iso2: 'KP' },
  { name: 'Norway', dial: '+47', iso2: 'NO' },
  { name: 'Oman', dial: '+968', iso2: 'OM' },
  { name: 'Pakistan', dial: '+92', iso2: 'PK' },
  { name: 'Palestine', dial: '+970', iso2: 'PS' },
  { name: 'Panama', dial: '+507', iso2: 'PA' },
  { name: 'Paraguay', dial: '+595', iso2: 'PY' },
  { name: 'Peru', dial: '+51', iso2: 'PE' },
  { name: 'Philippines', dial: '+63', iso2: 'PH' },
  { name: 'Poland', dial: '+48', iso2: 'PL' },
  { name: 'Portugal', dial: '+351', iso2: 'PT' },
  { name: 'Qatar', dial: '+974', iso2: 'QA' },
  { name: 'Romania', dial: '+40', iso2: 'RO' },
  { name: 'Russia', dial: '+7', iso2: 'RU' },
  { name: 'Saudi Arabia', dial: '+966', iso2: 'SA' },
  { name: 'Serbia', dial: '+381', iso2: 'RS' },
  { name: 'Singapore', dial: '+65', iso2: 'SG' },
  { name: 'Slovakia', dial: '+421', iso2: 'SK' },
  { name: 'Slovenia', dial: '+386', iso2: 'SI' },
  { name: 'South Africa', dial: '+27', iso2: 'ZA' },
  { name: 'South Korea', dial: '+82', iso2: 'KR' },
  { name: 'Spain', dial: '+34', iso2: 'ES' },
  { name: 'Sri Lanka', dial: '+94', iso2: 'LK' },
  { name: 'Sweden', dial: '+46', iso2: 'SE' },
  { name: 'Switzerland', dial: '+41', iso2: 'CH' },
  { name: 'Syria', dial: '+963', iso2: 'SY' },
  { name: 'Taiwan', dial: '+886', iso2: 'TW' },
  { name: 'Tajikistan', dial: '+992', iso2: 'TJ' },
  { name: 'Tanzania', dial: '+255', iso2: 'TZ' },
  { name: 'Thailand', dial: '+66', iso2: 'TH' },
  { name: 'Tunisia', dial: '+216', iso2: 'TN' },
  { name: 'Turkey', dial: '+90', iso2: 'TR' },
  { name: 'Turkmenistan', dial: '+993', iso2: 'TM' },
  { name: 'Ukraine', dial: '+380', iso2: 'UA' },
  { name: 'United Arab Emirates', dial: '+971', iso2: 'AE' },
  { name: 'United Kingdom', dial: '+44', iso2: 'GB' },
  { name: 'United States', dial: '+1', iso2: 'US' },
  { name: 'Uruguay', dial: '+598', iso2: 'UY' },
  { name: 'Uzbekistan', dial: '+998', iso2: 'UZ' },
  { name: 'Venezuela', dial: '+58', iso2: 'VE' },
  { name: 'Vietnam', dial: '+84', iso2: 'VN' },
  { name: 'Yemen', dial: '+967', iso2: 'YE' },
  { name: 'Zambia', dial: '+260', iso2: 'ZM' },
  { name: 'Zimbabwe', dial: '+263', iso2: 'ZW' },
];

const CountryCodeModal: React.FC<Props> = ({
  visible,
  activeCountry,
  onSelect,
  onClose,
  countries = ALL_COUNTRIES,
}) => {
  return (
    <CenteredModal visible={visible} onClose={onClose}>
      <View style={s.ccModalWrap}>
        <Text style={s.ccModalTitle}>Ülke Kodu Seç</Text>
        <ScrollView style={s.ccList} showsVerticalScrollIndicator>
          {countries.map((c) => {
            const active = activeCountry.iso2 === c.iso2;
            return (
              <Pressable
                key={c.iso2}
                onPress={() => onSelect(c)}
                style={[s.ccItem, active && s.ccItemActive]}
              >
                <Text style={[s.ccItemText, active && s.ccItemTextActive]}>
                  {c.name} ({c.dial})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </CenteredModal>
  );
};

const s = StyleSheet.create({
  ccModalWrap: { flex: 1, paddingTop: 16, paddingHorizontal: 12, paddingBottom: 12 },
  ccModalTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 12, color: '#000' },
  ccList: { flex: 1, borderWidth: 1, borderColor: '#000', borderRadius: 12, backgroundColor: '#fff' },
  ccItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  ccItemActive: { backgroundColor: 'rgba(241,57,87,0.12)' },
  ccItemText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#000' },
  ccItemTextActive: { fontFamily: 'Inter_700Bold' },
});

export default CountryCodeModal;
