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
                          <Input id="login_email" defaultValue="" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" defaultValue="" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Login</Button>
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
                          <Input id="email-register" defaultValue=""/>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="password-register">New password</Label>
                          <Input id="password-register" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="repeatpassword-register">Repeat password</Label>
                          <Input id="repeatpassword-register" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="name-register">First name</Label>
                          <Input id="name-register" defaultValue=""/>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="surname-register">Last name</Label>
                          <Input id="surname-register" defaultValue=""/>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="phone-register">Phone number</Label>
                          <Input id="phone-register" defaultValue=""/>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="adress-register">Adress</Label>
                          <Input id="adress-register" defaultValue=""/>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Register</Button>
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