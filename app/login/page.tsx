"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import logo from "../../assets/images/house3.png";
import {
  signIn,
  useSession,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

const LoginPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (
      (e.target as HTMLFormElement).elements[0] as HTMLInputElement
    ).value;
    const password = (
      (e.target as HTMLFormElement).elements[1] as HTMLInputElement
    ).value;

    if (!isValidEmail(email)) {
      toast.error("Email is invalid");
      return;
    }

    if (!password) {
      toast.error("Password is invalid");
      return;
    }

    if (password.length < 8) {
      toast.error("Password has less than 8 characters");
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
      }
      if (res?.url) router.replace("/profile");
    } catch (error) {
      toast.error("Error, try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return loading && sessionStatus === "loading" ? (
    <Spinner loading={loading} />
  ) : (
    <section className="bg-blue-50 dark:bg-[#161c20]">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white dark:bg-[#161c20] dark:shadow-[rgba(62,62,62,0.3)] px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <Link
            href={"/"}
            className="flex items-center justify-center my-0 mx-auto"
          >
            <Image src={logo} alt="RapidRent Logo" width={45} height={45} />
          </Link>
          <form onSubmit={handleSubmit}>
            <h2 className="dark:text-zinc-400 text-3xl text-center font-semibold mb-6">
              Login
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email:
              </label>
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
            {
              providers && (
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  <FaGoogle className="text-white mr-2" />
                  <span>Sign In with Google</span>
                </button>
              )
            }
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
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
