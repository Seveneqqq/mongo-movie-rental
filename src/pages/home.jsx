import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Home = ({ isLightTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movie/get');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleRent = async (movieId, e) => {

    console.log(`Movie ${movieId}`);

    if (e) {
      console.log('wchodzi');
      e.stopPropagation();
    }
    
    try {
      console.log('wchodzi 2');
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        return;
      }

      const response = await fetch('http://localhost:5000/api/movie/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movieId,
          userId
        })
      });

      const data = await response.json();

      if (data.success) {
        await fetchMovies();
        setSelectedMovie(null);
      }
    } catch (error) {
      console.error('Error renting movie:', error);
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Available Movies</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {movies.map((movie) => (
            <Card 
              key={movie._id} 
              className="flex flex-col overflow-hidden bg-card hover:shadow-lg transition-shadow dark:bg-gray-800/40 cursor-pointer"
              onClick={() => handleMovieClick(movie)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative pt-[150%] w-full">
                      <img
                        src={`./backend/uploads/${movie.image}`}
                        alt={movie.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `./backend/uploads/default-movie.jpg`;
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{movie.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg md:text-xl font-semibold line-clamp-1 mb-1">{movie.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {movie.genre} • {movie.duration} min
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {movie.description}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">
                      Rating: {movie.rating}/10
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Dir. {movie.director}
                    </span>
                  </div>
                  {movie.rentedNow ? (
                    <Button variant="secondary" disabled className="w-full">
                      Currently Rented
                    </Button>
                  ) : isLoggedIn ? (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={(e) => handleRent(movie._id, e)}
                    >
                      Rent Movie
                    </Button>
                  ) : (
                    <Button variant="default" className="w-full">
                      Login to Rent
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {movies.length === 0 && (
          <div className="text-center py-8 md:py-10">
            <p className="text-lg md:text-xl text-muted-foreground">
              No movies available at the moment.
            </p>
          </div>
        )}

        <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
          {selectedMovie && (
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl md:text-2xl font-bold break-words">
                  {selectedMovie.title}
                </DialogTitle>
                <DialogDescription className="text-base md:text-lg text-muted-foreground">
                  {selectedMovie.genre} • {selectedMovie.duration} minutes
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 mt-4">
                <div className="w-full">
                  <div className="relative pt-[150%] w-full">
                    <img
                      src={`./backend/uploads/${selectedMovie.image}`}
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
                    <div className="flex flex-wrap gap-2 md:hidden">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        selectedMovie.rentedNow 
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {selectedMovie.rentedNow ? 'Currently Rented' : 'Available'}
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        Rating: {selectedMovie.rating}/10
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base md:text-lg">Description</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {selectedMovie.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base md:text-lg">Director</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {selectedMovie.director}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base md:text-lg">Cast</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.actors.map((actor, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                          >
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="hidden md:block space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">Rating</h3>
                        <p className="text-muted-foreground">{selectedMovie.rating}/10</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Status</h3>
                        <p className="text-muted-foreground">
                          {selectedMovie.rentedNow ? 'Currently Rented' : 'Available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 sticky bottom-0 bg-background/80 backdrop-blur-sm py-4 -mx-4 px-4 md:static md:bg-transparent md:backdrop-blur-none md:p-0">
                    {selectedMovie.rentedNow ? (
                      <Button variant="secondary" disabled className="w-full">
                        Currently Rented
                      </Button>
                    ) : isLoggedIn ? (
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => handleRent(selectedMovie._id)}
                      >
                        Rent Movie
                      </Button>
                    ) : (
                      <Button variant="default" className="w-full">
                        Login to Rent
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>

      <footer className="container mx-auto px-4 py-6 md:py-8 text-center">
        <p className="text-muted-foreground">Movie rental with best movies</p>
      </footer>
    </>
  );
};

export default Home;