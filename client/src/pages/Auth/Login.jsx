import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(formInput);
    if (result.error) {
      console.log(result.error);
    }
    if (result.data) {
      console.log("Login successful", result.data);
      navigate("/");
    }
  };
  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full pb-10 mb-4">
          <h1 className="text-2xl font-semibold text-black">Login</h1>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login with your email and password after signing up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={formInput.email}
                onChange={handleChange}
                placeholder="Eg: johndoe@gmail.com"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={formInput.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-3 w-full">
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
               
              </Button>

              <p className="text-sm text-gray-600 text-end">
                Don't have an account?{" "}
                <Link to="/user/signup" className="text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
};

export default Login;
