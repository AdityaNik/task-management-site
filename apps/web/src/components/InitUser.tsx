"use client";
import { useEffect } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "../app/store/atoms/user";
import { BASE_URL } from "@/app/config";

const InitUser = () => {
  const setUser = useSetRecoilState(userState);

  const init = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          // Retrieve token from localStorage for authentication
          Authorization: localStorage.getItem("token"),
        },
      });
      if (res.data.username) {
        setUser({
          isLoading: false,
          username: res.data.username,
        });
      } else {
        setUser({
          isLoading: true,
          username: "",
        });
      }
    } catch (e) {
      // Handle error by setting user state to loading
      setUser({
        isLoading: true,
        username: "",
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return <div></div>;
};

export default InitUser;
