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
    <div className="flex flex-col lg:flex-row md:flex-row justify-between p-4 py-6 border-b shadow-md">
      {/* Left section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:ml-10">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0">
          Task Management
        </h2>
        <div className="flex gap-4 mt-2 lg:mt-0">
          <Button
            variant={"ghost"}
            onClick={() => {
              router.push("/tasklist");
            }}
          >
            <h4 className="scroll-m-20 border-b text-lg sm:text-xl font-semibold tracking-tight">
              Task List
            </h4>
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => {
              router.push("/kanbanboard");
            }}
          >
            <h4 className="scroll-m-20 border-b text-lg sm:text-xl font-semibold tracking-tight">
              Kanban Board
            </h4>
          </Button>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 lg:gap-6 mt-4 lg:mt-0 lg:mr-10">
        <ModeToggle />
        {!user.isLoading ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="hidden sm:block text-sm sm:text-base">
              Hello! {user.username}
            </p>
          </div>
        ) : (
          <div className="text-sm">Need to login/register</div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
