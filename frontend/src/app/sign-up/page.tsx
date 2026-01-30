"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function page() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const Register = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }
      const data = await response.json();

      console.log(data);
      route.push(`/${formData.username}`); // Redirect to user's page after successful registration
    } catch (error: any) {
      console.error(error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m flex items-center justify-center flex-col">
      <h1 className="text-white text-[30px]">Sign Up</h1>
      <form
        action=""
        method="post"
        className="flex flex-col gap-4 mt-4 "
        onSubmit={Register}
      >
        <input
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          type="text"
          name="username"
          placeholder="Username"
          required
          className=" outline-none bg-[#181A2A] p-[5px] rounded-[6px] text-white"
        />
        <input
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          type="email"
          name="email"
          placeholder="Email"
          required
          className=" outline-none bg-[#181A2A] p-[5px] rounded-[6px] text-white"
        />
        <input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          type="password"
          name="password"
          placeholder="Password"
          required
          className=" outline-none bg-[#181A2A] p-[5px] rounded-[6px] text-white"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default page;
