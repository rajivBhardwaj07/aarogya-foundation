/**
 * Seed script — loads realistic data for every model so the site looks alive
 * on first run. Idempotent: wipes the collections it owns, then re-inserts.
 * Run with `npm run seed` (from /server) or `npm run seed` at the root.
 */
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './lib/db.js';
import { env } from './lib/env.js';
import { User } from './models/User.js';
import { ImpactStat } from './models/ImpactStat.js';
import { Transparency } from './models/Transparency.js';
import { Event } from './models/Event.js';
import { Post } from './models/Post.js';
import { Volunteer } from './models/Volunteer.js';
import { Contact } from './models/Contact.js';
import { Donation } from './models/Donation.js';

const days = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function seedUsers() {
  await User.deleteMany({});
  const admin = new User({ name: 'Dr. Meera Verma', email: env.seed.adminEmail, role: 'ADMIN' });
  await admin.setPassword(env.seed.adminPassword);
  await admin.save();

  const editor = new User({ name: 'Ankit Raj', email: env.seed.editorEmail, role: 'EDITOR' });
  await editor.setPassword(env.seed.editorPassword);
  await editor.save();
  console.log(`[seed] users: ${admin.email} (ADMIN), ${editor.email} (EDITOR)`);
}

async function seedImpact() {
  await ImpactStat.deleteMany({});
  await ImpactStat.insertMany([
    { key: 'patients-treated', label: 'Patients treated', value: 248000, suffix: '+', order: 1 },
    { key: 'villages-reached', label: 'Villages reached', value: 640, suffix: '+', order: 2 },
    { key: 'health-camps', label: 'Health camps held', value: 1820, suffix: '', order: 3 },
    { key: 'volunteers', label: 'Active volunteers', value: 1200, suffix: '+', order: 4 },
    { key: 'safe-deliveries', label: 'Safe deliveries supported', value: 9500, suffix: '+', order: 5 },
    { key: 'children-immunised', label: 'Children immunised', value: 54000, suffix: '+', order: 6 },
  ]);
  console.log('[seed] impact stats: 6');
}

async function seedTransparency() {
  await Transparency.deleteMany({});
  await Transparency.insertMany([
    { year: 2024, programPct: 82, adminPct: 11, fundraisingPct: 7, totalRaisedInPaise: 41200000 * 100, reportUrl: '/reports/aarogya-annual-report-2024.pdf' },
    { year: 2023, programPct: 80, adminPct: 12, fundraisingPct: 8, totalRaisedInPaise: 33500000 * 100, reportUrl: '/reports/aarogya-annual-report-2023.pdf' },
    { year: 2022, programPct: 79, adminPct: 13, fundraisingPct: 8, totalRaisedInPaise: 26800000 * 100, reportUrl: '/reports/aarogya-annual-report-2022.pdf' },
  ]);
  console.log('[seed] transparency: 3 years');
}

async function seedEvents() {
  await Event.deleteMany({});
  await Event.insertMany([
    {
      title: 'Mobile Health Clinic — Saran District Drive',
      slug: 'saran-mobile-clinic-drive',
      description:
        'A three-day mobile clinic covering eight villages in Saran, Bihar. Our doctors will offer free general consultations, blood-pressure and diabetes screening, and dispense essential medicines. Antenatal check-ups available for expecting mothers.',
      startsAt: days(21),
      location: 'Saran District, Bihar',
      type: 'UPCOMING',
      coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=70',
    },
    {
      title: 'Anaemia Screening & Nutrition Camp',
      slug: 'anaemia-nutrition-camp-ranchi',
      description:
        'Haemoglobin screening for adolescent girls and mothers, plus distribution of iron-folic-acid supplements and a nutrition counselling session for families in peri-urban Ranchi.',
      startsAt: days(38),
      location: 'Ranchi, Jharkhand',
      type: 'UPCOMING',
      coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&q=70',
    },
    {
      title: 'Immunisation Fortnight — Gorakhpur Slums',
      slug: 'immunisation-fortnight-gorakhpur',
      description:
        'In partnership with the district health authority, we ran a two-week immunisation drive across urban-slum settlements, vaccinating children under five and registering newborns for routine immunisation.',
      startsAt: days(-45),
      location: 'Gorakhpur, Uttar Pradesh',
      type: 'PAST',
      coverImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=70',
    },
    {
      title: 'Flood Relief Medical Camps — Kosi Belt',
      slug: 'kosi-flood-relief-camps',
      description:
        'Following the Kosi floods, our emergency teams set up six medical camps providing trauma care, ORS and water-purification supplies, and treatment for waterborne illness across affected blocks.',
      startsAt: days(-120),
      location: 'Supaul & Madhepura, Bihar',
      type: 'PAST',
      coverImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=70',
    },
  ]);
  console.log('[seed] events: 4');
}

async function seedPosts() {
  await Post.deleteMany({});
  const posts = [
    {
      type: 'NEWS',
      title: 'Aarogya crosses 600 villages with mobile clinics',
      slug: 'aarogya-crosses-600-villages',
      excerpt:
        'Our mobile health clinic programme has now reached its 600th village — a milestone built on a decade of weekly trips down kachcha roads.',
      category: 'Milestones',
      author: 'Communications Team',
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=70',
      body:
        'When we ran our first mobile clinic in 2014, a single converted van served four villages around Patna. This month, our fleet reached its 600th village.\n\n' +
        'Each clinic brings a doctor, a nurse, a pharmacist and a community mobiliser. The mobiliser is often the most important person on the van — she knows which households have a pregnant mother, which child missed an immunisation, and which elder has stopped taking blood-pressure medication.\n\n' +
        'Reaching 600 villages is not the goal in itself. The goal is the follow-up: the second and third visit, the referral that actually happens, the mother who delivers safely in a facility because someone tracked her pregnancy. That continuity is what we are now investing in.',
    },
    {
      type: 'BLOG',
      title: 'Why we measure follow-up, not footfall',
      slug: 'why-we-measure-follow-up',
      excerpt:
        'A big number at a health camp feels good. But for chronic conditions, the people who come back are the ones whose lives actually change.',
      category: 'Field Notes',
      author: 'Dr. Meera Verma',
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=70',
      body:
        'It is tempting to report the headline: “1,200 patients seen in a single camp.” Donors like it. Newspapers print it. But after years in the field, we have learned that footfall is a vanity metric for chronic care.\n\n' +
        'Hypertension, diabetes and anaemia are not cured in one visit. They are managed over months. So in 2023 we changed what we count. Instead of total patients, our clinical teams now track the share of chronic patients who return for a second and third visit, and whether their numbers improve.\n\n' +
        'The first year was humbling — our return rate was under 30%. Today it is above 60%, because we added phone follow-ups and gave community mobilisers a simple register. The headline number is smaller. The impact is far larger.',
    },
    {
      type: 'BLOG',
      title: 'The anaemia problem hiding in plain sight',
      slug: 'anaemia-hiding-in-plain-sight',
      excerpt:
        'More than half the adolescent girls we screen are anaemic. The fix is cheap and known — the hard part is reaching them consistently.',
      category: 'Nutrition',
      author: 'Sunita Kumari',
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=70',
      body:
        'Anaemia is so common among the adolescent girls we screen that it has become almost invisible — accepted as normal tiredness, normal pallor, normal breathlessness climbing a slope.\n\n' +
        'It is none of those things. Iron-deficiency anaemia hurts concentration in school, raises the risk in a future pregnancy, and saps the energy of girls who already carry heavy domestic loads.\n\n' +
        'The treatment — iron-folic-acid supplementation and dietary counselling — costs very little. The challenge is consistency: a single packet of tablets does nothing. Our nutrition camps now pair screening with a three-month supply and a follow-up visit, and we work with schools so the tablets are taken, not forgotten in a drawer.',
    },
    {
      type: 'NEWS',
      title: 'CSR partnership to fund two new clinic vans',
      slug: 'csr-partnership-two-new-vans',
      excerpt:
        'A new corporate partnership will fund two fully-equipped mobile clinic vans, extending our reach into northern Jharkhand.',
      category: 'Partnerships',
      author: 'Communications Team',
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=1200&q=70',
      body:
        'We are delighted to announce a CSR partnership that will fund two new mobile clinic vans, each equipped for general consultation, basic diagnostics and a small pharmacy.\n\n' +
        'The vans will be deployed in northern Jharkhand, where the nearest primary health centre is often more than an hour away by road. Together they are expected to add roughly 80 villages to our weekly circuit.\n\n' +
        'Under CSR-1 norms, the partnership also supports training for two new clinical teams. Recruitment in the region is already under way.',
    },
  ];
  await Post.insertMany(posts);
  console.log(`[seed] posts: ${posts.length}`);
}

async function seedSubmissions() {
  await Volunteer.deleteMany({});
  await Contact.deleteMany({});
  await Donation.deleteMany({});

  await Volunteer.insertMany([
    { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '+91 98350 11223', city: 'Patna', skills: ['Medical / Nursing', 'Logistics & Supplies'], availability: 'Weekends', message: 'Final-year MBBS student, keen to help at camps.', status: 'NEW' },
    { name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+91 99870 44556', city: 'Ranchi', skills: ['Teaching / Awareness', 'Photography / Media'], availability: 'A few hours a week', status: 'CONTACTED' },
    { name: 'Imran Khan', email: 'imran.k@example.com', phone: '+91 90090 77889', city: 'Gorakhpur', skills: ['Community Mobilisation'], availability: 'On-call for camps', status: 'ONBOARDED' },
  ]);

  await Contact.insertMany([
    { name: 'Lata Devi', email: 'lata.devi@example.com', subject: 'Requesting a camp in our village', body: 'Our village near Hajipur has no clinic nearby. Can you visit?', handled: false },
    { name: 'Sandeep Gupta', email: 'sandeep@example.com', subject: 'Corporate partnership enquiry', body: 'Our company would like to discuss a CSR partnership for FY26.', handled: true },
  ]);

  // A couple of completed donations so the dashboard + transparency feel real.
  await Donation.insertMany([
    { donorName: 'Aditya Menon', email: 'aditya.menon@example.com', amountInPaise: 250000, frequency: 'ONE_TIME', razorpayOrderId: 'order_seed_1', razorpayPaymentId: 'pay_seed_1', status: 'PAID', receiptNo: 'AF/2024-25/100001', receiptSentAt: new Date() },
    { donorName: 'Neha Bansal', email: 'neha.bansal@example.com', pan: 'ABCPN1234Z', amountInPaise: 500000, frequency: 'MONTHLY', razorpayOrderId: 'order_seed_2', razorpayPaymentId: 'pay_seed_2', status: 'PAID', receiptNo: 'AF/2024-25/100002', receiptSentAt: new Date() },
    { donorName: 'Anonymous', email: 'anon@example.com', amountInPaise: 100000, frequency: 'ONE_TIME', razorpayOrderId: 'order_seed_3', status: 'CREATED', receiptNo: 'AF/2024-25/100003' },
  ]);

  console.log('[seed] submissions: 3 volunteers, 2 contacts, 3 donations');
}

async function main() {
  await connectDB();
  console.log(`[seed] using ${mongoose.connection.name}`);
  await seedUsers();
  await seedImpact();
  await seedTransparency();
  await seedEvents();
  await seedPosts();
  await seedSubmissions();
  console.log('[seed] done ✓');
  await disconnectDB();
}

main().catch(async (err) => {
  console.error('[seed] failed:', err);
  await disconnectDB();
  process.exit(1);
});
