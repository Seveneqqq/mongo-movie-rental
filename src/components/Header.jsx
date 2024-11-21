import { MdOutlineNightlight, MdOutlineLightMode } from "react-icons/md";
import { Link } from "react-router-dom";

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

const Header = ({ isLightTheme, toggleTheme, isLoggedIn }) => {

    const login = () => {
        
    }

    const logout = () => {
        console.log('Close dialog');
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
            {isLoggedIn && <Link to="/account">Account</Link>}
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
                 <Link onClick={login}>Login</Link>
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
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue="@peduarte" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save changes</Button>
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
                          <Label htmlFor="current">Current password</Label>
                          <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new">New password</Label>
                          <Input id="new" type="password" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save password</Button>
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