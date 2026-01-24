"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthButtons from "@/components/AuthButtons";

function Page() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
   e.preventDefault();
    setIsLoading(true);
    setError("");

    // Use environment variable (defaults to localhost for safety)
    const apiUrl = process.env.API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Get response body

      // Check if the response was an error
      if (!response.ok) {
        // Use data.error (from your backend)
        throw new Error(data.error || "Failed to sign in");
      }

      // ---- THIS IS THE MOST IMPORTANT FIX ----
      // Save the token to "log the user in"
      localStorage.setItem("token", data.token);
      // ----------------------------------------

      console.log("✅ Logged in:", data.message);

      // Redirect to the user's page
      // route.push(`/${data.username}`);
      // route.push(`/${`write`}`);
      route.push(`/${``}`);
      
    } catch (error: any) {
      console.error(error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen">
      
      <h1 className="text-white text-[30px]">Sign In</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 mt-4 w-[300px]"
      >
        <input
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          type="email"
          name="email"
          placeholder="Email"
          required
          className="outline-none bg-[#181A2A] p-[10px] rounded-[6px] text-white"
        />

        <input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          type="password"
          name="password"
          placeholder="Password"
          required
          className="outline-none bg-[#181A2A] p-[10px] rounded-[6px] text-white"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
      <AuthButtons />
    </div>
  );
}

export default Page;
