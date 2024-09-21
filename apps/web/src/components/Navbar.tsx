"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/togglebutton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecoilValue } from "recoil";
import { userState } from "@/app/store/atoms/user";

const Navbar = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  return (
    <div className="flex justify-between p-4 py-6 border-b shadow-md">
      <div className="flex lg:ml-10 gap-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Task Management
        </h2>
        <div className="ml-6">
          <Button
            variant={"ghost"}
            onClick={() => {
              router.push("/tasklist");
            }}
          >
            <h4 className="scroll-m-20 border-b text-xl font-semibold tracking-tight">
              Task List
            </h4>
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              router.push("/kanbanboard");
            }}
          >
            <h4 className="scroll-m-20 border-b text-xl font-semibold tracking-tight">
              Kanban Board
            </h4>
          </Button>
        </div>
      </div>
      <div className="flex gap-6 mr-10">
        <ModeToggle></ModeToggle>
        {!user.isLoading ? (
          <>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="leading-7 [&:not(:first-child)]">
              hello! {user.username}
            </p>
          </>
        ) : (
          <div>need to login/register</div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
