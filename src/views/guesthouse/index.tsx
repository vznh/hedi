// views/guesthouse/index

// I find that the people in my life
// come and go. They come due to either of
// our faults, but not one bitter thing has
// persisted through our fragmentation.
// I only remember the lessons that I've learned
// from them, and reflect positively on the
// lessons that they've integrated within me.

// I attribute my success, drive, and perspective
// towards those who have interacted with me,
// from minimal interactions to long-lived
// relationships.

import Guestboard from "@/components/Guestboard"

export const GuesthouseView = () => {
  return <div className="relative w-full h-screen">
    <div className="absolute top-8 left-8 p-8 z-10 max-w-md bg-opacity-80 rounded-md bg-white">
      <h1 className="font-holla text-4xl font-bold text-black mb-2">GUESTBOARD</h1>
      <p className="font-favorit text-black">
        Share where you&apos;re from. Allow this website to track your geolocation and place a note on the board anywhere. <br /><br />Notes may take a moment to load. You can only place one.<br />
      </p>
    </div>

    <div className="w-full h-full">
      <Guestboard />
    </div>
  </div>
}
