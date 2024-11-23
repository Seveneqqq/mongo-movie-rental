import { MdOutlineNightlight, MdOutlineLightMode } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from 'react';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Header = ({ isLightTheme, toggleTheme, isLoggedIn, setIsLoggedIn }) => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    
    const handleRegister = async () => {
      
        if (registerPassword !== repeatPassword) {
            console.error('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: registerEmail,
                    password: registerPassword,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    address: address
                })
            });

            const data = await response.json();
            
            if (response.status === 201) {
                console.log('Registration successful!');
                const loginResponse = await fetch('http://localhost:5000/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: registerEmail,
                        password: registerPassword
                    })
                });

                const loginData = await loginResponse.json();
                
                if (loginData.login) {
                    setIsLoggedIn(true);
                    sessionStorage.setItem('userId', loginData.userId);
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('role', loginData.role);
                }
            } else {
                console.error('Registration failed:', data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };
    
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            });

            const data = await response.json();
            
            if (data.login) {
                console.log('Login successful!');
                console.log('User role:', data.role);
                sessionStorage.setItem('userId', data.userId);
                setIsLoggedIn(true);
                sessionStorage.setItem('isLoggedIn','true');
                sessionStorage.setItem('role', data.role);
            } else {
                console.log('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('role');
    }

  return (
    <header>
      <nav className="flex justify-between">
        <ul className="flex gap-10 text-xl text-textColor items-center">
          <li>
            <Link to="/">Browse</Link>
          </li>
          <li>
            <Link to="/released">Released</Link>
          </li>
          <li>
            {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
          </li>
        </ul>
        <ul className="flex gap-10 text-xl text-textColor items-center">
          <li>
            {isLightTheme ? (
              <MdOutlineNightlight onClick={toggleTheme} />
            ) : (
              <MdOutlineLightMode onClick={toggleTheme} />
            )}
          </li>
          <li>
            {isLoggedIn ? (
              <Link onClick={logout}>Logout</Link>
            ) : (
              <Dialog>
               <DialogTrigger asChild>
                 <Link>Login</Link>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                 <DialogHeader>
                 <DialogTitle>Account</DialogTitle>
                 </DialogHeader>
                 <Tabs defaultValue="Login" className="">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Login">Login</TabsTrigger>
                    <TabsTrigger value="Register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="Login">
                    <Card>
                      <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                          Login to existing account.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="login_email">Email</Label>
                          <Input 
                            id="login_email" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="password">Password</Label>
                          <Input 
                            id="password" 
                            type="password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={handleLogin}>Login</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="Register">
                    <Card>
                      <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>
                          Create a new account.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="email-register">Email</Label>
                          <Input 
                            id="email-register"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="password-register">New password</Label>
                          <Input 
                            id="password-register" 
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="repeatpassword-register">Repeat password</Label>
                          <Input 
                            id="repeatpassword-register" 
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name-register">First name</Label>
                          <Input 
                            id="name-register"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="surname-register">Last name</Label>
                          <Input 
                            id="surname-register"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="phone-register">Phone number</Label>
                          <Input 
                            id="phone-register"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="address-register">Address</Label>
                          <Input 
                            id="address-register"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={handleRegister}>Register</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
               </DialogContent>
              </Dialog>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;