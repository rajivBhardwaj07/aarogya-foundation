/** Static org content used across the site (and JSON-LD). Single source. */

export const ORG = {
  name: 'Aarogya Foundation',
  tagline: 'Healthcare that reaches the last village.',
  founded: 2014,
  email: 'hello@aarogyafoundation.org',
  phone: '+91 612 222 0000',
  address: 'Aarogya Bhavan, Boring Road, Patna, Bihar 800001, India',
  regNo: 'BR/2014/0098765',
  reg80G: 'AAATA1234B/F-2021',
  reg12A: 'AAATA1234B/12A/2021',
  csr1: 'CSR00012345',
  url: 'https://aarogyafoundation.org',
  regions: ['Bihar', 'Jharkhand', 'eastern Uttar Pradesh'],
  social: {
    twitter: 'https://twitter.com/aarogyafdn',
    instagram: 'https://instagram.com/aarogyafdn',
    linkedin: 'https://linkedin.com/company/aarogyafdn',
  },
};

export const PROGRAMS = [
  {
    key: 'mobile-clinics',
    name: 'Mobile Health Clinics',
    short: 'Doctors and medicines that drive to villages with no clinic nearby.',
    body:
      'Our equipped vans carry a doctor, nurse, pharmacist and community mobiliser to villages on a fixed weekly circuit. Patients get free consultation, basic diagnostics, essential medicines, and — crucially — a follow-up visit the next week.',
    stat: '640+ villages on the circuit',
    icon: 'truck',
  },
  {
    key: 'maternal-child',
    name: 'Maternal & Child Health',
    short: 'Antenatal care, safe deliveries and immunisation for mothers and infants.',
    body:
      'We track every pregnancy in our catchment from the first trimester: antenatal check-ups, anaemia management, institutional delivery support, and routine immunisation for newborns. Community mobilisers make sure no mother slips off the register.',
    stat: '9,500+ safe deliveries supported',
    icon: 'heart',
  },
  {
    key: 'nutrition',
    name: 'Nutrition',
    short: 'Anaemia screening and supplementary nutrition for children and mothers.',
    body:
      'Anaemia is endemic among the adolescent girls and mothers we serve. We screen for haemoglobin, provide a full three-month course of iron-folic-acid supplements with counselling, and partner with schools so the treatment is actually completed.',
    stat: '54,000+ children immunised',
    icon: 'leaf',
  },
  {
    key: 'emergency-relief',
    name: 'Emergency Relief',
    short: 'Flood and disaster response with medical camps and supplies.',
    body:
      'When the Kosi and Gandak rivers flood, our emergency teams deploy within 48 hours: medical camps for trauma and waterborne illness, ORS and water-purification supplies, and restocking of damaged health sub-centres.',
    stat: '6 relief camps in the last Kosi floods',
    icon: 'shield',
  },
];

export const VALUES = [
  {
    title: 'Continuity over headcount',
    body: 'We measure who comes back and gets better — not how many we saw once. Chronic care is won in the second and third visit.',
  },
  {
    title: 'Local hands, local trust',
    body: 'Every team includes a community mobiliser from the area. Trust is the medicine that makes the rest work.',
  },
  {
    title: 'Money you can trace',
    body: '82 paise of every rupee reaches programmes. Our annual reports and financials are published in full.',
  },
];
