import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US&append_to_response=release_dates,credits`
        );
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movie && movie.id) {
      fetchMovieDetails();
    }
  }, [movie]);



  const getCertification = () => {
    if (!movieDetails?.release_dates?.results) return "PG-13";
    const usRelease = movieDetails.release_dates.results.find(
      (r) => r.iso_3166_1 === "US"
    );
    return usRelease?.release_dates[0]?.certification || "PG-19";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 text-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 text-gray-300">
                  <span>{movie.release_date?.split("-")[0] || "2024"}</span>
                  <span>•</span>
                  <span>{getCertification()}</span>
                  <span>•</span>
                 
                </div>
              </div>

              {/* Banner Section */}
              {movieDetails.tagline && (
                <div className="bg-red-600 text-white px-4 py-2 rounded mb-8 text-center font-medium">
                  {movieDetails.tagline.toUpperCase()}
                </div>
              )}

              {/* Two Column Layout */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Poster */}
                <div className="w-full lg:w-1/3">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/no-movie.png"
                    }
                    alt={movie.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                {/* Right Column - Details */}
                <div className="flex-1">
                  {/* Overview */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                    <p className="text-gray-300">{movie.overview}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Release Info */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Release Info</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li>
                          <strong>Release Date:</strong> {movie.release_date}
                        </li>
                       
                        <li>
                          <strong>Original Language:</strong>{" "}
                          {movie.original_language?.toUpperCase()}
                        </li>
                      </ul>
                    </div>

        


                  
                  </div>

                  
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;