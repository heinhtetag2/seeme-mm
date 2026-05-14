import { useEffect, useState } from 'react'

export type Lang = 'en' | 'my'

const KEY = 'bookly:lang:v2'

export const LANGS: { id: Lang; label: string; sub: string }[] = [
  { id: 'en', label: 'English', sub: 'English' },
  { id: 'my', label: 'Burmese', sub: 'မြန်မာ' },
]

type Dict = Record<string, string>

const en: Dict = {
  // Tabs
  'tab.home': 'Home',
  'tab.explore': 'Explore',
  'tab.studio': 'Studio',
  'tab.bookings': 'Bookings',
  'tab.me': 'Me',

  // TopBar
  'topbar.search': 'Search',
  'topbar.notifications': 'Notifications',

  // Onboarding
  'onb.title.1': 'Book trusted services\nin a tap.',
  'onb.title.2': 'Verified providers,\nclear pricing.',
  'onb.title.3': 'Manage every booking\nin one place.',
  'onb.sub.1': 'Doctors, salons, home services, fitness, tutors, and auto care — all in Bookly.',
  'onb.sub.2': 'Real ratings, transparent prices, no surprise fees.',
  'onb.sub.3': 'Confirm, reschedule, or cancel anytime from My Bookings.',
  'onb.next': 'Next',
  'onb.skip': 'Skip',
  'onb.start': 'Get started',

  // Home
  'home.greeting': 'Hi {name}',
  'home.tagline': 'What can we book for you today?',
  'home.search.placeholder': 'Search services, providers…',
  'home.section.categories': 'Categories',
  'home.section.featured': 'Featured this week',
  'home.section.nearby': 'Near you',
  'home.section.popular': 'Popular in {city}',
  'home.seeAll': 'See all',
  'home.banner.title': 'Become a Bookly Pro',
  'home.banner.sub': 'Get priority slots and exclusive promos.',

  // Explore
  'explore.title': 'Explore',
  'explore.search.placeholder': 'Any service',
  'explore.filter.all': 'All',
  'explore.empty.title': 'Search for a service',
  'explore.empty.sub': 'Try “massage”, “electrician”, or “IELTS”.',
  'explore.results': '{count} results',

  // Category screen
  'category.results': '{count} providers',
  'category.sort.recommended': 'Recommended',
  'category.sort.rating': 'Top rated',
  'category.sort.distance': 'Nearest',
  'category.filter.city': 'City',

  // Provider detail
  'provider.about': 'About',
  'provider.services': 'Services',
  'provider.hours': 'Hours',
  'provider.reviews': '{count} reviews',
  'provider.book': 'Book now',
  'provider.verified': 'Verified',
  'provider.distance': '{km} km away',

  // Booking flow
  'book.title': 'Book',
  'book.step.service': 'Choose service',
  'book.step.when': 'Pick a time',
  'book.step.details': 'Last details',
  'book.date': 'Date',
  'book.time': 'Time',
  'book.party': 'People',
  'book.note': 'Note for the provider',
  'book.note.placeholder': 'E.g. arriving 10 min late',
  'book.continue': 'Continue',
  'book.review': 'Review booking',
  'book.confirm': 'Confirm booking',
  'book.summary': 'Summary',
  'book.total': 'Total',
  'book.success.title': 'Booking confirmed',
  'book.success.sub': 'We’ve sent the details to your phone. The provider will reach out to confirm.',
  'book.success.viewBooking': 'View booking',
  'book.success.done': 'Done',

  // Bookings tab
  'bookings.title': 'My bookings',
  'bookings.tab.upcoming': 'Upcoming',
  'bookings.tab.past': 'Past',
  'bookings.empty.upcoming.title': 'No upcoming bookings',
  'bookings.empty.upcoming.sub': 'Book a service from the home tab.',
  'bookings.empty.past.title': 'No past bookings yet',
  'bookings.empty.past.sub': 'Your booking history will appear here.',
  'bookings.detail.title': 'Booking details',
  'bookings.detail.cancel': 'Cancel booking',
  'bookings.detail.reschedule': 'Reschedule',
  'bookings.detail.contactProvider': 'Contact provider',
  'bookings.cancel.confirm.title': 'Cancel booking?',
  'bookings.cancel.confirm.sub': 'You can rebook at any time. No cancellation fee.',
  'bookings.cancel.keep': 'Keep booking',
  'bookings.cancel.confirm': 'Cancel booking',
  'bookings.status.upcoming': 'Upcoming',
  'bookings.status.completed': 'Completed',
  'bookings.status.cancelled': 'Cancelled',
  'bookings.findProvider': 'Find a provider',
  'bookings.bookAgain': 'Book again',
  'bookings.leaveReview': 'Leave a review',
  'bookings.viewBooking': 'View booking',
  'bookings.from': 'From',

  // Saved
  'saved.title': 'Saved',
  'saved.headline': 'Your favorites.',
  'saved.subtitle': '{count} places kept for next time',
  'saved.empty.title': 'No saved places yet',
  'saved.empty.sub': "Tap the heart on any provider and they'll wait for you here.",

  // Provider card / list
  'card.freeCancellation': 'Free cancellation',
  'card.earnRewards': 'Earn rewards on booking',
  'card.todayEarliest': 'Today · earliest 3:30 PM',
  'card.sessionFrom': 'session · from',

  // Explore floating UI
  'explore.mapArea': 'Map area',
  'explore.nearbyVenues': 'Nearby venues',
  'explore.noPlacesInArea': 'No places in this area',
  'explore.recenter': 'Recenter',
  'explore.venuesNearby': '{count} venues nearby',
  'explore.zeroResults': '0 results',
  'explore.clearSearch': 'Clear search',

  // Payment picker
  'payment.notSetUp': 'Not set up',
  'payment.tapToSetUp': 'Tap to set up',
  'payment.managePayments': 'Manage payment methods',
  'payment.manage.kicker': 'Payments',
  'payment.manage.title': 'Manage methods',
  'payment.manage.sub': 'Unlink anything you no longer want stored.',
  'payment.manage.empty': 'No linked methods yet.',
  'payment.unlink': 'Unlink',
  'payment.encrypted': 'Encrypted · used only for booking payments',
  'payment.linking': 'Linking…',
  'payment.sendCode': 'Send code',
  'payment.addCard': 'Add card',

  // Share sheet
  'share.kicker': 'Share',
  'share.title': 'Send to a friend',
  'share.copyLink': 'Copy link',
  'share.more': 'More',
  'share.linkCopied': 'Link copied',

  // Staff portfolio
  'staff.portfolio': 'Portfolio',
  'staff.selectedWork': 'Selected work',
  'staff.seeAll': 'See all',
  'staff.showLess': 'Show less',

  // Booking review badges
  'badge.instantBooking': 'Instant booking',
  'badge.providerConfirms': 'Provider confirms',
  'badge.freeCancel2h': 'Free cancel · 2h before',

  // Booking flow
  'book.mostPicked': 'Most picked',

  // Provider screen sections
  'provider.hasBooking': 'You have a booking here',
  'provider.viewLink': 'View →',
  'provider.about.kicker': 'About',
  'provider.about.title': 'The story',
  'provider.team.kicker': 'Specialists',
  'provider.team.title': 'Meet the team',
  'provider.team.count': '{count} pros',
  'provider.where.kicker': 'Where & when',
  'provider.where.title': 'Find them',
  'provider.menu.kicker': 'Menu',
  'provider.menu.title': 'Services & prices',
  'provider.specialties': 'Specialties',
  'provider.reviewsKicker': 'Reviews · {count}',
  'provider.whatClientsSay': 'What clients say',
  'provider.from': 'From',

  // Profile stats
  'me.stats.bookings': 'Bookings',
  'me.stats.saved': 'Saved',
  'me.stats.memberSince': 'Member since',
  'me.profile.kicker': 'Profile',

  // BookFlow steps (additional — book.step.service / book.step.when defined above)
  'book.step.specialist': 'Pick your specialist',
  'book.step.date': 'Pick a date',
  'book.step.people': 'How many people?',
  'book.step.payment': 'How will you pay?',
  'book.step.note': 'Anything to share? (optional)',
  'book.notePlaceholder': 'Allergies, preferences, parking notes…',
  'book.label.specialist': 'Specialist',
  'book.label.review': 'Review',
  'book.label.morning': 'Morning',
  'book.label.afternoon': 'Afternoon',
  'book.label.evening': 'Evening',
  'book.label.pickDate': 'Pick date',
  'book.anyAvailable': 'Any available',

  // Write review
  'review.kicker.reviewing': 'Reviewing',
  'review.kicker.rating': 'Your rating',
  'review.kicker.highlights': 'Quick highlights',
  'review.kicker.comment': 'Comment',
  'review.kicker.staff': 'Who served you? (optional)',
  'review.kicker.title': 'Leave a review',
  'review.submit': 'Submit review',
  'review.commentPlaceholder': 'Share your experience…',

  // Directions sheet
  'directions.kicker': 'Directions',

  // Notifications
  'notifs.allCaughtUp.title': 'All caught up',
  'notifs.allCaughtUp.sub': 'No new notifications right now.',

  // Category empty
  'category.empty.title': 'No providers match',
  'category.empty.sub': 'Try changing the filters or city.',

  // Home sections
  'home.nearby.kicker': 'Nearby',
  'home.bookly.kicker': 'Join Bookly Pro',
  'home.featured.kicker': 'Featured',
  'home.cats.kicker': 'Categories',

  // Receipt
  'receipt.serviceFee': 'Service fee',
  'receipt.free': 'Free',
  'home.nearby.places': '{count} places around {city}',
  'home.nearby.sub': 'Tap to open on the map · sorted by distance',

  // Staff sheet
  'staff.years': '{years} yrs experience',
  'staff.nextAvailable': 'Next available',
  'staff.bookWith': 'Book with {name}',
  'staff.viewProfile': 'View full profile',
  'staff.title': 'Specialist',
  'staff.about.title': 'In their own words',
  'staff.about.kicker': 'About',
  'staff.specialtiesKicker': 'Specialties',
  'staff.knownFor': "What they're known for",
  'staff.reviewsCount': 'Reviews · {count}',
  'staff.statRating': 'Rating',
  'staff.statReviews': 'Reviews',
  'staff.statExperience': 'Experience',
  'staff.noReviews': 'No individual reviews yet — see {provider}\'s reviews on their page.',

  // Receipt rows
  'receipt.service': 'Service',
  'receipt.with': 'With',
  'receipt.when': 'When',
  'receipt.people': 'People',
  'receipt.payment': 'Payment',
  'receipt.note': 'Note',
  'receipt.anyAvailable': 'Any available specialist',
  'minimap.tap': 'Tap for directions',

  // Studio (AI looks)
  'studio.title': 'Studio',
  'studio.start.kicker': 'Start',
  'studio.start.title': 'Pick a category',
  'studio.saved.title': 'Your saved looks',
  'studio.history.kicker': 'History',
  'studio.history.title': 'Recently generated',
  'studio.compare.title': 'Compare',
  'studio.compare.sideBySide': 'Side-by-side',
  'studio.compare.kicker': 'Decision time',
  'studio.result.title': 'Result',
  'studio.result.look': 'Look',
  'studio.result.bookKicker': 'Book this look',
  'studio.generate.style': 'Style',
  'studio.generate.color': 'Color',
  'studio.generate.results': 'Results',

  // Search / Category sheets
  'sheet.sortBy': 'Sort by',
  'sheet.city': 'City',
  'sheet.category': 'Category',

  // Booking flow extras
  'book.specialistsKicker': 'Specialists',

  // Home extras
  'home.byCategory': 'By category',
  'home.weekKicker': 'This week',
  'home.weekTitle': "Editor's pick",
  'home.featured.title': 'Worth a look',
  'home.popular.kicker': 'Popular in {city}',
  'home.popular.title': 'Trusted by locals',

  // Toasts
  'toast.callingProvider': 'Calling provider…',
  'toast.addressCopied': 'Address copied',
  'toast.couldNotCopy': 'Could not copy',
  'toast.bookFirstToReview': 'Book a service first to leave a review',
  'toast.thanksReview': 'Thanks for your review',
  'toast.detectedYangon': 'Detected: Yangon',
  'toast.bookingRescheduled': 'Booking rescheduled',
  'toast.sharingTo': 'Sharing to {channel}…',
  'toast.sharingSoon': 'Sharing soon',

  // Settings page kickers
  'settings.kicker.account': 'ACCOUNT',
  'settings.kicker.preferences': 'PREFERENCES',
  'settings.kicker.about': 'ABOUT',
  'settings.kicker.support': 'SUPPORT',
  'settings.kicker.legal': 'LEGAL',

  // Studio hero
  'studio.hero.aiStudio': 'AI Studio',
  'studio.hero.beta': 'Beta',
  'studio.hero.title1': 'Try the look',
  'studio.hero.title2': 'before',
  'studio.hero.title3': 'you book.',
  'studio.hero.sub': 'Generate styles on your photo, compare side-by-side, then book the studio that nails the look.',

  // Home Bookly Pro promo
  'home.pro.title': 'Priority slots, members-only rates.',
  'home.pro.sub': 'Skip the waitlist at top providers and unlock up to 20% off.',
  'home.pro.cta': 'Learn more',
  'home.featured.seeAll': 'See all',
  'home.cats.all': 'All',

  // Studio generate
  'studio.generate.cta': 'Generate 4 variants',
  'studio.generate.poweredBy': 'Powered by Bookly Studio · runs on-device',
  'studio.generate.generating': 'Generating 4 variants…',
  'studio.generate.generatingSub': 'Sampling style, applying color, balancing tones…',

  // Provider gallery
  'provider.gallery.kicker': 'Gallery',
  'provider.gallery.title': 'From the studio',

  // Help & Terms body
  'help.faqSub': 'Common questions',
  'help.reportSub': 'Tell us what went wrong',
  'terms.p1': 'By using Bookly you agree to our terms of service and privacy policy.',
  'terms.p2': 'Bookings are held free of charge. Payment is collected by the provider on arrival unless stated otherwise. You can cancel any booking up to 2 hours before the scheduled time at no cost. Repeated late cancellations may impact your account standing.',
  'terms.p3.intro': 'We collect minimal personal data needed to process bookings. We do not sell your data. The full privacy policy is available at',
  'terms.p3.url': 'bookly.mm/privacy',

  // Me / Profile
  'me.editProfile': 'Edit profile',
  'me.section.activity': 'Activity',
  'me.section.preferences': 'Preferences',
  'me.section.account': 'Account',
  'me.section.helpAbout': 'Help & About',
  'me.bookings': 'My bookings',
  'me.favorites': 'Saved providers',
  'me.notifications': 'Notifications',
  'me.language': 'Language',
  'me.appearance': 'Appearance',
  'me.help': 'Help & support',
  'me.terms': 'Terms & privacy',
  'me.about': 'About Bookly',
  'me.logout': 'Log out',

  // Settings sub-screens
  'language.title': 'Language',
  'language.app': 'App language',
  'language.note': 'Changing the language applies immediately.',
  'appearance.title': 'Appearance',
  'appearance.system': 'System',
  'appearance.dark': 'Dark',
  'appearance.light': 'Light',
  'notifications.title': 'Notifications',
  'notifications.push': 'Push notifications',
  'notifications.push.sub': 'Booking updates, reminders',
  'notifications.email': 'Email receipts',
  'notifications.email.sub': 'Confirmation and history by email',
  'notifications.promos': 'Promotions',
  'notifications.promos.sub': 'Special offers and discounts',
  'about.title': 'About',
  'about.version': 'Version 1.0.0',
  'about.tagline': 'Bookly · Book trusted services in Myanmar',
  'help.title': 'Help & support',
  'help.contact': 'Contact support',
  'help.faq': 'FAQ',
  'help.report': 'Report a problem',
  'terms.title': 'Terms & privacy',

  // Edit profile
  'profile.title': 'Edit profile',
  'profile.name': 'Name',
  'profile.phone': 'Phone',
  'profile.email': 'Email',
  'profile.city': 'City',
  'profile.save': 'Save changes',
  'profile.saved': 'Profile updated',

  // Toasts / generic
  'toast.bookingConfirmed': 'Booking confirmed',
  'toast.bookingCancelled': 'Booking cancelled',
  'toast.saved': 'Saved',
  'toast.removed': 'Removed',
  'common.cancel': 'Cancel',
  'common.back': 'Back',
  'common.continue': 'Continue',
  'common.confirm': 'Confirm',
  'common.close': 'Close',
}

const my: Dict = {
  'tab.home': 'ပင်မ',
  'tab.explore': 'ရှာဖွေ',
  'tab.studio': 'စတူဒီယို',
  'tab.bookings': 'ဘွတ်ကင်',
  'tab.me': 'ကျွန်ုပ်',

  'topbar.search': 'ရှာဖွေရန်',
  'topbar.notifications': 'အကြောင်းကြားချက်များ',

  'onb.title.1': 'ယုံကြည်စိတ်ချရတဲ့\nဝန်ဆောင်မှုတွေကို တစ်ချက်တည်း ဘွတ်ကင်လုပ်ပါ။',
  'onb.title.2': 'အတည်ပြုပြီးသူများ၊\nစျေးနှုန်း ပွင့်လင်း။',
  'onb.title.3': 'ဘွတ်ကင်တိုင်းကို\nတစ်နေရာတည်းမှ စီမံပါ။',
  'onb.sub.1': 'ဆရာဝန်၊ ဆလွန်၊ အိမ်ဝန်ဆောင်မှု၊ ကြံ့ခိုင်ရေး၊ ကျူရှင်နဲ့ ကားပြုပြင် — Bookly မှာ။',
  'onb.sub.2': 'အရည်အသွေးစစ်အမှတ်များ၊ ပွင့်လင်းသော စျေးနှုန်း၊ ဖုံးကွယ်ထားတဲ့ ကြေးမရှိ။',
  'onb.sub.3': 'My Bookings မှ မည်သည့်အချိန်မဆို အတည်ပြု၊ ပြန်ပြောင်း သို့မဟုတ် ပယ်ဖျက်နိုင်ပါတယ်။',
  'onb.next': 'ဆက်လုပ်မည်',
  'onb.skip': 'ကျော်မည်',
  'onb.start': 'စတင်ရန်',

  'home.greeting': 'မင်္ဂလာပါ {name}',
  'home.tagline': 'ဘာကို ဘွတ်ကင်လုပ်ချင်ပါသလဲ?',
  'home.search.placeholder': 'ဝန်ဆောင်မှု၊ ဆိုင်ရာ ရှာဖွေ…',
  'home.section.categories': 'အမျိုးအစားများ',
  'home.section.featured': 'ဒီသီတင်းပတ်ရွေးချယ်ခံ',
  'home.section.nearby': 'အနီးအနားရှိ',
  'home.section.popular': '{city} တွင် ခေတ်စားနေသော',
  'home.seeAll': 'အားလုံးကြည့်ရန်',
  'home.banner.title': 'Bookly Pro ဖြစ်လိုက်ပါ',
  'home.banner.sub': 'ဦးစားပေး အချိန်ဇယားနှင့် အထူးကမ်းလှမ်းချက်များ ရယူပါ။',

  'explore.title': 'ရှာဖွေရန်',
  'explore.search.placeholder': 'ဝန်ဆောင်မှု ရှာရန်',
  'explore.filter.all': 'အားလုံး',
  'explore.empty.title': 'ဝန်ဆောင်မှုကို ရှာဖွေပါ',
  'explore.empty.sub': '“massage”, “electrician”, “IELTS” စသည် စမ်းကြည့်ပါ။',
  'explore.results': 'ရလဒ် {count} ခု',

  'category.results': 'ဝန်ဆောင်ပေးသူ {count} ဦး',
  'category.sort.recommended': 'အကြံပြု',
  'category.sort.rating': 'အဆင့်အမြင့်ဆုံး',
  'category.sort.distance': 'အနီးဆုံး',
  'category.filter.city': 'မြို့',

  'provider.about': 'အကြောင်း',
  'provider.services': 'ဝန်ဆောင်မှုများ',
  'provider.hours': 'အချိန်',
  'provider.reviews': 'သုံးသပ်ချက် {count} ခု',
  'provider.book': 'ယခု ဘွတ်ကင်လုပ်ရန်',
  'provider.verified': 'အတည်ပြုပြီး',
  'provider.distance': '{km} ကီလိုမီတာ ကွာ',

  'book.title': 'ဘွတ်ကင်',
  'book.step.service': 'ဝန်ဆောင်မှု ရွေးပါ',
  'book.step.when': 'အချိန် ရွေးပါ',
  'book.step.details': 'နောက်ဆုံး အသေးစိတ်',
  'book.date': 'ရက်စွဲ',
  'book.time': 'အချိန်',
  'book.party': 'လူဦးရေ',
  'book.note': 'မှာချက်',
  'book.note.placeholder': 'ဥပမာ - ၁၀ မိနစ်နောက်ကျမည်',
  'book.continue': 'ဆက်လုပ်မည်',
  'book.review': 'ပြန်စစ်ပါ',
  'book.confirm': 'ဘွတ်ကင် အတည်ပြုရန်',
  'book.summary': 'အကျဉ်း',
  'book.total': 'စုစုပေါင်း',
  'book.success.title': 'ဘွတ်ကင် အတည်ပြုပြီးပါပြီ',
  'book.success.sub': 'အသေးစိတ်ကို ဖုန်းသို့ ပို့ထားပါသည်။ ဆိုင်မှ ဆက်သွယ်ပါမည်။',
  'book.success.viewBooking': 'ဘွတ်ကင်ကြည့်ရန်',
  'book.success.done': 'ပြီးပြီ',

  'bookings.title': 'ကျွန်ုပ်၏ ဘွတ်ကင်များ',
  'bookings.tab.upcoming': 'လာမည့်',
  'bookings.tab.past': 'ပြီးခဲ့သော',
  'bookings.empty.upcoming.title': 'လာမည့် ဘွတ်ကင် မရှိပါ',
  'bookings.empty.upcoming.sub': 'ပင်မစာမျက်နှာမှ ဝန်ဆောင်မှု ဘွတ်ကင်လုပ်ပါ။',
  'bookings.empty.past.title': 'ပြီးခဲ့သော ဘွတ်ကင် မရှိသေး',
  'bookings.empty.past.sub': 'ဘွတ်ကင် မှတ်တမ်းများ ဤနေရာတွင် ပေါ်မည်။',
  'bookings.detail.title': 'ဘွတ်ကင် အသေးစိတ်',
  'bookings.detail.cancel': 'ဘွတ်ကင် ပယ်ဖျက်ရန်',
  'bookings.detail.reschedule': 'အချိန် ပြန်ပြောင်းရန်',
  'bookings.detail.contactProvider': 'ဆိုင်ကို ဆက်သွယ်ရန်',
  'bookings.cancel.confirm.title': 'ဘွတ်ကင် ပယ်ဖျက်မလား?',
  'bookings.cancel.confirm.sub': 'အချိန်မရွေး ပြန်ဘွတ်ကင်လုပ်နိုင်ပါသည်။ ပယ်ဖျက်ခ မရှိပါ။',
  'bookings.cancel.keep': 'ဆက်လုပ်မည်',
  'bookings.cancel.confirm': 'ပယ်ဖျက်မည်',
  'bookings.status.upcoming': 'လာမည့်',
  'bookings.status.completed': 'ပြီးဆုံး',
  'bookings.status.cancelled': 'ပယ်ဖျက်ထား',
  'bookings.findProvider': 'ဆိုင်ရှာရန်',
  'bookings.bookAgain': 'ထပ်မံ ဘွတ်ကင်တင်မည်',
  'bookings.leaveReview': 'သုံးသပ်ချက် ရေးရန်',
  'bookings.viewBooking': 'ဘွတ်ကင်ကြည့်ရန်',
  'bookings.from': 'အနိမ့်ဆုံး',

  // Saved
  'saved.title': 'သိမ်းထားသော',
  'saved.headline': 'သင် နှစ်သက်ရာများ။',
  'saved.subtitle': 'နောက်တစ်ကြိမ်အတွက် သိမ်းထားသော နေရာ {count} ခု',
  'saved.empty.title': 'သိမ်းထားသော နေရာ မရှိသေးပါ',
  'saved.empty.sub': 'ဆိုင်တိုင်းရှိ နှလုံးပုံကို နှိပ်ပါ၊ ဤနေရာတွင် စောင့်နေပါမည်။',

  // Provider card / list
  'card.freeCancellation': 'အခမဲ့ ပယ်ဖျက်နိုင်',
  'card.earnRewards': 'ဘွတ်ကင်လုပ်တိုင်း ဆုလက်ဆောင်များ ရရှိ',
  'card.todayEarliest': 'ယနေ့ · အစောဆုံး ၃:၃၀ ညနေ',
  'card.sessionFrom': 'တစ်ကြိမ် · မှစ၍',

  // Explore floating UI
  'explore.mapArea': 'မြေပုံ',
  'explore.nearbyVenues': 'အနီးနားရှိ ဆိုင်များ',
  'explore.noPlacesInArea': 'ဤနေရာတွင် ဆိုင်မရှိ',
  'explore.recenter': 'ပြန်ရှာရန်',
  'explore.venuesNearby': 'အနီးနားရှိ ဆိုင် {count} ခု',
  'explore.zeroResults': 'ရလဒ် ၀ ခု',
  'explore.clearSearch': 'ရှာဖွေမှု ဖျက်ရန်',

  // Payment picker
  'payment.notSetUp': 'မချိတ်ထားသေး',
  'payment.tapToSetUp': 'ချိတ်ဆက်ရန် နှိပ်ပါ',
  'payment.managePayments': 'ငွေပေးချေမှု စီမံရန်',
  'payment.manage.kicker': 'ငွေပေးချေမှု',
  'payment.manage.title': 'စီမံခန့်ခွဲမှု',
  'payment.manage.sub': 'မလိုလားသော ငွေပေးချေမှုများကို ဖျက်နိုင်ပါသည်။',
  'payment.manage.empty': 'ချိတ်ထားသော အကောင့် မရှိသေးပါ။',
  'payment.unlink': 'ဖျက်ရန်',
  'payment.encrypted': 'လုံခြုံစွာ သိမ်းဆည်း · ဘွတ်ကင်အတွက်သာ',
  'payment.linking': 'ချိတ်ဆက်နေသည်…',
  'payment.sendCode': 'ကုဒ် ပို့ရန်',
  'payment.addCard': 'ကတ်ထည့်ရန်',

  // Share sheet
  'share.kicker': 'မျှဝေရန်',
  'share.title': 'သူငယ်ချင်းသို့ ပို့ရန်',
  'share.copyLink': 'လင့်ခ် ကူးယူ',
  'share.more': 'အခြား',
  'share.linkCopied': 'လင့်ခ် ကူးယူပြီး',

  // Staff portfolio
  'staff.portfolio': 'အလုပ်များ',
  'staff.selectedWork': 'ရွေးချယ်ထားသော အလုပ်များ',
  'staff.seeAll': 'အားလုံးကြည့်',
  'staff.showLess': 'အနည်းငယ် ပြသ',

  // Booking review badges
  'badge.instantBooking': 'ချက်ချင်း အတည်ပြု',
  'badge.providerConfirms': 'ဆိုင်က အတည်ပြုမည်',
  'badge.freeCancel2h': 'အခမဲ့ ပယ်ဖျက် · ၂ နာရီ ကြိုတင်',

  // Booking flow
  'book.mostPicked': 'အရွေးချယ်ဆုံး',

  // Provider screen sections
  'provider.hasBooking': 'ဤနေရာတွင် သင်၏ ဘွတ်ကင်ရှိနေသည်',
  'provider.viewLink': 'ကြည့်ရန် →',
  'provider.about.kicker': 'အကြောင်း',
  'provider.about.title': 'ဇာတ်လမ်း',
  'provider.team.kicker': 'ကျွမ်းကျင်ပညာရှင်များ',
  'provider.team.title': 'အဖွဲ့သားများ',
  'provider.team.count': '{count} ဦး',
  'provider.where.kicker': 'ဘယ်နေရာ · ဘယ်အချိန်',
  'provider.where.title': 'ရှာရန်',
  'provider.menu.kicker': 'မီနူး',
  'provider.menu.title': 'ဝန်ဆောင်မှု · စျေးနှုန်း',
  'provider.specialties': 'ကျွမ်းကျင်သော အရာများ',
  'provider.reviewsKicker': 'သုံးသပ်ချက် · {count}',
  'provider.whatClientsSay': 'ဖောက်သည်များ၏ အမြင်',
  'provider.from': 'အနိမ့်ဆုံး',

  // Profile stats
  'me.stats.bookings': 'ဘွတ်ကင်',
  'me.stats.saved': 'သိမ်းထား',
  'me.stats.memberSince': 'အသင်းဝင်ခုနှစ်',
  'me.profile.kicker': 'ပရိုဖိုင်',

  // BookFlow steps (additional — book.step.service / book.step.when defined above)
  'book.step.specialist': 'ကျွမ်းကျင်သူ ရွေးပါ',
  'book.step.date': 'ရက်စွဲ ရွေးပါ',
  'book.step.people': 'လူဦးရေ?',
  'book.step.payment': 'ဘယ်လို ပေးမည်နည်း?',
  'book.step.note': 'မှတ်ချက် (ထည့်လိုက)',
  'book.notePlaceholder': 'ဓာတ်မတည့်မှု၊ စိတ်ကြိုက်များ၊ ပါကင်...',
  'book.label.specialist': 'ကျွမ်းကျင်ပညာရှင်',
  'book.label.review': 'ပြန်လည် စိစစ်',
  'book.label.morning': 'နံနက်',
  'book.label.afternoon': 'နေ့လယ်',
  'book.label.evening': 'ညနေ',
  'book.label.pickDate': 'ရက်စွဲ ရွေး',
  'book.anyAvailable': 'အဆင်ပြေသူ မည်သူမဆို',

  // Write review
  'review.kicker.reviewing': 'သုံးသပ်ခြင်း',
  'review.kicker.rating': 'အဆင့်သတ်မှတ်ချက်',
  'review.kicker.highlights': 'အကြိုက်ဆုံးအချက်များ',
  'review.kicker.comment': 'မှတ်ချက်',
  'review.kicker.staff': 'ဆောင်ရွက်ပေးသူ? (ထည့်လိုက)',
  'review.kicker.title': 'သုံးသပ်ချက် ရေးမည်',
  'review.submit': 'သုံးသပ်ချက် တင်ရန်',
  'review.commentPlaceholder': 'အတွေ့အကြုံ မျှဝေပါ…',

  // Directions sheet
  'directions.kicker': 'လမ်းညွှန်',

  // Notifications
  'notifs.allCaughtUp.title': 'အားလုံး ပြီးပါပြီ',
  'notifs.allCaughtUp.sub': 'အကြောင်းကြားချက်အသစ် မရှိပါ။',

  // Category empty
  'category.empty.title': 'တိုက်ဆိုင်သော ဆိုင် မရှိပါ',
  'category.empty.sub': 'စစ်ထုတ်မှု သို့မဟုတ် မြို့ ပြောင်းကြည့်ပါ။',

  // Home sections
  'home.nearby.kicker': 'အနီးနား',
  'home.bookly.kicker': 'Bookly Pro ဝင်ရောက်ရန်',
  'home.featured.kicker': 'အထူးပြုထား',
  'home.cats.kicker': 'အမျိုးအစားများ',

  // Receipt
  'receipt.serviceFee': 'ဝန်ဆောင်ခ',
  'receipt.free': 'အခမဲ့',
  'home.nearby.places': '{city} ပတ်ဝန်းကျင်ရှိ နေရာ {count} ခု',
  'home.nearby.sub': 'မြေပုံပေါ်တွင် ဖွင့်ရန် နှိပ်ပါ · အကွာအဝေးအလိုက် စဉ်ထား',

  // Staff sheet
  'staff.years': 'အတွေ့အကြုံ {years} နှစ်',
  'staff.nextAvailable': 'နောက်အဆင်ပြေသော အချိန်',
  'staff.bookWith': '{name} နှင့် ဘွတ်ကင်တင်မည်',
  'staff.viewProfile': 'အပြည့်အစုံ ကြည့်ရန်',
  'staff.title': 'ကျွမ်းကျင်ပညာရှင်',
  'staff.about.title': 'သူတို့၏ စကားလုံးများဖြင့်',
  'staff.about.kicker': 'အကြောင်း',
  'staff.specialtiesKicker': 'ကျွမ်းကျင်ရာများ',
  'staff.knownFor': 'ကျွမ်းကျင်သော အရာများ',
  'staff.reviewsCount': 'သုံးသပ်ချက် · {count}',
  'staff.statRating': 'အဆင့်',
  'staff.statReviews': 'သုံးသပ်ချက်',
  'staff.statExperience': 'အတွေ့အကြုံ',
  'staff.noReviews': '{provider} ၏ စာမျက်နှာတွင် သုံးသပ်ချက်များ ကြည့်နိုင်ပါသည်။',

  // Receipt rows
  'receipt.service': 'ဝန်ဆောင်မှု',
  'receipt.with': 'ဖြင့်',
  'receipt.when': 'အချိန်',
  'receipt.people': 'လူဦးရေ',
  'receipt.payment': 'ငွေပေးချေမှု',
  'receipt.note': 'မှတ်ချက်',
  'receipt.anyAvailable': 'အဆင်ပြေသူ မည်သူမဆို',
  'minimap.tap': 'လမ်းညွှန် ကြည့်ရန် နှိပ်ပါ',

  // Studio (AI looks)
  'studio.title': 'စတူဒီယို',
  'studio.start.kicker': 'စတင်ရန်',
  'studio.start.title': 'အမျိုးအစား ရွေးပါ',
  'studio.saved.title': 'သိမ်းထားသော လုပ်ဖော်များ',
  'studio.history.kicker': 'မှတ်တမ်း',
  'studio.history.title': 'မကြာသေးမီက ဖန်တီးထား',
  'studio.compare.title': 'နှိုင်းယှဉ်',
  'studio.compare.sideBySide': 'ဘေးချင်းကပ်',
  'studio.compare.kicker': 'ဆုံးဖြတ်ချိန်',
  'studio.result.title': 'ရလဒ်',
  'studio.result.look': 'လုပ်ဖော်',
  'studio.result.bookKicker': 'ဤလုပ်ဖော်ကို ဘွတ်ကင်တင်ရန်',
  'studio.generate.style': 'ပုံစံ',
  'studio.generate.color': 'အရောင်',
  'studio.generate.results': 'ရလဒ်များ',

  // Search / Category sheets
  'sheet.sortBy': 'အလိုက် စဉ်',
  'sheet.city': 'မြို့',
  'sheet.category': 'အမျိုးအစား',

  // Booking flow extras
  'book.specialistsKicker': 'ကျွမ်းကျင်ပညာရှင်များ',

  // Home extras
  'home.byCategory': 'အမျိုးအစားအလိုက်',
  'home.weekKicker': 'ဤအပတ်',
  'home.weekTitle': 'အယ်ဒီတာ ရွေးချယ်မှု',
  'home.featured.title': 'ကြည့်သင့်သောအရာ',
  'home.popular.kicker': '{city} တွင် ရေပန်းစား',
  'home.popular.title': 'ဒေသခံများ ယုံကြည်',

  // Toasts
  'toast.callingProvider': 'ဆိုင်ကို ဖုန်းခေါ်နေသည်…',
  'toast.addressCopied': 'လိပ်စာ ကူးယူပြီး',
  'toast.couldNotCopy': 'ကူးယူ၍ မရပါ',
  'toast.bookFirstToReview': 'သုံးသပ်ချက် မရေးမီ ဘွတ်ကင်တင်ပါ',
  'toast.thanksReview': 'သုံးသပ်ချက် ပေးတဲ့အတွက် ကျေးဇူးတင်ပါတယ်',
  'toast.detectedYangon': 'ရှာတွေ့ - ရန်ကုန်',
  'toast.bookingRescheduled': 'ဘွတ်ကင် ပြောင်းပြီး',
  'toast.sharingTo': '{channel} သို့ မျှဝေနေ…',
  'toast.sharingSoon': 'မျှဝေခြင်း မကြာမီ',

  // Settings page kickers
  'settings.kicker.account': 'အကောင့်',
  'settings.kicker.preferences': 'ဦးစားပေးမှု',
  'settings.kicker.about': 'အကြောင်း',
  'settings.kicker.support': 'အကူအညီ',
  'settings.kicker.legal': 'ဥပဒေဆိုင်ရာ',

  // Studio hero
  'studio.hero.aiStudio': 'AI စတူဒီယို',
  'studio.hero.beta': 'Beta',
  'studio.hero.title1': 'ဘွတ်ကင်မတင်ခင်',
  'studio.hero.title2': 'အသွင်',
  'studio.hero.title3': 'စမ်းကြည့်ပါ',
  'studio.hero.sub': 'ဓာတ်ပုံပေါ်တွင် ပုံစံများ ဖန်တီး၊ ဘေးချင်းကပ် နှိုင်းယှဉ်ပြီး စိတ်ကြိုက်ဆိုင်ကို ဘွတ်ကင်တင်ပါ။',

  // Home Bookly Pro promo
  'home.pro.title': 'ဦးစားပေး အချိန်များ၊ အသင်းဝင်ဈေးနှုန်း။',
  'home.pro.sub': 'ဆိုင်တော်များမှ ပိုက်ပူဆာရန် မလို၊ ၂၀% အထိ လျှော့ရရှိ။',
  'home.pro.cta': 'ပိုမို လေ့လာရန်',
  'home.featured.seeAll': 'အားလုံးကြည့်',
  'home.cats.all': 'အားလုံး',

  // Studio generate
  'studio.generate.cta': 'အပြောင်းအလဲ ၄ မျိုး ဖန်တီးမည်',
  'studio.generate.poweredBy': 'Bookly Studio · ဖုန်းပေါ်တွင် လုပ်ဆောင်',
  'studio.generate.generating': 'အပြောင်းအလဲ ၄ မျိုး ဖန်တီးနေ…',
  'studio.generate.generatingSub': 'ပုံစံ၊ အရောင်၊ အသွေး ချိန်ညှိနေ…',

  // Provider gallery
  'provider.gallery.kicker': 'အလုပ်များ',
  'provider.gallery.title': 'ဆိုင်မှ မှတ်တမ်းများ',

  // Help & Terms body
  'help.faqSub': 'အမေးများသော မေးခွန်းများ',
  'help.reportSub': 'ပြဿနာကို ပြောပြပါ',
  'terms.p1': 'Bookly ကို အသုံးပြုခြင်းဖြင့် ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှု စည်းကမ်းချက်များနှင့် ကိုယ်ရေးကိုယ်တာ မူဝါဒကို သဘောတူပါသည်။',
  'terms.p2': 'ဘွတ်ကင်များကို အခမဲ့ ထိန်းသိမ်းပါသည်။ ဖော်ပြထားခြင်း မရှိပါက ဆိုင်တွင်ပင် ငွေပေးချေရပါမည်။ သတ်မှတ်ထားသော အချိန် ၂ နာရီအလို ဘွတ်ကင်တိုင်းကို အခမဲ့ ပယ်ဖျက်နိုင်ပါသည်။ ထပ်ခါထပ်ခါ နောက်ကျ ပယ်ဖျက်ပါက အကောင့်အပေါ် သက်ရောက်နိုင်ပါသည်။',
  'terms.p3.intro': 'ဘွတ်ကင်ပြုလုပ်ရန် လိုအပ်သော ကိုယ်ရေးအချက်အလက်ကိုသာ စုဆောင်းပါသည်။ သင်၏ အချက်အလက်များကို ရောင်းချခြင်း မရှိပါ။ အပြည့်အစုံကို',
  'terms.p3.url': 'bookly.mm/privacy',

  'me.editProfile': 'ပရိုဖိုင်ပြင်ရန်',
  'me.section.activity': 'လှုပ်ရှားမှု',
  'me.section.preferences': 'ဆက်တင်များ',
  'me.section.account': 'အကောင့်',
  'me.section.helpAbout': 'အကူအညီ',
  'me.bookings': 'ကျွန်ုပ်၏ ဘွတ်ကင်များ',
  'me.favorites': 'သိမ်းထားသော ဆိုင်များ',
  'me.notifications': 'အကြောင်းကြားချက်',
  'me.language': 'ဘာသာစကား',
  'me.appearance': 'အသွင်အပြင်',
  'me.help': 'အကူအညီ',
  'me.terms': 'စည်းမျဉ်း',
  'me.about': 'Bookly အကြောင်း',
  'me.logout': 'ထွက်မည်',

  'language.title': 'ဘာသာစကား',
  'language.app': 'အက်ပ် ဘာသာစကား',
  'language.note': 'ပြောင်းလဲမှု ချက်ချင်း ထိရောက်ပါသည်။',
  'appearance.title': 'အသွင်အပြင်',
  'appearance.system': 'စနစ်အလိုက်',
  'appearance.dark': 'အမှောင်',
  'appearance.light': 'အလင်း',
  'notifications.title': 'အကြောင်းကြားချက်',
  'notifications.push': 'Push အကြောင်းကြားချက်',
  'notifications.push.sub': 'ဘွတ်ကင် အပ်ဒိတ်နှင့် သတိပေးချက်',
  'notifications.email': 'အီးမေးလ် ပြေစာ',
  'notifications.email.sub': 'အတည်ပြုချက်နှင့် မှတ်တမ်း',
  'notifications.promos': 'ပရိုမိုးရှင်း',
  'notifications.promos.sub': 'အထူးကမ်းလှမ်းချက်များ',
  'about.title': 'အကြောင်း',
  'about.version': 'ဗားရှင်း ၁.၀.၀',
  'about.tagline': 'Bookly · မြန်မာနိုင်ငံအတွင်း ယုံကြည်စိတ်ချရတဲ့ ဝန်ဆောင်မှုများ ဘွတ်ကင်လုပ်ပါ',
  'help.title': 'အကူအညီ',
  'help.contact': 'ပံ့ပိုးသူကို ဆက်သွယ်ရန်',
  'help.faq': 'အမေးများ',
  'help.report': 'ပြဿနာ တင်ပြရန်',
  'terms.title': 'စည်းမျဉ်းနှင့် ကိုယ်ရေး',

  'profile.title': 'ပရိုဖိုင်ပြင်ရန်',
  'profile.name': 'အမည်',
  'profile.phone': 'ဖုန်း',
  'profile.email': 'အီးမေးလ်',
  'profile.city': 'မြို့',
  'profile.save': 'သိမ်းမည်',
  'profile.saved': 'ပရိုဖိုင် အပ်ဒိတ်လုပ်ပြီး',

  'toast.bookingConfirmed': 'ဘွတ်ကင် အတည်ပြုပြီးပါပြီ',
  'toast.bookingCancelled': 'ဘွတ်ကင် ပယ်ဖျက်ပြီး',
  'toast.saved': 'သိမ်းပြီးပြီ',
  'toast.removed': 'ဖျက်ပြီးပါပြီ',
  'common.cancel': 'ပယ်ဖျက်',
  'common.back': 'နောက်သို့',
  'common.continue': 'ဆက်လုပ်မည်',
  'common.confirm': 'အတည်ပြု',
  'common.close': 'ပိတ်မည်',
}

const dicts: Record<Lang, Dict> = { en, my }

let currentLang: Lang = 'en'
const subscribers = new Set<(l: Lang) => void>()

function readStored(): Lang {
  if (typeof window === 'undefined') return 'en'
  const v = localStorage.getItem(KEY) as Lang | null
  return v === 'en' || v === 'my' ? v : 'en'
}

currentLang = readStored()

export function useLang() {
  const [lang, setLangState] = useState<Lang>(currentLang)

  useEffect(() => {
    const onChange = (l: Lang) => setLangState(l)
    subscribers.add(onChange)
    return () => { subscribers.delete(onChange) }
  }, [])

  const setLang = (next: Lang) => {
    currentLang = next
    if (typeof window !== 'undefined') localStorage.setItem(KEY, next)
    subscribers.forEach((fn) => fn(next))
  }

  return { lang, setLang }
}

export function useT() {
  const { lang } = useLang()
  return (key: string, vars?: Record<string, string | number>): string => {
    const dict = dicts[lang] ?? en
    const raw = dict[key] ?? en[key] ?? key
    if (!vars) return raw
    return Object.keys(vars).reduce(
      (s, k) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k])),
      raw,
    )
  }
}
