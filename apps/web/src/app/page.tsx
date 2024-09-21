"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "./store/atoms/user";

export default function Home() {
  const router = useRouter();
  const user = useRecoilValue(userState);

  return (
    <div className="flex mt-32 items-center justify-center">
      {user.isLoading ? (
        <Card className="w-[350px]">
          <CardContent>
            <div className="grid grid-flow-col gap-4 mt-4">
              <Button
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Signup
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Manage yout tasks in easy and effective way....
          </h1>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-4">
            Use the buttons provided in navbar to explore more
          </h3>
        </div>
      )}
    </div>
  );
}
