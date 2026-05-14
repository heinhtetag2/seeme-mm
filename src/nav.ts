import type { CategoryId, PaymentMethod } from './data'
import type { LookKind } from './studio'

export type Tab = 'home' | 'explore' | 'studio' | 'bookings' | 'me'

export type View =
  | { kind: 'category'; categoryId: CategoryId }
  | { kind: 'provider'; providerId: string }
  | { kind: 'staff'; staffId: string }
  | { kind: 'write-review'; providerId: string; bookingId?: string; staffId?: string }
  | { kind: 'book'; providerId: string; serviceId?: string; staffId?: string; lookId?: string; rescheduleOf?: string; initialDate?: string; initialTime?: string; initialParty?: number; initialPayment?: PaymentMethod; initialNote?: string }
  | { kind: 'book-review'; providerId: string; serviceId: string; staffId?: string; payment: PaymentMethod; date: string; time: string; party: number; note?: string; lookId?: string; rescheduleOf?: string }
  | { kind: 'book-success'; bookingId: string }
  | { kind: 'booking-detail'; bookingId: string }
  | { kind: 'edit-profile' }
  | { kind: 'city-picker' }
  | { kind: 'search' }
  | { kind: 'language' }
  | { kind: 'appearance' }
  | { kind: 'notifications' }
  | { kind: 'notif-prefs' }
  | { kind: 'about' }
  | { kind: 'help' }
  | { kind: 'terms' }
  | { kind: 'saved' }
  | { kind: 'studio-generate'; look: LookKind }
  | { kind: 'studio-compare'; lookIds: string[] }
  | { kind: 'studio-result'; lookId: string }

export type Nav = {
  go: (v: View) => void
  back: () => void
  tab: Tab
  setTab: (t: Tab) => void
}
