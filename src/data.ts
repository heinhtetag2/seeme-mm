import type { ComponentType } from 'react'
import {
  Stethoscope, Sparkles, Wrench, Dumbbell, GraduationCap, Car,
  type LucideProps,
} from 'lucide-react'

export type CategoryId =
  | 'doctor' | 'spa' | 'home' | 'fitness' | 'tutor' | 'auto'

export type Category = {
  id: CategoryId
  name: string
  tagline: string
  Icon: ComponentType<LucideProps>
  /** Tailwind gradient stops for hero / pill backgrounds. */
  gradient: string
  /** Tailwind text colour used on light tinted chips. */
  tint: string
  /** Background tint for cards/icons (light theme works on dark too via /20-/30 alpha). */
  soft: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'doctor',
    name: 'Doctor',
    tagline: 'Clinics, GPs, specialists',
    Icon: Stethoscope,
    gradient: 'from-evergreen-50 to-tropic-50',
    tint: 'text-evergreen-50',
    soft: 'bg-alpha-evergreen-20',
  },
  {
    id: 'spa',
    name: 'Spa & Salon',
    tagline: 'Hair, nails, massage',
    Icon: Sparkles,
    gradient: 'from-rust-50 to-sakura-50',
    tint: 'text-rust-50',
    soft: 'bg-alpha-rust-20',
  },
  {
    id: 'home',
    name: 'Home Services',
    tagline: 'Cleaning, plumbing, electric',
    Icon: Wrench,
    gradient: 'from-data-yellow-40 to-ember-50',
    tint: 'text-data-yellow-40',
    soft: 'bg-alpha-ember-20',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    tagline: 'Trainers, yoga, classes',
    Icon: Dumbbell,
    gradient: 'from-tropic-50 to-ocean-50',
    tint: 'text-tropic-50',
    soft: 'bg-alpha-tropic-20',
  },
  {
    id: 'tutor',
    name: 'Tutor',
    tagline: 'Languages, subjects, music',
    Icon: GraduationCap,
    gradient: 'from-iris-50 to-sakura-50',
    tint: 'text-iris-50',
    soft: 'bg-alpha-iris-20',
  },
  {
    id: 'auto',
    name: 'Auto',
    tagline: 'Repair, wash, tyres',
    Icon: Car,
    gradient: 'from-rust-60 to-rust-50',
    tint: 'text-rust-60',
    soft: 'bg-alpha-rust-20',
  },
]

export const CATEGORY_BY_ID: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>

/* ───────── Service offering on a provider ───────── */

export type ServiceItem = {
  id: string
  name: string
  /** Duration in minutes. */
  duration: number
  /** Price in MMK (Myanmar Kyat). */
  price: number
}

/* ───────── Staff (specialists who work at a provider) ───────── */

export type Staff = {
  id: string
  providerId: string
  name: string
  /** e.g. "Senior stylist", "Lead therapist", "Dr." */
  role: string
  rating: number
  reviewCount: number
  /** Years of practice. */
  years: number
  bio: string
  specialties: string[]
  /** Slot availability summary shown on the card. */
  nextAvailable: string
  /** Pinned as the house favorite. */
  topPick?: boolean
  /** Visual hue used for the avatar gradient (Tailwind from-/to- pair). */
  hue: string
}

/* ───────── Payment methods ───────── */

export type PaymentMethod = 'cash' | 'kbz' | 'wave' | 'aya' | 'card'

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: 'Pay at provider',
  kbz: 'KBZPay',
  wave: 'Wave Money',
  aya: 'AYA Pay',
  card: 'Credit / debit card',
}

export const PAYMENT_SUBLABEL: Record<PaymentMethod, string> = {
  cash: 'Cash or QR on arrival',
  kbz: 'In-app via KBZPay',
  wave: 'In-app via Wave',
  aya: 'In-app via AYA Pay',
  card: 'Visa, Master, JCB',
}

/* ───────── Geo (mock) ───────── */

export type LatLng = { lat: number; lng: number }

/* ───────── Provider (vendor a user books) ───────── */

export type Provider = {
  id: string
  category: CategoryId
  name: string
  /** Short professional title — e.g. "GP & Family Medicine". */
  title: string
  city: string
  /** Neighborhood / street, displayed under the city. */
  area: string
  rating: number
  reviewCount: number
  /** "Open now" hours summary like "Mon–Sat · 9:00 – 18:00". */
  hours: string
  /** Distance in km from current location (mock). */
  distanceKm: number
  /** Marketing tags shown as chips on detail. */
  tags: string[]
  about: string
  services: ServiceItem[]
  /** Verified by Bookly badge. */
  verified?: boolean
  /** Featured on home. */
  featured?: boolean
  /** Bookings confirm immediately, no manual approval. */
  instantConfirm?: boolean
  /** Accepted payment methods. cash always available. */
  paymentMethods?: PaymentMethod[]
  /** Pin location used for the mini-map. */
  coords?: LatLng
  /** Full street line for the directions sheet. */
  address?: string
}

const baseHours = 'Mon–Sat · 9:00 – 18:00'

const PROVIDERS_RAW: Provider[] = [
  // ── Doctor ──────────────────────────────────────────────
  {
    id: 'p-doc-1',
    category: 'doctor',
    name: 'Dr. Aung Thiha',
    title: 'GP & Family Medicine',
    city: 'Yangon',
    area: 'Bahan · Kabar Aye Road',
    rating: 4.9,
    reviewCount: 312,
    hours: baseHours,
    distanceKm: 1.4,
    tags: ['Walk-in', 'English', 'Telehealth'],
    about: 'Family doctor with 14 years of experience. Adult and pediatric general care, vaccinations, and referrals.',
    services: [
      { id: 's1', name: 'General consultation', duration: 30, price: 25000 },
      { id: 's2', name: 'Annual health check', duration: 60, price: 60000 },
      { id: 's3', name: 'Telehealth video', duration: 20, price: 18000 },
    ],
    verified: true,
    featured: true,
  },
  {
    id: 'p-doc-2',
    category: 'doctor',
    name: 'Dr. Su Mon',
    title: 'Dermatologist',
    city: 'Yangon',
    area: 'Sanchaung · Pyay Road',
    rating: 4.8,
    reviewCount: 187,
    hours: 'Tue–Sun · 10:00 – 19:00',
    distanceKm: 2.6,
    tags: ['Skin', 'Acne', 'Cosmetic'],
    about: 'Skin clinic specializing in adult acne, pigmentation, and routine dermatology.',
    services: [
      { id: 's1', name: 'Skin consultation', duration: 30, price: 30000 },
      { id: 's2', name: 'Acne treatment', duration: 45, price: 55000 },
    ],
    verified: true,
  },
  {
    id: 'p-doc-3',
    category: 'doctor',
    name: 'Dr. Kyaw Min',
    title: 'Dental Surgeon',
    city: 'Mandalay',
    area: '26th Street',
    rating: 4.7,
    reviewCount: 98,
    hours: baseHours,
    distanceKm: 4.1,
    tags: ['Dental', 'Whitening'],
    about: 'Modern dental clinic — cleaning, whitening, fillings, and braces.',
    services: [
      { id: 's1', name: 'Cleaning & polish', duration: 45, price: 35000 },
      { id: 's2', name: 'Whitening', duration: 60, price: 90000 },
    ],
  },
  {
    id: 'p-doc-4',
    category: 'doctor',
    name: 'Dr. Hnin Phyu',
    title: 'Pediatrician',
    city: 'Yangon',
    area: 'Yankin',
    rating: 4.9,
    reviewCount: 224,
    hours: baseHours,
    distanceKm: 3.2,
    tags: ['Kids', 'Vaccines'],
    about: 'Child specialist for routine check-ups and immunization schedules.',
    services: [
      { id: 's1', name: 'Pediatric consult', duration: 30, price: 28000 },
      { id: 's2', name: 'Vaccination', duration: 20, price: 22000 },
    ],
    verified: true,
  },

  // ── Spa & Salon ─────────────────────────────────────────
  {
    id: 'p-spa-1',
    category: 'spa',
    name: 'Lotus Spa & Wellness',
    title: 'Day spa',
    city: 'Yangon',
    area: 'Bahan · Dhammazedi Road',
    rating: 4.9,
    reviewCount: 412,
    hours: 'Daily · 10:00 – 22:00',
    distanceKm: 1.1,
    tags: ['Massage', 'Couples', 'Aromatherapy'],
    about: 'Award-winning urban spa offering Burmese herbal therapies and Swedish massage.',
    services: [
      { id: 's1', name: 'Aromatherapy massage', duration: 60, price: 45000 },
      { id: 's2', name: 'Hot stone (90 min)', duration: 90, price: 70000 },
      { id: 's3', name: 'Couple package', duration: 90, price: 120000 },
    ],
    verified: true,
    featured: true,
  },
  {
    id: 'p-spa-2',
    category: 'spa',
    name: 'Maw Studio Hair',
    title: 'Hair salon',
    city: 'Yangon',
    area: 'Sanchaung',
    rating: 4.8,
    reviewCount: 286,
    hours: 'Tue–Sun · 10:00 – 20:00',
    distanceKm: 2.0,
    tags: ['Cut', 'Color', 'Treatment'],
    about: 'Boutique hair studio. Cut, color, balayage, and keratin treatments.',
    services: [
      { id: 's1', name: 'Haircut & wash', duration: 45, price: 22000 },
      { id: 's2', name: 'Color (single)', duration: 90, price: 65000 },
      { id: 's3', name: 'Keratin treatment', duration: 120, price: 150000 },
    ],
  },
  {
    id: 'p-spa-3',
    category: 'spa',
    name: 'Nail Bar by Yu',
    title: 'Nail salon',
    city: 'Yangon',
    area: 'Hlaing',
    rating: 4.7,
    reviewCount: 173,
    hours: 'Daily · 11:00 – 21:00',
    distanceKm: 3.4,
    tags: ['Mani', 'Pedi', 'Gel'],
    about: 'Hygienic nail bar with gel, acrylic, and design specialists.',
    services: [
      { id: 's1', name: 'Classic manicure', duration: 45, price: 18000 },
      { id: 's2', name: 'Gel + design', duration: 75, price: 35000 },
    ],
  },
  {
    id: 'p-spa-4',
    category: 'spa',
    name: 'Mandalay Wellness',
    title: 'Day spa',
    city: 'Mandalay',
    area: '73rd Street',
    rating: 4.8,
    reviewCount: 142,
    hours: 'Daily · 10:00 – 21:00',
    distanceKm: 5.2,
    tags: ['Massage', 'Sauna'],
    about: 'Calm spa retreat with sauna, herbal steam, and full-body massage.',
    services: [
      { id: 's1', name: 'Full body 60 min', duration: 60, price: 38000 },
      { id: 's2', name: 'Sauna + massage', duration: 90, price: 60000 },
    ],
  },

  // ── Home Services ───────────────────────────────────────
  {
    id: 'p-home-1',
    category: 'home',
    name: 'BrightHome Cleaners',
    title: 'Home cleaning',
    city: 'Yangon',
    area: 'Citywide',
    rating: 4.9,
    reviewCount: 528,
    hours: 'Daily · 8:00 – 20:00',
    distanceKm: 0,
    tags: ['Deep clean', 'Move-in/out', 'Eco'],
    about: 'Professional cleaning teams. Background-checked staff and eco-friendly supplies.',
    services: [
      { id: 's1', name: 'Standard clean (2 br)', duration: 120, price: 35000 },
      { id: 's2', name: 'Deep clean (2 br)', duration: 240, price: 75000 },
      { id: 's3', name: 'Move-in / move-out', duration: 300, price: 110000 },
    ],
    verified: true,
    featured: true,
  },
  {
    id: 'p-home-2',
    category: 'home',
    name: 'FixIt Plumbing',
    title: 'Licensed plumber',
    city: 'Yangon',
    area: 'Citywide',
    rating: 4.7,
    reviewCount: 211,
    hours: 'Daily · 8:00 – 22:00',
    distanceKm: 0,
    tags: ['Emergency', 'Leaks', 'Install'],
    about: 'Licensed plumbers, same-day callouts, transparent pricing.',
    services: [
      { id: 's1', name: 'Inspection visit', duration: 45, price: 15000 },
      { id: 's2', name: 'Leak repair', duration: 90, price: 45000 },
    ],
  },
  {
    id: 'p-home-3',
    category: 'home',
    name: 'SparkPro Electrical',
    title: 'Electrician',
    city: 'Yangon',
    area: 'Citywide',
    rating: 4.8,
    reviewCount: 168,
    hours: 'Mon–Sat · 8:00 – 19:00',
    distanceKm: 0,
    tags: ['Wiring', 'Install', 'Safety'],
    about: 'Certified electricians for residential and small commercial work.',
    services: [
      { id: 's1', name: 'Diagnostic visit', duration: 45, price: 18000 },
      { id: 's2', name: 'Outlet / fixture install', duration: 60, price: 25000 },
    ],
    verified: true,
  },
  {
    id: 'p-home-4',
    category: 'home',
    name: 'CoolAir AC Service',
    title: 'AC technician',
    city: 'Mandalay',
    area: 'Citywide',
    rating: 4.6,
    reviewCount: 92,
    hours: 'Daily · 8:00 – 20:00',
    distanceKm: 0,
    tags: ['Service', 'Install', 'Repair'],
    about: 'AC servicing, gas refill, and installation by trained technicians.',
    services: [
      { id: 's1', name: 'AC service & clean', duration: 60, price: 22000 },
      { id: 's2', name: 'Gas refill', duration: 90, price: 55000 },
    ],
  },

  // ── Fitness ─────────────────────────────────────────────
  {
    id: 'p-fit-1',
    category: 'fitness',
    name: 'Coach Min',
    title: 'Personal trainer',
    city: 'Yangon',
    area: 'Bahan',
    rating: 4.9,
    reviewCount: 142,
    hours: 'Mon–Sat · 6:00 – 21:00',
    distanceKm: 1.7,
    tags: ['Strength', 'Weight loss', '1-on-1'],
    about: 'Certified personal trainer with a focus on functional strength and habit building.',
    services: [
      { id: 's1', name: '1-on-1 session', duration: 60, price: 30000 },
      { id: 's2', name: '5-pack discount', duration: 60, price: 130000 },
    ],
    verified: true,
  },
  {
    id: 'p-fit-2',
    category: 'fitness',
    name: 'Yangon Yoga House',
    title: 'Yoga studio',
    city: 'Yangon',
    area: 'Sanchaung',
    rating: 4.8,
    reviewCount: 318,
    hours: 'Daily · 6:00 – 21:00',
    distanceKm: 2.2,
    tags: ['Yoga', 'Drop-in', 'Beginners'],
    about: 'Vinyasa, Yin, and Hatha — drop-in or memberships welcome.',
    services: [
      { id: 's1', name: 'Drop-in class', duration: 60, price: 12000 },
      { id: 's2', name: '10-class pack', duration: 60, price: 100000 },
    ],
    featured: true,
  },
  {
    id: 'p-fit-3',
    category: 'fitness',
    name: 'BoxFit Yangon',
    title: 'Boxing & HIIT',
    city: 'Yangon',
    area: 'Hlaing',
    rating: 4.7,
    reviewCount: 96,
    hours: 'Mon–Sat · 6:00 – 22:00',
    distanceKm: 4.0,
    tags: ['HIIT', 'Boxing', 'Beginner-friendly'],
    about: 'Group HIIT and boxing fundamentals for all levels.',
    services: [
      { id: 's1', name: 'Group HIIT class', duration: 50, price: 14000 },
      { id: 's2', name: 'Boxing fundamentals', duration: 60, price: 18000 },
    ],
  },
  {
    id: 'p-fit-4',
    category: 'fitness',
    name: 'Pilates by Sandi',
    title: 'Pilates instructor',
    city: 'Mandalay',
    area: 'Chanmyathazi',
    rating: 4.9,
    reviewCount: 78,
    hours: 'Tue–Sun · 7:00 – 20:00',
    distanceKm: 6.1,
    tags: ['Reformer', 'Mat', 'Posture'],
    about: 'Certified Pilates instructor — reformer and mat sessions.',
    services: [
      { id: 's1', name: 'Reformer 1-on-1', duration: 55, price: 32000 },
    ],
  },

  // ── Tutor ───────────────────────────────────────────────
  {
    id: 'p-tut-1',
    category: 'tutor',
    name: 'Saya Hla Hla',
    title: 'IELTS & English',
    city: 'Yangon',
    area: 'Sanchaung',
    rating: 4.9,
    reviewCount: 264,
    hours: 'Mon–Sun · 9:00 – 21:00',
    distanceKm: 2.1,
    tags: ['IELTS', 'Speaking', 'Online'],
    about: 'IELTS prep with proven 7+ band track record. Group and 1-on-1.',
    services: [
      { id: 's1', name: '1-on-1 hour', duration: 60, price: 20000 },
      { id: 's2', name: 'Group class (8 wk)', duration: 120, price: 180000 },
    ],
    verified: true,
    featured: true,
  },
  {
    id: 'p-tut-2',
    category: 'tutor',
    name: 'Saya Kyaw Min',
    title: 'Math (Grade 9–12)',
    city: 'Yangon',
    area: 'Yankin',
    rating: 4.8,
    reviewCount: 152,
    hours: 'Mon–Sat · 14:00 – 21:00',
    distanceKm: 3.0,
    tags: ['Math', 'Matric', 'Online'],
    about: 'Matriculation and high-school math tutor. Patient and structured.',
    services: [
      { id: 's1', name: '1-on-1 session', duration: 60, price: 15000 },
    ],
  },
  {
    id: 'p-tut-3',
    category: 'tutor',
    name: 'Yumi Japanese',
    title: 'Japanese language',
    city: 'Yangon',
    area: 'Bahan',
    rating: 4.9,
    reviewCount: 88,
    hours: 'Mon–Sat · 10:00 – 19:00',
    distanceKm: 2.4,
    tags: ['JLPT', 'Beginner', 'Conversation'],
    about: 'Native-fluent Japanese teacher. JLPT N5–N3 prep.',
    services: [
      { id: 's1', name: 'Trial lesson', duration: 30, price: 5000 },
      { id: 's2', name: 'Standard lesson', duration: 60, price: 18000 },
    ],
  },
  {
    id: 'p-tut-4',
    category: 'tutor',
    name: 'Piano Sayama Phyu',
    title: 'Piano teacher',
    city: 'Mandalay',
    area: '35th Street',
    rating: 4.8,
    reviewCount: 64,
    hours: 'Tue–Sun · 14:00 – 20:00',
    distanceKm: 5.5,
    tags: ['Piano', 'Kids', 'ABRSM'],
    about: 'Classical and contemporary piano lessons, ABRSM grades 1–8.',
    services: [
      { id: 's1', name: '30-min lesson', duration: 30, price: 10000 },
      { id: 's2', name: '60-min lesson', duration: 60, price: 18000 },
    ],
  },

  // ── Auto ────────────────────────────────────────────────
  {
    id: 'p-auto-1',
    category: 'auto',
    name: 'Yangon Auto Care',
    title: 'Full-service garage',
    city: 'Yangon',
    area: 'Mayangone',
    rating: 4.8,
    reviewCount: 318,
    hours: 'Mon–Sat · 8:00 – 18:00',
    distanceKm: 5.0,
    tags: ['Service', 'Diagnostic', 'Tyres'],
    about: 'Full-service garage — engine, brakes, tyres, A/C, and diagnostics.',
    services: [
      { id: 's1', name: 'Standard service', duration: 120, price: 80000 },
      { id: 's2', name: 'Diagnostic check', duration: 45, price: 20000 },
    ],
    verified: true,
    featured: true,
  },
  {
    id: 'p-auto-2',
    category: 'auto',
    name: 'SparklePro Car Wash',
    title: 'Car wash & detailing',
    city: 'Yangon',
    area: 'Bahan',
    rating: 4.7,
    reviewCount: 412,
    hours: 'Daily · 8:00 – 21:00',
    distanceKm: 1.8,
    tags: ['Wash', 'Wax', 'Interior'],
    about: 'Express wash through full detail packages.',
    services: [
      { id: 's1', name: 'Express wash', duration: 30, price: 8000 },
      { id: 's2', name: 'Interior + exterior', duration: 90, price: 25000 },
      { id: 's3', name: 'Full detail', duration: 240, price: 80000 },
    ],
  },
  {
    id: 'p-auto-3',
    category: 'auto',
    name: 'TyreHub Mandalay',
    title: 'Tyre & alignment',
    city: 'Mandalay',
    area: '80th Street',
    rating: 4.6,
    reviewCount: 142,
    hours: 'Mon–Sat · 8:00 – 19:00',
    distanceKm: 7.0,
    tags: ['Tyres', 'Alignment'],
    about: 'New tyres, balancing, alignment, and rotation.',
    services: [
      { id: 's1', name: 'Wheel alignment', duration: 60, price: 22000 },
      { id: 's2', name: 'Tyre rotation', duration: 30, price: 10000 },
    ],
  },
  {
    id: 'p-auto-4',
    category: 'auto',
    name: 'BatteryGo Roadside',
    title: 'Mobile battery service',
    city: 'Yangon',
    area: 'Citywide',
    rating: 4.9,
    reviewCount: 88,
    hours: 'Daily · 24h',
    distanceKm: 0,
    tags: ['Roadside', 'Battery', '24h'],
    about: 'On-call battery jump-start, replacement, and roadside assistance.',
    services: [
      { id: 's1', name: 'Jump start', duration: 30, price: 12000 },
      { id: 's2', name: 'Battery replacement', duration: 45, price: 30000 },
    ],
  },
]

/** Default payment / instant-confirm / map coords filled in per category.
 *  Keeps the seed table above readable while still giving every provider
 *  the same shape used by the booking flow and detail screens. */
function withProviderDefaults(p: Provider, index: number): Provider {
  // Synthetic coords in Yangon / Mandalay so the mini-map has something
  // believable to plot. Real app would fetch from a geo service.
  const cityCenter: Record<string, LatLng> = {
    Yangon:    { lat: 16.84, lng: 96.16 },
    Mandalay:  { lat: 21.97, lng: 96.08 },
    Naypyidaw: { lat: 19.76, lng: 96.10 },
  }
  const c = cityCenter[p.city] ?? cityCenter.Yangon
  // Decorrelated jitter — different multipliers for lat vs lng so providers
  // don't cluster along a diagonal on the map view.
  const jitter = (i: number, mul: number, off: number, scale: number) =>
    (((i * mul + off) % 233280) / 233280 - 0.5) * scale
  const coords: LatLng = p.coords ?? {
    lat: c.lat + jitter(index, 9301, 49297, 0.075),
    lng: c.lng + jitter(index, 4373, 71321, 0.090),
  }
  const instantConfirm = p.instantConfirm ?? (p.verified || p.featured || p.rating >= 4.8)
  const payByCategory: Record<CategoryId, PaymentMethod[]> = {
    doctor:  ['cash', 'kbz', 'aya', 'card'],
    spa:     ['cash', 'kbz', 'wave', 'card'],
    home:    ['cash', 'kbz', 'wave'],
    fitness: ['cash', 'kbz', 'wave'],
    tutor:   ['cash', 'kbz', 'wave'],
    auto:    ['cash', 'kbz', 'wave', 'card'],
  }
  return {
    ...p,
    instantConfirm,
    paymentMethods: p.paymentMethods ?? payByCategory[p.category],
    coords,
    address: p.address ?? `${p.area}, ${p.city}`,
  }
}

export const PROVIDERS: Provider[] = PROVIDERS_RAW.map(withProviderDefaults)

export const PROVIDER_BY_ID: Record<string, Provider> = Object.fromEntries(
  PROVIDERS.map((p) => [p.id, p]),
)

export function providersByCategory(id: CategoryId): Provider[] {
  return PROVIDERS.filter((p) => p.category === id)
}

export function featuredProviders(): Provider[] {
  return PROVIDERS.filter((p) => p.featured)
}

export function searchProviders(q: string): Provider[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  return PROVIDERS.filter((p) =>
    p.name.toLowerCase().includes(needle) ||
    p.title.toLowerCase().includes(needle) ||
    p.tags.some((t) => t.toLowerCase().includes(needle)) ||
    CATEGORY_BY_ID[p.category].name.toLowerCase().includes(needle),
  )
}

/* ───────── Bookings ───────── */

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled'

export type Booking = {
  id: string
  providerId: string
  serviceId: string
  /** Specific staff member the user picked (optional — some providers don't expose it). */
  staffId?: string
  /** How the user chose to pay. */
  payment?: PaymentMethod
  /** ISO date e.g. "2026-05-12". */
  date: string
  /** "HH:MM" 24h. */
  time: string
  /** Free-form note from user. */
  note?: string
  /** Number of guests / sessions. */
  party?: number
  status: BookingStatus
  /** ISO timestamp when booking was created. */
  createdAt: string
  /** Optional reference to an AI Studio look the user wants the provider to
   *  recreate. Looks are stored in app state (recentLooks), not in this object. */
  lookId?: string
}

/* ───────── Notifications (inbox) ───────── */

export type NotificationKind =
  | 'booking-confirmed'
  | 'booking-reminder'
  | 'provider-message'
  | 'review-request'
  | 'promo'

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  body: string
  /** Relative label like "2 h", "Yesterday". */
  when: string
  unread: boolean
  /** Optional providerId/bookingId to deep-link from the row. */
  providerId?: string
  bookingId?: string
}

/** Sample inbox shown on a fresh install. */
export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    kind: 'booking-reminder',
    title: 'Tomorrow at Lotus Spa',
    body: 'Your aromatherapy massage is at 14:00. Tap for directions and provider notes.',
    when: '2 h',
    unread: true,
    providerId: 'p-spa-1',
  },
  {
    id: 'n2',
    kind: 'provider-message',
    title: 'BrightHome Cleaners',
    body: '“We’ll arrive at 9:30 sharp tomorrow morning. Please leave the side gate unlocked.”',
    when: '5 h',
    unread: true,
    providerId: 'p-home-1',
  },
  {
    id: 'n3',
    kind: 'review-request',
    title: 'How was Coach Min?',
    body: 'Leave a quick rating to help others find great trainers.',
    when: 'Yesterday',
    unread: false,
    providerId: 'p-fit-1',
  },
  {
    id: 'n4',
    kind: 'promo',
    title: 'Weekend at the spa, 20% off',
    body: 'Members-only rate at top-rated spas in Yangon. Book before Sunday.',
    when: '2 d',
    unread: false,
  },
  {
    id: 'n5',
    kind: 'booking-confirmed',
    title: 'Confirmed · Saya Hla Hla',
    body: 'Your IELTS 1-on-1 hour is locked in for next Tuesday at 18:00.',
    when: '3 d',
    unread: false,
    providerId: 'p-tut-1',
  },
]

/* ───────── Cities for filter ───────── */

export const CITIES = ['All cities', 'Yangon', 'Mandalay', 'Naypyidaw'] as const
export type City = (typeof CITIES)[number]

/* ───────── User profile (mock) ───────── */

export const me = {
  name: 'Hein Htet',
  phone: '+95 9 •••• 3421',
  email: 'hein@bookly.mm',
  city: 'Yangon',
  joined: 'May 2026',
}

export const account = {
  displayName: 'Hein Htet',
  loginPhoneMasked: '+95 9 •••• 3421',
  recoveryEmail: 'hein@bookly.mm',
  notifications: true,
  city: 'Yangon',
}

/* ───────── Helpers ───────── */

export function formatMMK(n: number): string {
  return new Intl.NumberFormat('en-US').format(n) + ' MMK'
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} hr` : `${h}h ${m}m`
}

export function ratingLabel(r: number): string {
  if (r >= 4.8) return 'Exceptional'
  if (r >= 4.5) return 'Excellent'
  if (r >= 4.0) return 'Very good'
  return 'Good'
}

/* ───────── Staff (specialists at each provider) ───────── */

/** Per-provider staff roster. A provider may have 1–4 specialists. */
export const STAFF: Staff[] = [
  // Doctors — usually a single named clinician + assistant
  { id: 's-doc-1-a', providerId: 'p-doc-1', name: 'Dr. Aung Thiha',   role: 'GP, lead clinician',     rating: 4.9, reviewCount: 218, years: 14, bio: '14 years in family practice. Calm, thorough, and patient with kids and elderly alike. Speaks English and Burmese.', specialties: ['Adults', 'Pediatrics', 'Vaccinations'], nextAvailable: 'Today · 14:30', topPick: true, hue: 'from-evergreen-40 to-tropic-50' },
  { id: 's-doc-1-b', providerId: 'p-doc-1', name: 'Nurse Ei Mon',      role: 'Senior nurse',           rating: 4.8, reviewCount: 94,  years: 9,  bio: 'Handles routine check-ups, blood draws, and telehealth coordination.', specialties: ['Vitals', 'Blood draw', 'Telehealth'], nextAvailable: 'Today · 15:00', hue: 'from-evergreen-30 to-tropic-50' },
  { id: 's-doc-2-a', providerId: 'p-doc-2', name: 'Dr. Su Mon',        role: 'Dermatologist',          rating: 4.8, reviewCount: 187, years: 11, bio: 'Adult acne, pigmentation, and cosmetic dermatology. Trained in Singapore.', specialties: ['Acne', 'Pigmentation', 'Anti-aging'], nextAvailable: 'Tomorrow · 10:00', topPick: true, hue: 'from-rust-30 to-sakura-40' },
  { id: 's-doc-3-a', providerId: 'p-doc-3', name: 'Dr. Kyaw Min',      role: 'Dental surgeon',         rating: 4.7, reviewCount: 98,  years: 12, bio: 'General dentistry, whitening, and orthodontics for adults and teens.', specialties: ['Cleaning', 'Whitening', 'Braces'], nextAvailable: 'Tomorrow · 09:30', topPick: true, hue: 'from-tropic-30 to-ocean-50' },
  { id: 's-doc-4-a', providerId: 'p-doc-4', name: 'Dr. Hnin Phyu',     role: 'Pediatrician',           rating: 4.9, reviewCount: 224, years: 10, bio: 'Routine pediatric care, vaccinations, and developmental check-ups.', specialties: ['Newborn', 'Vaccines', 'Allergies'], nextAvailable: 'Today · 16:00', topPick: true, hue: 'from-data-yellow-20 to-ember-40' },

  // Spa & Salon — multiple therapists / stylists
  { id: 's-spa-1-a', providerId: 'p-spa-1', name: 'Khin Sandi',        role: 'Lead therapist',         rating: 4.95, reviewCount: 162, years: 9, bio: 'Burmese herbal therapy and deep tissue. Senior member of the Lotus team.', specialties: ['Deep tissue', 'Aromatherapy', 'Couples'], nextAvailable: 'Today · 19:00', topPick: true, hue: 'from-rust-30 to-sakura-50' },
  { id: 's-spa-1-b', providerId: 'p-spa-1', name: 'May Thazin',         role: 'Aromatherapy specialist', rating: 4.9, reviewCount: 108, years: 6, bio: 'Custom blends and aromatherapy massage for stress relief.', specialties: ['Aromatherapy', 'Swedish', 'Pregnancy'], nextAvailable: 'Today · 17:30', hue: 'from-sakura-30 to-rust-50' },
  { id: 's-spa-1-c', providerId: 'p-spa-1', name: 'Nyein Chan',          role: 'Hot stone therapist',    rating: 4.85, reviewCount: 84, years: 7, bio: 'Hot stone and reflexology specialist with seven years of experience.', specialties: ['Hot stone', 'Reflexology'], nextAvailable: 'Tomorrow · 11:00', hue: 'from-data-yellow-30 to-rust-50' },
  { id: 's-spa-2-a', providerId: 'p-spa-2', name: 'Maw',                role: 'Owner / senior stylist', rating: 4.9, reviewCount: 162, years: 12, bio: 'Founder of Maw Studio. Specialises in balayage and editorial cuts.', specialties: ['Balayage', 'Cut', 'Editorial'], nextAvailable: 'Tomorrow · 14:00', topPick: true, hue: 'from-iris-30 to-sakura-40' },
  { id: 's-spa-2-b', providerId: 'p-spa-2', name: 'Pyae Phyo',           role: 'Color specialist',       rating: 4.8, reviewCount: 92, years: 5, bio: 'Hair color and keratin treatments. Trained in Bangkok.', specialties: ['Color', 'Keratin', 'Highlights'], nextAvailable: 'Today · 16:30', hue: 'from-sakura-30 to-rust-50' },
  { id: 's-spa-2-c', providerId: 'p-spa-2', name: 'Yan Naing',           role: 'Junior stylist',         rating: 4.7, reviewCount: 32, years: 2, bio: 'Quick haircuts and styling. Patient with first-time clients.', specialties: ['Cut', 'Wash'], nextAvailable: 'Today · 15:00', hue: 'from-tropic-30 to-iris-40' },
  { id: 's-spa-3-a', providerId: 'p-spa-3', name: 'Yu Yu',              role: 'Nail artist',            rating: 4.85, reviewCount: 132, years: 6, bio: 'Gel art, acrylics, and intricate hand-painted designs.', specialties: ['Gel', 'Nail art', 'Acrylic'], nextAvailable: 'Today · 18:00', topPick: true, hue: 'from-sakura-30 to-sakura-50' },
  { id: 's-spa-3-b', providerId: 'p-spa-3', name: 'Hsu Hsu',             role: 'Pedicurist',             rating: 4.7, reviewCount: 41, years: 3, bio: 'Hygienic pedicure and spa care.', specialties: ['Pedi', 'Spa', 'Foot care'], nextAvailable: 'Today · 17:00', hue: 'from-rust-30 to-data-yellow-30' },
  { id: 's-spa-4-a', providerId: 'p-spa-4', name: 'Aye Mya',             role: 'Senior therapist',       rating: 4.8, reviewCount: 96, years: 8, bio: 'Full-body Burmese massage and sauna care.', specialties: ['Burmese', 'Sauna'], nextAvailable: 'Today · 18:30', topPick: true, hue: 'from-evergreen-30 to-tropic-40' },

  // Home services — small crews
  { id: 's-home-1-a', providerId: 'p-home-1', name: 'Team Lead Khin',  role: 'Lead cleaner',           rating: 4.9, reviewCount: 261, years: 5, bio: 'Heads a 3-person crew. Background-checked, English-speaking, and detail-driven.', specialties: ['Deep clean', 'Move-out', 'Eco'], nextAvailable: 'Tomorrow · 09:00', topPick: true, hue: 'from-data-yellow-20 to-ember-40' },
  { id: 's-home-1-b', providerId: 'p-home-1', name: 'Crew B · Nilar',   role: 'Crew lead',              rating: 4.8, reviewCount: 142, years: 4, bio: 'Reliable standard-clean lead for 2 BR homes.', specialties: ['Standard', 'Bath', 'Kitchen'], nextAvailable: 'Tomorrow · 13:00', hue: 'from-data-yellow-20 to-ember-40' },
  { id: 's-home-2-a', providerId: 'p-home-2', name: 'Master U Tin',     role: 'Licensed plumber',       rating: 4.8, reviewCount: 174, years: 17, bio: 'Same-day callouts for leaks, installs, and emergency work.', specialties: ['Leaks', 'Install', 'Emergency'], nextAvailable: 'Today · 16:00', topPick: true, hue: 'from-ocean-30 to-ocean-50' },
  { id: 's-home-3-a', providerId: 'p-home-3', name: 'Saya Aung',        role: 'Certified electrician',  rating: 4.85, reviewCount: 124, years: 14, bio: 'Residential and small commercial wiring.', specialties: ['Wiring', 'Safety', 'Install'], nextAvailable: 'Tomorrow · 10:00', topPick: true, hue: 'from-data-yellow-20 to-data-yellow-40' },
  { id: 's-home-4-a', providerId: 'p-home-4', name: 'Min Min',          role: 'AC technician',          rating: 4.6, reviewCount: 76, years: 8, bio: 'Inverter and split-system service & repair.', specialties: ['Service', 'Gas refill', 'Install'], nextAvailable: 'Today · 14:00', topPick: true, hue: 'from-tropic-30 to-ocean-50' },

  // Fitness — coaches & instructors
  { id: 's-fit-1-a',  providerId: 'p-fit-1',  name: 'Coach Min',         role: 'Head coach',             rating: 4.9, reviewCount: 142, years: 8, bio: 'Strength, mobility, and weight loss programming. NASM certified.', specialties: ['Strength', 'Weight loss'], nextAvailable: 'Today · 18:00', topPick: true, hue: 'from-tropic-30 to-ocean-50' },
  { id: 's-fit-2-a',  providerId: 'p-fit-2',  name: 'Anna',              role: 'Lead yoga teacher',      rating: 4.9, reviewCount: 184, years: 10, bio: 'Vinyasa and Yin specialist, RYT-500.', specialties: ['Vinyasa', 'Yin'], nextAvailable: 'Today · 19:30', topPick: true, hue: 'from-evergreen-30 to-tropic-40' },
  { id: 's-fit-2-b',  providerId: 'p-fit-2',  name: 'Hsu Min',            role: 'Hatha teacher',          rating: 4.8, reviewCount: 96, years: 5, bio: 'Beginner-friendly Hatha and breathwork.', specialties: ['Hatha', 'Breathwork', 'Beginner'], nextAvailable: 'Tomorrow · 07:00', hue: 'from-tropic-30 to-evergreen-40' },
  { id: 's-fit-3-a',  providerId: 'p-fit-3',  name: 'Coach Wai',         role: 'Boxing & HIIT',          rating: 4.7, reviewCount: 64, years: 6, bio: 'Group HIIT, boxing fundamentals, conditioning.', specialties: ['Boxing', 'HIIT'], nextAvailable: 'Today · 20:00', topPick: true, hue: 'from-rust-30 to-ember-40' },
  { id: 's-fit-4-a',  providerId: 'p-fit-4',  name: 'Sandi',             role: 'Pilates instructor',     rating: 4.9, reviewCount: 78, years: 7, bio: 'Reformer and mat. STOTT-certified.', specialties: ['Reformer', 'Mat', 'Posture'], nextAvailable: 'Tomorrow · 09:00', topPick: true, hue: 'from-iris-30 to-sakura-40' },

  // Tutors
  { id: 's-tut-1-a',  providerId: 'p-tut-1',  name: 'Saya Hla Hla',     role: 'IELTS & English',        rating: 4.9, reviewCount: 264, years: 13, bio: 'Helped 200+ students reach IELTS band 7+. Patient and structured.', specialties: ['IELTS', 'Speaking', 'Writing'], nextAvailable: 'Today · 17:00', topPick: true, hue: 'from-iris-30 to-sakura-40' },
  { id: 's-tut-2-a',  providerId: 'p-tut-2',  name: 'Saya Kyaw Min',     role: 'Matric Math',            rating: 4.8, reviewCount: 152, years: 9, bio: 'Methodical matric prep with weekly mock papers.', specialties: ['Algebra', 'Geometry', 'Matric'], nextAvailable: 'Today · 19:00', topPick: true, hue: 'from-iris-30 to-iris-50' },
  { id: 's-tut-3-a',  providerId: 'p-tut-3',  name: 'Yumi',              role: 'Japanese, JLPT N5–N3',   rating: 4.9, reviewCount: 88, years: 7, bio: 'Native-fluent. Friendly conversation-first method.', specialties: ['JLPT', 'Conversation'], nextAvailable: 'Tomorrow · 10:30', topPick: true, hue: 'from-rust-30 to-data-yellow-20' },
  { id: 's-tut-4-a',  providerId: 'p-tut-4',  name: 'Sayama Phyu',       role: 'Piano teacher',          rating: 4.8, reviewCount: 64, years: 15, bio: 'ABRSM 1–8, classical and pop arrangement.', specialties: ['ABRSM', 'Classical', 'Kids'], nextAvailable: 'Tomorrow · 16:00', topPick: true, hue: 'from-data-yellow-20 to-rust-50' },

  // Auto
  { id: 's-auto-1-a', providerId: 'p-auto-1', name: 'Master Ko Aung',   role: 'Senior mechanic',         rating: 4.85, reviewCount: 198, years: 19, bio: 'Diagnostics, brakes, and major engine work.', specialties: ['Engine', 'Brakes', 'Diagnostics'], nextAvailable: 'Today · 16:00', topPick: true, hue: 'from-rust-30 to-rust-60' },
  { id: 's-auto-1-b', providerId: 'p-auto-1', name: 'Tech Phyo',         role: 'Tyre & alignment',        rating: 4.7, reviewCount: 84, years: 6, bio: 'Wheel alignment, balancing, rotation.', specialties: ['Tyres', 'Alignment'], nextAvailable: 'Today · 14:00', hue: 'from-sand-30 to-sand-50' },
  { id: 's-auto-2-a', providerId: 'p-auto-2', name: 'Team Sparkle',      role: 'Detailing crew',          rating: 4.7, reviewCount: 212, years: 4, bio: 'Express through full detail packages.', specialties: ['Wash', 'Wax', 'Interior'], nextAvailable: 'Today · 17:30', topPick: true, hue: 'from-tropic-30 to-tropic-50' },
  { id: 's-auto-3-a', providerId: 'p-auto-3', name: 'Master Tin Win',    role: 'Tyre specialist',         rating: 4.6, reviewCount: 88, years: 22, bio: 'Wheel alignment and tyre fitment.', specialties: ['Tyres', 'Alignment'], nextAvailable: 'Tomorrow · 09:30', topPick: true, hue: 'from-sand-30 to-sand-40' },
  { id: 's-auto-4-a', providerId: 'p-auto-4', name: 'Rider Ko Naing',    role: '24h roadside',            rating: 4.9, reviewCount: 64, years: 5, bio: 'On-call battery jumps and roadside assistance.', specialties: ['Battery', 'Roadside'], nextAvailable: 'On-call · 24/7', topPick: true, hue: 'from-data-yellow-20 to-data-yellow-40' },
]

export function staffByProvider(providerId: string): Staff[] {
  return STAFF.filter((s) => s.providerId === providerId)
}

export const STAFF_BY_ID: Record<string, Staff> = Object.fromEntries(
  STAFF.map((s) => [s.id, s]),
)

export function topStaffFor(providerId: string): Staff | undefined {
  const list = staffByProvider(providerId)
  return list.find((s) => s.topPick) ?? list[0]
}

/* ───────── Reviews & ratings ───────── */

export type Review = {
  id: string
  providerId: string
  /** Optional — the specific staff member the review is about. */
  staffId?: string
  authorName: string
  /** Single character used in the avatar bubble when no image is available. */
  authorInitial: string
  /** 1–5 stars. */
  rating: number
  /** Free-form comment. */
  body: string
  /** Display label like "2 d ago" or absolute date. */
  when: string
  /** Up-votes the user has given the review during this session. */
  helpful: number
  /** Optional provider reply. */
  reply?: { author: string; body: string; when: string }
  /** Verified through a confirmed booking. */
  verified?: boolean
}

/** Seeded reviews — at least 3 per provider so the UI never looks empty. */
export const REVIEWS_SEED: Review[] = [
  // Doctors
  { id: 'r-doc-1-1', providerId: 'p-doc-1', staffId: 's-doc-1-a', authorName: 'Khaing M.',  authorInitial: 'K', rating: 5, body: 'Dr. Aung explained everything in plain Burmese for my mom. Never felt rushed. Clinic is spotless.', when: '3 d', helpful: 12, verified: true, reply: { author: 'Dr. Aung Thiha', body: 'Thank you, Khaing! Wishing your mother a quick recovery.', when: '2 d' } },
  { id: 'r-doc-1-2', providerId: 'p-doc-1', staffId: 's-doc-1-a', authorName: 'Win T.',    authorInitial: 'W', rating: 5, body: 'Took my 4-year-old here for a checkup. Doctor was warm and patient.', when: '1 w', helpful: 8, verified: true },
  { id: 'r-doc-1-3', providerId: 'p-doc-1', staffId: 's-doc-1-b', authorName: 'Aung H.',   authorInitial: 'A', rating: 4, body: 'Telehealth call went through quickly. Some delay at the start but very helpful overall.', when: '2 w', helpful: 3 },
  { id: 'r-doc-2-1', providerId: 'p-doc-2', staffId: 's-doc-2-a', authorName: 'Su L.',     authorInitial: 'S', rating: 5, body: 'My acne cleared in 6 weeks. Dr. Su Mon is honest about what works.', when: '5 d', helpful: 18, verified: true },
  { id: 'r-doc-2-2', providerId: 'p-doc-2', staffId: 's-doc-2-a', authorName: 'Nay L.',     authorInitial: 'N', rating: 4, body: 'Good consultation. Products recommended were a bit pricey though.', when: '3 w', helpful: 5 },
  { id: 'r-doc-3-1', providerId: 'p-doc-3', staffId: 's-doc-3-a', authorName: 'Phyo M.',   authorInitial: 'P', rating: 5, body: 'Painless cleaning. Whitening result was visible after one session.', when: '6 d', helpful: 9, verified: true },
  { id: 'r-doc-4-1', providerId: 'p-doc-4', staffId: 's-doc-4-a', authorName: 'Thiri H.',  authorInitial: 'T', rating: 5, body: 'My toddler actually laughed during vaccination. That tells you everything.', when: '2 d', helpful: 22, verified: true, reply: { author: 'Dr. Hnin Phyu', body: 'So glad — see you at the next check!', when: '1 d' } },

  // Spa & Salon
  { id: 'r-spa-1-1', providerId: 'p-spa-1', staffId: 's-spa-1-a', authorName: 'Mya P.',     authorInitial: 'M', rating: 5, body: 'Khin Sandi gave the best deep tissue I have ever had. Worth every kyat.', when: '4 d', helpful: 28, verified: true, reply: { author: 'Lotus Spa', body: 'Thank you, Mya! Khin says she will see you again soon.', when: '3 d' } },
  { id: 'r-spa-1-2', providerId: 'p-spa-1', staffId: 's-spa-1-b', authorName: 'Hla H.',     authorInitial: 'H', rating: 5, body: 'May was so gentle and the aromatherapy blend was heavenly.', when: '1 w', helpful: 14, verified: true },
  { id: 'r-spa-1-3', providerId: 'p-spa-1',                       authorName: 'Soe K.',     authorInitial: 'S', rating: 4, body: 'Couple package was lovely. Reception was a little slow on arrival.', when: '2 w', helpful: 6 },
  { id: 'r-spa-1-4', providerId: 'p-spa-1', staffId: 's-spa-1-c', authorName: 'Aye S.',     authorInitial: 'A', rating: 5, body: 'Hot stone with Nyein Chan — fell asleep halfway through.', when: '3 w', helpful: 11, verified: true },
  { id: 'r-spa-2-1', providerId: 'p-spa-2', staffId: 's-spa-2-a', authorName: 'Eindra W.',  authorInitial: 'E', rating: 5, body: 'Maw absolutely nailed my balayage. Followed my reference photo exactly.', when: '6 d', helpful: 19, verified: true },
  { id: 'r-spa-2-2', providerId: 'p-spa-2', staffId: 's-spa-2-b', authorName: 'Thazin O.',  authorInitial: 'T', rating: 5, body: 'Pyae Phyo took her time matching my color. Hair feels healthier even after dye.', when: '2 w', helpful: 10, verified: true },
  { id: 'r-spa-2-3', providerId: 'p-spa-2',                       authorName: 'Ko Z.',       authorInitial: 'K', rating: 3, body: 'Cut was fine but I had to wait 20 mins past my booked time.', when: '1 m', helpful: 2 },
  { id: 'r-spa-3-1', providerId: 'p-spa-3', staffId: 's-spa-3-a', authorName: 'Phyu E.',    authorInitial: 'P', rating: 5, body: 'Yu Yu drew tiny lotuses on each nail. Best nail art in Hlaing.', when: '4 d', helpful: 16, verified: true },
  { id: 'r-spa-4-1', providerId: 'p-spa-4', staffId: 's-spa-4-a', authorName: 'Mi Mi',      authorInitial: 'M', rating: 5, body: 'Sauna + massage combo was so restorative.', when: '8 d', helpful: 7, verified: true },

  // Home
  { id: 'r-home-1-1', providerId: 'p-home-1', staffId: 's-home-1-a', authorName: 'Yamone K.', authorInitial: 'Y', rating: 5, body: 'The crew showed up early, brought their own eco supplies, and the place looked new.', when: '1 d', helpful: 31, verified: true, reply: { author: 'BrightHome Cleaners', body: 'Thank you, Yamone — we will tell Team Lead Khin!', when: '1 d' } },
  { id: 'r-home-1-2', providerId: 'p-home-1',                        authorName: 'Aung Z.',  authorInitial: 'A', rating: 5, body: 'Move-out cleaning got our deposit back in full. Highly recommend.', when: '1 w', helpful: 17, verified: true },
  { id: 'r-home-1-3', providerId: 'p-home-1',                        authorName: 'Nyein C.', authorInitial: 'N', rating: 4, body: 'Solid standard clean. Forgot one cabinet but they came back to fix.', when: '3 w', helpful: 5 },
  { id: 'r-home-2-1', providerId: 'p-home-2', staffId: 's-home-2-a', authorName: 'Sai H.',   authorInitial: 'S', rating: 5, body: 'Same-day fix for a burst pipe. Master U Tin is a wizard.', when: '5 d', helpful: 23, verified: true },
  { id: 'r-home-3-1', providerId: 'p-home-3', staffId: 's-home-3-a', authorName: 'Pyae S.',  authorInitial: 'P', rating: 5, body: 'Saya Aung walked us through every safety check. Felt very pro.', when: '6 d', helpful: 12, verified: true },
  { id: 'r-home-4-1', providerId: 'p-home-4', staffId: 's-home-4-a', authorName: 'Khant M.', authorInitial: 'K', rating: 4, body: 'AC blowing cold again. Min Min was punctual.', when: '2 w', helpful: 6, verified: true },

  // Fitness
  { id: 'r-fit-1-1', providerId: 'p-fit-1', staffId: 's-fit-1-a', authorName: 'Zaw P.',      authorInitial: 'Z', rating: 5, body: 'Lost 6 kg in 12 weeks with Coach Min. He actually cares about your habits, not just reps.', when: '3 d', helpful: 26, verified: true },
  { id: 'r-fit-2-1', providerId: 'p-fit-2', staffId: 's-fit-2-a', authorName: 'Hnin M.',     authorInitial: 'H', rating: 5, body: 'Anna’s Vinyasa class is the best in town. The studio is calm and clean.', when: '4 d', helpful: 19, verified: true, reply: { author: 'Yangon Yoga House', body: 'Thanks Hnin! See you Tuesday.', when: '4 d' } },
  { id: 'r-fit-2-2', providerId: 'p-fit-2', staffId: 's-fit-2-b', authorName: 'Tun S.',      authorInitial: 'T', rating: 5, body: 'Hsu Min’s Hatha class is perfect for beginners.', when: '1 w', helpful: 9, verified: true },
  { id: 'r-fit-3-1', providerId: 'p-fit-3', staffId: 's-fit-3-a', authorName: 'Aung M.',     authorInitial: 'A', rating: 4, body: 'Tough but fun HIIT. Equipment is decent.', when: '2 w', helpful: 6 },
  { id: 'r-fit-4-1', providerId: 'p-fit-4', staffId: 's-fit-4-a', authorName: 'Theint K.',   authorInitial: 'T', rating: 5, body: 'Reformer 1-on-1 fixed my posture in a month.', when: '1 w', helpful: 8, verified: true },

  // Tutors
  { id: 'r-tut-1-1', providerId: 'p-tut-1', staffId: 's-tut-1-a', authorName: 'Sandar W.',  authorInitial: 'S', rating: 5, body: 'Got my IELTS 7.5 thanks to Saya Hla Hla. Speaking practice was the most useful part.', when: '5 d', helpful: 32, verified: true },
  { id: 'r-tut-2-1', providerId: 'p-tut-2', staffId: 's-tut-2-a', authorName: 'Kyaw L.',    authorInitial: 'K', rating: 5, body: 'Matric distinction in math. Worth every kyat.', when: '1 w', helpful: 18, verified: true },
  { id: 'r-tut-3-1', providerId: 'p-tut-3', staffId: 's-tut-3-a', authorName: 'May P.',     authorInitial: 'M', rating: 5, body: 'Yumi made N4 feel approachable. Conversational, not just textbook.', when: '2 w', helpful: 11, verified: true },
  { id: 'r-tut-4-1', providerId: 'p-tut-4', staffId: 's-tut-4-a', authorName: 'Phyo W.',    authorInitial: 'P', rating: 5, body: 'My daughter passed ABRSM Grade 3 with merit.', when: '3 w', helpful: 7, verified: true },

  // Auto
  { id: 'r-auto-1-1', providerId: 'p-auto-1', staffId: 's-auto-1-a', authorName: 'Tin H.',    authorInitial: 'T', rating: 5, body: 'Honest mechanics — they told me the brake squeal was a quick fix instead of upselling.', when: '6 d', helpful: 24, verified: true },
  { id: 'r-auto-2-1', providerId: 'p-auto-2',                         authorName: 'Soe T.',   authorInitial: 'S', rating: 5, body: 'Full detail made my old Hilux look new.', when: '2 w', helpful: 13, verified: true },
  { id: 'r-auto-3-1', providerId: 'p-auto-3', staffId: 's-auto-3-a',  authorName: 'Win P.',   authorInitial: 'W', rating: 4, body: 'Alignment was fast. Waiting area is basic.', when: '1 w', helpful: 4 },
  { id: 'r-auto-4-1', providerId: 'p-auto-4', staffId: 's-auto-4-a',  authorName: 'Kaung M.', authorInitial: 'K', rating: 5, body: 'Battery died at 11pm — Ko Naing was at my car within 20 minutes.', when: '4 d', helpful: 19, verified: true },
]

/** 5-bucket distribution of ratings (5, 4, 3, 2, 1) for the breakdown bar. */
export function ratingDistribution(reviews: Review[]): [number, number, number, number, number] {
  const out: [number, number, number, number, number] = [0, 0, 0, 0, 0]
  for (const r of reviews) {
    const idx = 5 - Math.max(1, Math.min(5, Math.round(r.rating)))
    out[idx] += 1
  }
  return out
}
