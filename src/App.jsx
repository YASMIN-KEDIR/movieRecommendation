import { useEffect, useState} from 'react'
import Search from './component/Search'
import Spinner from './component/Spinner'
import MOvieCard from './component/MovieCard'
import MovieModal from './component/MovieModal.jsx'
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import { useDebounce } from "react-use";
import "./App.css";


const API_BASE_URL='https://api.themoviedb.org/3'
const API_KEY=import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS ={
  method: 'GET',
  headers:{
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {
  const [searchTerm, setSearchTerm] =useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList,setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState ('') 
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


 useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try{
const endPoint = query
?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
:`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

const response = await fetch(endPoint, API_OPTIONS);
   if(!response.ok){throw new Error('Failed to fetch movies');
   }

    const data = await response.json();
    
if (!data.results || data.results.length === 0) {
  setErrorMessage("No movies found");
  setMovieList([]);
  return;
}
setMovieList(data.results || []);



 if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

 } catch(error){
      console.error('Error fetching movies:', {error});
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally{
      setIsLoading(false);
    }

}


  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error.message);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    document.body.style.overflow = "auto";
  };

useEffect(() => {
  fetchMovies (debouncedSearchTerm);
}, [debouncedSearchTerm]);

useEffect(() => {
    loadTrendingMovies();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper"> 
 <header>
    <img src="./logo.png" className="logo" alt="Logo" />
  <img src="./hero.png" alt="Hero-banner" />
  <h1  className=" text-4xl font-bold text-white">Find <span className="text-gradient"> movies</span> you'll Enjoy Without The Hassel</h1>
   <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
 </header>
     {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className=" text-white">Trendings</h2>
            <ul  className="trending-list">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    onClick={() => handleMovieClick(movie)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}



 <section className="all-movies">
 <h2 className="text-2xl mt-20 font-semibold text-white mb-4">All Movies</h2>
  
  {isLoading ? (
  <Spinner/>
 ) : errorMessage ?(
  <p className="text-red-5000">{errorMessage}</p>
 ) : (
  <ul>
    {movieList.map((movie) => (
     <MOvieCard key={movie.id} movie={movie} />
    ))}
  </ul>
 )}
 </section>

      </div>

 {isModalOpen && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

      
    </main>
  )
}

export default App
