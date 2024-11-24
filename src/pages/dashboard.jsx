import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Dashboard = ({ isLightTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
  const [rentalHistory, setRentalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin states
  const [users, setUsers] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMovieToEdit, setSelectedMovieToEdit] = useState(null);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  const [editedMovieData, setEditedMovieData] = useState({});
  const [newMovieData, setNewMovieData] = useState({
    title: '',
    genre: '',
    director: '',
    duration: '',
    rating: '',
    description: '',
    actors: [],
    image: 'default-movie.jpg'
  });

  useEffect(() => {
    fetchRentalHistory();
    if (sessionStorage.getItem('role') === 'admin') {
      fetchUsers();
      fetchAllMovies();
    }
  }, []);

  const fetchRentalHistory = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/api/rent-history/get/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rental history');
      }
      const data = await response.json();
      setRentalHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/get');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movie/get');
      const data = await response.json();
      setAllMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleUserEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/edit/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUserData)
      });

      if (response.ok) {
        await fetchUsers();
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleMovieAdd = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movie/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newMovieData,
          actors: newMovieData.actors.split(',').map(actor => actor.trim()) // Convert string to array
        })
      });

      if (response.ok) {
        await fetchAllMovies();
        setShowAddMovie(false);
        setNewMovieData({
          title: '',
          genre: '',
          director: '',
          duration: '',
          rating: '',
          description: '',
          actors: [],
          image: 'default-movie.jpg'
        });
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleMovieEdit = async () => {
    try {
      const movieToUpdate = {
        ...editedMovieData,
        actors: typeof editedMovieData.actors === 'string' 
          ? editedMovieData.actors.split(',').map(actor => actor.trim())
          : editedMovieData.actors
      };

      const response = await fetch(`http://localhost:5000/api/movie/edit/${selectedMovieToEdit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieToUpdate)
      });

      if (response.ok) {
        await fetchAllMovies();
        setSelectedMovieToEdit(null);
      }
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  const handleMovieDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/movie/delete/${movieId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchAllMovies();
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/delete/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
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
        {/* User section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {rentalHistory?.user.firstName}!</h1>
          <p className="text-muted-foreground">{rentalHistory?.user.email}</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rentalHistory?.rentals.statistics.totalRentals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{rentalHistory?.rentals.statistics.activeRentals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Historical Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rentalHistory?.rentals.statistics.historicalRentals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rentalHistory?.rentals.statistics.overdueRentals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Rentals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Genre</TableHead>
                  <TableHead className="text-center">Rented Date</TableHead>
                  <TableHead className="text-center">Return Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentalHistory?.rentals.active.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>
                      <img
                        src={`./backend/uploads/${rental.movieImage}`}
                        alt={rental.movieTitle}
                        className="w-16 h-24 object-cover rounded"
                        onError={(e) => {
                          e.target.src = `./backend/uploads/default-movie.jpg`;
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{rental.movieTitle}</TableCell>
                    <TableCell>{rental.movieGenre}</TableCell>
                    <TableCell>{new Date(rental.rentedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(rental.plannedReturnDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rental.status === 'Active' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {rental.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {rentalHistory?.rentals.active.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No active rentals
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Rental History */}
        <Card>
          <CardHeader>
            <CardTitle>Rental History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Genre</TableHead>
                  <TableHead className="text-center">Rented Date</TableHead>
                  <TableHead className="text-center">Returned Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentalHistory?.rentals.historical.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>
                      <img
                        src={`./backend/uploads/${rental.movieImage}`}
                        alt={rental.movieTitle}
                        className="w-16 h-24 object-cover rounded"
                        onError={(e) => {
                          e.target.src = `./backend/uploads/default-movie.jpg`;
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{rental.movieTitle}</TableCell>
                    <TableCell>{rental.movieGenre}</TableCell>
                    <TableCell>{new Date(rental.rentedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{rental.actualReturnDate ? new Date(rental.actualReturnDate).toLocaleDateString() : '-'}</TableCell>
                  </TableRow>
                ))}
                {rentalHistory?.rentals.historical.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No rental history
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Admin Section */}
        {sessionStorage.getItem('role') === 'admin' && (
          <div className="mt-10">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">Manage Users</TabsTrigger>
                <TabsTrigger value="movies">Manage Movies</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Users Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Name</TableHead>
                          <TableHead className="text-center">Email</TableHead>
                          <TableHead className="text-center">Phone</TableHead>
                          <TableHead className="text-center">Role</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user.firstName} {user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setEditedUserData(user);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleUserDelete(user._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="movies">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Movies Management</CardTitle>
                      <Button onClick={() => setShowAddMovie(true)}>Add New Movie</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Image</TableHead>
                          <TableHead className="text-center">Title</TableHead>
                          <TableHead className="text-center">Genre</TableHead>
                          <TableHead className="text-center">Director</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allMovies.map((movie) => (
                          <TableRow key={movie._id}>
                            <TableCell>
                              <img
                                src={`./backend/uploads/${movie.image}`}
                                alt={movie.title}
                                className="w-16 h-24 object-cover rounded"
                                onError={(e) => {
                                  e.target.src = `./backend/uploads/default-movie.jpg`;
                                }}
                              />
                            </TableCell>
                            <TableCell>{movie.title}</TableCell>
                            <TableCell>{movie.genre}</TableCell>
                            <TableCell>{movie.director}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMovieToEdit(movie);
                                    setEditedMovieData(movie);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleMovieDelete(movie._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* User Edit Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editedUserData.firstName || ''}
                      onChange={(e) => setEditedUserData({
                        ...editedUserData,
                        firstName: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editedUserData.lastName || ''}
                      onChange={(e) => setEditedUserData({
                        ...editedUserData,
                        lastName: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editedUserData.email || ''}
                      onChange={(e) => setEditedUserData({
                        ...editedUserData,
                        email: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={editedUserData.phoneNumber || ''}
                      onChange={(e) => setEditedUserData({
                        ...editedUserData,
                        phoneNumber: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={editedUserData.address || ''}
                      onChange={(e) => setEditedUserData({
                        ...editedUserData,
                        address: e.target.value
                      })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleUserEdit}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Movie Edit Dialog */}
            <Dialog open={!!selectedMovieToEdit} onOpenChange={() => setSelectedMovieToEdit(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Movie</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editedMovieData.title || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        title: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={editedMovieData.genre || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        genre: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="director">Director</Label>
                    <Input
                      id="director"
                      value={editedMovieData.director || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        director: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={editedMovieData.duration || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        duration: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating (1-10)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={editedMovieData.rating || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        rating: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedMovieData.description || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        description: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="actors">Actors (comma separated)</Label>
                    <Input
                      id="actors"
                      value={Array.isArray(editedMovieData.actors) ? editedMovieData.actors.join(', ') : editedMovieData.actors || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        actors: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image Filename</Label>
                    <Input
                      id="image"
                      value={editedMovieData.image || ''}
                      onChange={(e) => setEditedMovieData({
                        ...editedMovieData,
                        image: e.target.value
                      })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleMovieEdit}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Movie Dialog */}
            <Dialog open={showAddMovie} onOpenChange={setShowAddMovie}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Movie</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newMovieData.title}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        title: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={newMovieData.genre}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        genre: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="director">Director</Label>
                    <Input
                      id="director"
                      value={newMovieData.director}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        director: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newMovieData.duration}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        duration: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating (1-10)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={newMovieData.rating}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        rating: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newMovieData.description}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        description: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="actors">Actors (comma separated)</Label>
                    <Input
                      id="actors"
                      value={newMovieData.actors}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        actors: e.target.value
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image Filename</Label>
                    <Input
                      id="image"
                      value={newMovieData.image}
                      onChange={(e) => setNewMovieData({
                        ...newMovieData,
                        image: e.target.value
                      })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleMovieAdd}>Add Movie</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;