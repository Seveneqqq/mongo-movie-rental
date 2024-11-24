import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Card } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Released = ({ isLightTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  const formatGenre = (genre_ids) => {
    const genreMap = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };

    return genre_ids.map(id => genreMap[id] || 'Unknown').join(', ');
  };

  const fetchUpcomingMovies = async () => {
    try {
      const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      
      const formattedMovies = data.results.map(movie => ({
        title: movie.title,
        genre: formatGenre(movie.genre_ids),
        description: movie.overview,
        rating: movie.vote_average,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default-movie.jpg',
        releaseDate: movie.release_date,
        addedDate: new Date(),
        rentedNow: false
      }));

      setMovies(formattedMovies);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Header
        isLightTheme={isLightTheme}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      
      <div className="container mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
          Upcoming Movies
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <Card 
              key={index}
              className="flex flex-col overflow-hidden bg-card hover:shadow-lg transition-shadow dark:bg-gray-800/40 cursor-pointer"
              onClick={() => setSelectedMovie(movie)}
            >
              <div className="relative pt-[150%] w-full">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `./backend/uploads/default-movie.jpg`;
                  }}
                />
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg md:text-xl font-semibold line-clamp-1 mb-1">
                  {movie.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {movie.genre} • Release: {new Date(movie.releaseDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {movie.description}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Rating: {movie.rating}/10
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
          {selectedMovie && (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-bold break-words">
                  {selectedMovie.title}
                </DialogTitle>
                <DialogDescription className="text-base md:text-lg text-muted-foreground">
                  {selectedMovie.genre} • Release: {new Date(selectedMovie.releaseDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 mt-4">
                <div className="w-full">
                  <div className="relative pt-[150%] w-full">
                    <img
                      src={selectedMovie.image}
                      alt={selectedMovie.title}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = `./backend/uploads/default-movie.jpg`;
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg">Description</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {selectedMovie.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">Rating</h3>
                      <p className="text-muted-foreground">{selectedMovie.rating}/10</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default Released;