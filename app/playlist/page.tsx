// app/playlist/page.tsx

export default function Playlist() {
  return (
    <main className="bg-[#202020] text-white min-h-screen flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900 text-white w-full">
        <h1 className="text-4xl font-bold mb-4">
          Discover Your Next Favorite Song
        </h1>
        <p className="text-lg mb-6 max-w-3xl mx-auto">
          Explore personalized music recommendations, curated playlists, and
          trending hits. Let us help you discover new tunes that match your
          vibe.
        </p>
        <a
          href="#explore"
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 transition-colors"
        >
          Start Exploring
        </a>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 w-full max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-gray-700">
            <h3 className="text-xl font-semibold mb-3">
              Personalized Playlists
            </h3>
            <p>
              Get music recommendations tailored to your taste. Whether you're
              into indie, pop, or hip-hop, we’ve got the perfect playlist for
              you.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-gray-700">
            <h3 className="text-xl font-semibold mb-3">Trending Music</h3>
            <p>
              Stay updated with the latest hits and viral tracks. Discover
              what's popular in your country and worldwide.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 text-gray-700">
            <h3 className="text-xl font-semibold mb-3">Explore by Genre</h3>
            <p>
              Browse music by your favorite genres and find new artists to love.
              From jazz to electronic, we’ve got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Playlist Section */}
      <section
        id="explore"
        className="py-16 px-6 w-full bg-gray-900 text-center"
      >
        <h2 className="text-3xl font-semibold mb-8 text-white">
          Featured Playlists
        </h2>
        <div className="flex justify-center space-x-8">
          <div className="bg-white shadow-lg rounded-lg w-60 p-6 text-gray-700">
            <h3 className="text-xl font-semibold mb-3">Summer Vibes</h3>
            <p>Chill beats and sunny tracks to vibe with this summer.</p>
            <a
              href="/playlist/summer"
              className="text-green-500 hover:text-green-600 transition-colors"
            >
              Listen Now
            </a>
          </div>
          <div className="bg-white shadow-lg rounded-lg w-60 p-6 text-gray-700">
            <h3 className="text-xl font-semibold mb-3">Indie Discoveries</h3>
            <p>Fresh indie tracks for the adventurous music lover.</p>
            <a
              href="/playlist/indie"
              className="text-green-500 hover:text-green-600 transition-colors"
            >
              Listen Now
            </a>
          </div>
          <div className="bg-white shadow-lg rounded-lg w-60 p-6 text-gray-700">
            <h3 className="text-xl font-semibold mb-3">Workout Motivation</h3>
            <p>Upbeat and energizing tracks to fuel your workout.</p>
            <a
              href="/playlist/workout"
              className="text-green-500 hover:text-green-600 transition-colors"
            >
              Listen Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
