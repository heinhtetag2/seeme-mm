import { useState } from 'react'
import { SquarePen } from 'lucide-react'
import { PhoneFrame } from './components/PhoneFrame'
import { BottomNav } from './components/BottomNav'
import { TopBar } from './components/TopBar'
import { ToastProvider } from './components/Toast'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { AuthFlow, type AuthProfile } from './screens/AuthScreens'
import { HomeScreen } from './screens/HomeScreen'
import { ExploreScreen } from './screens/ExploreScreen'
import { MyBookingsScreen } from './screens/MyBookingsScreen'
import { MeScreen } from './screens/MeScreen'
import { CategoryScreen } from './screens/CategoryScreen'
import { ProviderScreen } from './screens/ProviderScreen'
import { StaffProfileScreen } from './screens/StaffProfileScreen'
import { WriteReviewScreen } from './screens/WriteReviewScreen'
import { BookFlowScreen } from './screens/BookFlowScreen'
import { BookReviewScreen } from './screens/BookReviewScreen'
import { BookSuccessScreen } from './screens/BookSuccessScreen'
import { BookingDetailScreen } from './screens/BookingDetailScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'
import { CityPickerScreen } from './screens/CityPickerScreen'
import { SearchScreen } from './screens/SearchScreen'
import { StudioScreen } from './screens/StudioScreen'
import { StudioGenerateScreen } from './screens/StudioGenerateScreen'
import { StudioCompareScreen } from './screens/StudioCompareScreen'
import { StudioResultScreen } from './screens/StudioResultScreen'
import {
  EditProfileScreen, LanguageScreen, AppearanceScreen, NotifPrefsScreen,
  AboutScreen, HelpScreen, TermsScreen, AccountSettingsScreen, AccountChangeScreen,
} from './screens/SettingsScreens'
import { SavedScreen } from './screens/SavedScreen'
import { CommunityScreen } from './screens/CommunityScreen'
import { PostDetailScreen } from './screens/PostDetailScreen'
import { ComposePostScreen } from './screens/ComposePostScreen'
import { CommunitySearchScreen } from './screens/CommunitySearchScreen'
import { useTheme } from './theme'
import { me, REVIEWS_SEED, type CategoryId, type Review } from './data'
import { POSTS_SEED, type Post, type Comment } from './community'
import type { Tab, View } from './nav'
import type { Booking } from './data'
import type { GeneratedLook } from './studio'

export default function App() {
  useTheme()
  const [tab, setTab] = useState<Tab>('home')
  const [stack, setStack] = useState<View[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [onboarded, setOnboarded] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [profile, setProfile] = useState<AuthProfile>({ name: me.name, city: me.city, phone: me.phone })
  const [city, setCity] = useState<string>(me.city)
  const [exploreMode, setExploreMode] = useState<'list' | 'map'>('list')
  /** Pre-applied category filter when Explore is opened. Lifted so a tap on a
   *  Home category tile can switch tabs with the filter already set. */
  const [exploreCategory, setExploreCategory] = useState<'all' | CategoryId>('all')
  /** All reviews — seeded + user-authored ones from this session. */
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_SEED)
  /** Reviews the current user has marked helpful. */
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set())

  const addReview = (r: Review) => setReviews((prev) => [r, ...prev])
  const toggleHelpful = (id: string) =>
    setHelpfulIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  /** Community posts — seeded + ones the user wrote this session. */
  const [posts, setPosts] = useState<Post[]>(POSTS_SEED)
  /** Posts the current user has marked helpful. */
  const [postHelpful, setPostHelpful] = useState<Set<string>>(new Set())

  const addPost = (p: Post) => setPosts((prev) => [p, ...prev])
  const togglePostHelpful = (id: string) =>
    setPostHelpful((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  const addComment = (postId: string, body: string, parentCommentId?: string) => {
    const author = {
      id: profile.email ?? me.email,
      name: profile.name,
      initial: profile.name[0] ?? me.name[0],
      verifiedVisitor: true,
      city: profile.city,
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        if (parentCommentId) {
          return {
            ...p,
            comments: p.comments.map((c) =>
              c.id === parentCommentId
                ? {
                    ...c,
                    replies: [
                      ...(c.replies ?? []),
                      { id: `r-new-${Date.now()}`, author, body, when: 'just now', helpful: 0 },
                    ],
                  }
                : c,
            ),
          }
        }
        return {
          ...p,
          comments: [
            { id: `cm-new-${Date.now()}`, author, body, when: 'just now', helpful: 0 },
            ...p.comments,
          ],
        }
      }),
    )
  }

  /** All looks generated across the session, newest first. */
  const [recentLooks, setRecentLooks] = useState<GeneratedLook[]>([])
  /** Subset of recentLooks the user has hearted. */
  const [savedLookIds, setSavedLookIds] = useState<Set<string>>(new Set())

  const pushRecent = (looks: GeneratedLook[]) =>
    setRecentLooks((prev) => [...looks, ...prev].slice(0, 40))
  const saveLook = (l: GeneratedLook) => {
    // Make sure the look is in the recent list so result screens can find it.
    setRecentLooks((prev) => prev.some((x) => x.id === l.id) ? prev : [l, ...prev])
    setSavedLookIds((prev) => new Set(prev).add(l.id))
  }
  const unsaveLook = (id: string) =>
    setSavedLookIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  const savedLooks = recentLooks.filter((l) => savedLookIds.has(l.id))

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const current = stack[stack.length - 1]
  const inSubScreen = !!current
  const showShell = !inSubScreen
  // Explore is a map-first screen; hide the global TopBar + radial glow there
  // so the floating search and bottom sheet have room to breathe.
  const showTopBar = showShell && tab !== 'explore'

  const go = (v: View) => setStack((s) => [...s, v])
  const back = () => setStack((s) => s.slice(0, -1))
  const goTab = (t: Tab) => { setStack([]); setTab(t) }
  const addBooking = (b: Booking) => setBookings((prev) => [b, ...prev])
  const cancelBooking = (id: string) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)))

  const handleLogout = () => {
    setStack([])
    setTab('home')
    setBookings([])
    setFavorites(new Set())
    setRecentLooks([])
    setSavedLookIds(new Set())
    setReviews(REVIEWS_SEED)
    setHelpfulIds(new Set())
    // Land on the auth choice screen — keep onboarding completed so the user
    // doesn't have to walk through it again after a sign-out.
    setAuthed(false)
  }

  if (!onboarded) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-canvas overflow-auto">
        <PhoneFrame>
          <OnboardingScreen onDone={() => setOnboarded(true)} />
        </PhoneFrame>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-canvas overflow-auto">
        <PhoneFrame>
          <AuthFlow
            onAuthed={(p) => {
              setProfile(p)
              setCity(p.city)
              setAuthed(true)
            }}
          />
        </PhoneFrame>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-canvas overflow-auto">
      <PhoneFrame>
        <ToastProvider>
          <div className="relative h-full w-full bg-canvas flex flex-col overflow-hidden">
            {showTopBar && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-glow-radial" />
            )}

            {showTopBar && (
              <TopBar
                city={city}
                name={profile.name}
                avatar={profile.avatar}
                onCityClick={() => go({ kind: 'city-picker' })}
                onBellClick={() => go({ kind: 'notifications' })}
              />
            )}

            <main className={`relative flex-1 overflow-y-auto scrollbar-hide ${tab === 'explore' && !inSubScreen ? '' : 'pb-28'}`}>
              {!inSubScreen && tab === 'home' && (
                <HomeScreen
                  go={go}
                  setTab={goTab}
                  city={city}
                  firstName={profile.name}
                  onNearby={() => { setExploreMode('map'); goTab('explore') }}
                  onPickCategory={(catId) => {
                    setExploreCategory(catId)
                    setExploreMode('list')
                    goTab('explore')
                  }}
                />
              )}
              {!inSubScreen && tab === 'explore' && (
                <ExploreScreen
                  city={city}
                  mode={exploreMode}
                  setMode={setExploreMode}
                  category={exploreCategory}
                  setCategory={setExploreCategory}
                  go={go}
                />
              )}
              {!inSubScreen && tab === 'community' && (
                <CommunityScreen
                  posts={posts}
                  helpfulIds={postHelpful}
                  onToggleHelpful={togglePostHelpful}
                  go={go}
                />
              )}
              {!inSubScreen && tab === 'studio' && (
                <StudioScreen saved={savedLooks} recent={recentLooks} go={go} />
              )}
              {!inSubScreen && tab === 'bookings' && (
                <MyBookingsScreen bookings={bookings} go={go} setTab={goTab} />
              )}
              {!inSubScreen && tab === 'me' && (
                <MeScreen
                  profile={profile}
                  go={go}
                  setTab={goTab}
                  savedCount={favorites.size}
                  bookingsCount={bookings.length}
                  onLogout={handleLogout}
                />
              )}
            </main>

            {/* Sub-screens */}
            {current?.kind === 'category' && (
              <CategoryScreen categoryId={current.categoryId} onBack={back} go={go} />
            )}
            {current?.kind === 'provider' && (
              <ProviderScreen
                providerId={current.providerId}
                onBack={back}
                go={go}
                isFavorite={favorites.has(current.providerId)}
                onToggleFavorite={() => toggleFavorite(current.providerId)}
                bookings={bookings}
                reviews={reviews}
                helpfulIds={helpfulIds}
                onToggleHelpful={toggleHelpful}
              />
            )}
            {current?.kind === 'staff' && (
              <StaffProfileScreen
                staffId={current.staffId}
                reviews={reviews}
                helpfulIds={helpfulIds}
                onToggleHelpful={toggleHelpful}
                onBack={back}
                go={go}
              />
            )}
            {current?.kind === 'write-review' && (
              <WriteReviewScreen
                providerId={current.providerId}
                initialStaffId={current.staffId}
                authorName={profile.name}
                onBack={back}
                onSubmit={addReview}
              />
            )}
            {current?.kind === 'book' && (
              <BookFlowScreen
                providerId={current.providerId}
                initialServiceId={current.serviceId}
                initialStaffId={current.staffId}
                initialDate={current.initialDate}
                initialTime={current.initialTime}
                initialParty={current.initialParty}
                initialPayment={current.initialPayment}
                initialNote={current.initialNote}
                rescheduleOf={current.rescheduleOf}
                lookId={current.lookId}
                lookLookup={(id) => recentLooks.find((l) => l.id === id) ?? null}
                onBack={back}
                go={go}
              />
            )}
            {current?.kind === 'book-review' && (
              <BookReviewScreen
                providerId={current.providerId}
                serviceId={current.serviceId}
                staffId={current.staffId}
                payment={current.payment}
                date={current.date}
                time={current.time}
                party={current.party}
                note={current.note}
                lookId={current.lookId}
                lookLookup={(id) => recentLooks.find((l) => l.id === id) ?? null}
                onBack={back}
                go={go}
                addBooking={addBooking}
                rescheduleOf={current.rescheduleOf}
                cancelBooking={cancelBooking}
              />
            )}
            {current?.kind === 'book-success' && (
              <BookSuccessScreen
                bookingId={current.bookingId}
                go={(v) => { setStack([v]) }}
                onDone={() => { setStack([]); setTab('bookings') }}
              />
            )}
            {current?.kind === 'booking-detail' && (
              <BookingDetailScreen
                bookingId={current.bookingId}
                onBack={back}
                go={go}
                bookings={bookings}
                cancelBooking={cancelBooking}
                lookLookup={(id) => recentLooks.find((l) => l.id === id) ?? null}
              />
            )}
            {current?.kind === 'city-picker' && (
              <CityPickerScreen current={city} onPick={setCity} onBack={back} />
            )}
            {current?.kind === 'search' && (
              <SearchScreen
                onBack={back}
                go={go}
                city={city}
                onMap={() => { setExploreMode('map'); setStack([]); setTab('explore') }}
              />
            )}
            {current?.kind === 'studio-generate' && (
              <StudioGenerateScreen
                look={current.look}
                onBack={back}
                go={go}
                savedIds={savedLookIds}
                saveLook={saveLook}
                unsaveLook={unsaveLook}
                pushRecent={pushRecent}
              />
            )}
            {current?.kind === 'studio-compare' && (
              <StudioCompareScreen
                lookIds={current.lookIds}
                allLooks={recentLooks}
                savedIds={savedLookIds}
                saveLook={saveLook}
                unsaveLook={unsaveLook}
                onBack={back}
                go={go}
              />
            )}
            {current?.kind === 'studio-result' && (
              <StudioResultScreen
                lookId={current.lookId}
                allLooks={recentLooks}
                savedIds={savedLookIds}
                saveLook={saveLook}
                unsaveLook={unsaveLook}
                onBack={back}
                go={go}
              />
            )}
            {current?.kind === 'edit-profile' && (
              <EditProfileScreen
                profile={profile}
                onSave={(p) => { setProfile(p); setCity(p.city) }}
                onBack={back}
              />
            )}
            {current?.kind === 'account-settings' && (
              <AccountSettingsScreen
                profile={profile}
                onSignOut={handleLogout}
                onChange={(field) => go({ kind: 'account-change', field })}
                onBack={back}
              />
            )}
            {current?.kind === 'account-change' && (
              <AccountChangeScreen
                field={current.field}
                profile={profile}
                onBack={back}
              />
            )}
            {current?.kind === 'language' && <LanguageScreen onBack={back} />}
            {current?.kind === 'appearance' && <AppearanceScreen onBack={back} />}
            {current?.kind === 'notifications' && <NotificationsScreen onBack={back} go={go} />}
            {current?.kind === 'notif-prefs' && <NotifPrefsScreen onBack={back} />}
            {current?.kind === 'about' && <AboutScreen onBack={back} />}
            {current?.kind === 'help' && <HelpScreen onBack={back} />}
            {current?.kind === 'terms' && <TermsScreen onBack={back} />}
            {current?.kind === 'saved' && <SavedScreen favorites={favorites} onBack={back} go={go} />}
            {current?.kind === 'community-post' && (
              <PostDetailScreen
                postId={current.postId}
                posts={posts}
                helpfulIds={postHelpful}
                onToggleHelpful={togglePostHelpful}
                onAddComment={addComment}
                onBack={back}
                go={go}
              />
            )}
            {current?.kind === 'community-compose' && (
              <ComposePostScreen
                initialProviderId={current.providerId}
                initialTopic={current.topic}
                onBack={back}
                onSubmit={addPost}
              />
            )}
            {current?.kind === 'community-search' && (
              <CommunitySearchScreen
                posts={posts}
                helpfulIds={postHelpful}
                onToggleHelpful={togglePostHelpful}
                onBack={back}
                go={go}
              />
            )}

            {showShell && tab === 'community' && (
              <button
                onClick={() => go({ kind: 'community-compose' })}
                aria-label="New post"
                className="absolute bottom-[104px] right-5 z-[35] h-12 w-12 grid place-items-center rounded-full bg-brand text-white shadow-[0_2px_6px_-1px_rgba(0,0,0,0.18),0_12px_32px_-8px_rgba(0,0,0,0.28)] active:scale-95 transition"
              >
                <SquarePen size={16} strokeWidth={2} />
              </button>
            )}

            {showShell && <BottomNav active={tab} onChange={goTab} />}
          </div>
        </ToastProvider>
      </PhoneFrame>
    </div>
  )
}
