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
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/user";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../config";
import InitUser from "@/components/InitUser";
import { useToast } from "@/hooks/use-toast";
import { title } from "process";

const Login = () => {
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userState);
  const router = useRouter();
  const { toast } = useToast();

  const login = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
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
          title: "Login Successfully",
        });
        router.replace("/");
      }
    } catch (error) {
      // Handle login error (optional)
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Invalid username or password",
      });
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
      <InitUser></InitUser>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Login
            </h2>
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
            <Button size={"lg"} className="w-full" onClick={login}>
              Login
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm">
            <span>Don't have an account? </span>
            <Link className="border-b" href={"signup"}>
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
