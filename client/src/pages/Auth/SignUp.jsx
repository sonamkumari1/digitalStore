import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useRegisterMutation } from "../../redux/api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignUp = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate(); // Initialize navigate

  const changeInputHandler = (e, inputField) => {
    setSignupInput({ ...signupInput, [inputField]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setSignupInput((prevState) => ({ ...prevState, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(signupInput);

    if (result.error) {
      console.log(result.error);
    }
    if (result.data) {
      console.log("Signup successful", result.data);
      navigate("/user/login");
    }
  };

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs className="w-[400px]">
        <TabsList className="grid w-full pb-10 mb-4">
          <h1 className="text-2xl font-bold text-black">Signup</h1>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Create a new account and click Signup when you're done.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input type="text" name="name" value={signupInput.name} onChange={(e) => changeInputHandler(e, "name")} placeholder="Eg: John Doe" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" value={signupInput.email} onChange={(e) => changeInputHandler(e, "email")} placeholder="Eg: johndoe@gmail.com" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" value={signupInput.password} onChange={(e) => changeInputHandler(e, "password")} placeholder="Enter your password" required />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={signupInput.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Signing up..." : "Signup"}
            </Button>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
};

export default SignUp;
