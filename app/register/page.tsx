"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "../../assets/images/house3.png";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Spinner from "@/components/Spinner";

const RegisterPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (
      (e.target as HTMLFormElement).elements[0] as HTMLInputElement
    ).value;
    const email = (
      (e.target as HTMLFormElement).elements[1] as HTMLInputElement
    ).value;
    const password = (
      (e.target as HTMLFormElement).elements[2] as HTMLInputElement
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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.slice(0, 20),
          email,
          password,
        }),
      });
      if (res.status === 400) {
        toast.error("This email is already registered");
      }
      if (res.status === 200) {
        router.push("/login");
      }
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
              Register
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Username:
              </label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Email:
              </label>
              <input
                type="text"
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="valid email address"
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
                placeholder="password not less than 8 characters"
                required
              />
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="px-1 mt-4 ">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="text-blue-500 hover:underline hover:text-blue-600"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
