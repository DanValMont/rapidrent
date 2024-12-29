"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import logo from "../assets/images/house3.png";
import {
  signIn,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

const LoginForm = () => {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  return (
    <>
      <Link
        href={"/"}
        className="flex items-center justify-center my-0 mx-auto"
      >
        <Image src={logo} alt="RapidRent Logo" width={45} height={45} />
      </Link>
      <form>
        <h2 className="dark:text-zinc-400 text-3xl text-center font-semibold mb-6">
          Login
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email:</label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="email address"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="password"
            required
          />
        </div>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
      <div className="mt-4 mb-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-400/20"></div>
          </div>{" "}
          <div className="relative flex justify-center text-md">
            <span className="px-2 bg-white dark:bg-[#161c20] dark:text-zinc-400">
              or
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {providers &&
          Object.values(providers).map((provider, index) => (
            <button
              onClick={() => signIn(provider.id)}
              key={index}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <FaGoogle className="text-white mr-2" />
              <span>Sign In with Google</span>
            </button>
          ))}
      </div>
      <p className="px-1 mt-4 ">
        Don't have an account?{" "}
        <Link
          href={"/register"}
          className="text-blue-500 hover:underline hover:text-blue-600"
        >
          Register
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
