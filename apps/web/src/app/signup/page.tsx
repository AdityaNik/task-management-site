"use client";
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
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../config";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userState);
  const [showSleepMessage, setShowSleepMessage] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const register = async () => {
    setShowSleepMessage(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/sign-up`, {
        username,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("token", "Bearer " + res.data.token);
        setUser({
          isLoading: false,
          username,
        });
        toast({
          title: "User Registered Successfully",
        });
        router.replace("/");
      }
    } catch (error) {
      // Handle registration error (optional)
      toast({
        variant: "destructive",
        title: "Invalid username or password",
      });
      console.error("Registration failed:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div className="flex mt-10 m-4 lg:mt-32 items-center justify-center">
      <Card className="w-[350px]">
        {showSleepMessage && (
          <div className="bg-yellow-100 text-yellow-800 p-2 mb-4 rounded-md text-center">
            Server is sleeping, please wait for a minute...
          </div>
        )}
        <CardHeader>
          <CardTitle>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Register
            </h2>
          </CardTitle>
          <CardDescription>
            Enter email and password below to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-flow-row gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button size={"lg"} className="w-full" onClick={register}>
              Register
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm">
            <span>Already have an account? </span>
            <Link className="border-b" href={"login"}>
              login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
