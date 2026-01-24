"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: number;
  username: string;
  email: string;
  exp: number;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profile_picture_url: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/sign-in");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      router.push("/sign-in");
    }
  }, [router]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          profile_picture_url: data.profile_picture_url || "",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let finalImageUrl = formData.profile_picture_url;

    if (imageFile) {
      try {
        const cloudFormData = new FormData();
        cloudFormData.append("file", imageFile);
        cloudFormData.append("upload_preset", "ml_default");

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/dmr4gb8mj/image/upload`,
          { method: "POST", body: cloudFormData }
        );

        const cloudData = await cloudRes.json();
        if (cloudData.secure_url) {
          finalImageUrl = cloudData.secure_url;
        } else throw new Error("Cloudinary upload failed");
      } catch (err: any) {
        console.error("Error uploading image:", err.message);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:5000/user/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          profile_picture_url: finalImageUrl,
        }),
      });

      const data = await res.json();
      alert(data.message || "Profile updated successfully");
      router.push("/");
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 ">
      {/* <h1 className="text-2xl font-bold mb-4">Edit Profile</h1> */}

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-start">
        <div className="flex items-center justify-center gap-7">
          <input
            type="file"
            accept="image/*"
            // value={formData.profile_picture_url}
            placeholder={formData.profile_picture_url}
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
            className="w-[70px] h-[70px] cursor-pointer rounded-full border-amber-50  border p-2 rouned"
          />

          <div className="flex flex-col items-start">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border text-gray-300 rounded outline-none border-none"
              placeholder="Username"
              // readOnly
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border text-gray-300 italic  w rounded outline-none border-none"
            />
          </div>
        </div>

        <textarea
          name="bio"
          placeholder="Write something about yourself..."
          value={formData.bio}
          onChange={handleChange}
          className="w-full border p-2 text-gray-300 resize-none  rounded h-20"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
