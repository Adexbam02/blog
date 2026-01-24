"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

type UserProfile = {
  username: string;
  email: string;
  bio: string | null;
  profile_picture_url: string | null;
  posts: {
    id: number;
    slug: string;
    title: string;
    category: string;
    img_url: string | null;
    created_at: string;
  }[];
};

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const username = params.username;
  console.log(params);
  useEffect(() => {
    async function fetchProfile() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/user/profile/profile/${username}`);

        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading profile…</p>;

  if (!profile)
    return <p className="text-center mt-10 text-red-500">User not found</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Profile Section */}
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 rounded-md border-3 border-gray-400 overflow-hidden bg-gray-200 flex shrink-0">
          <Image
            src={profile.profile_picture_url || "/imgs/user.png"}
            alt={profile.username}
            width={130}
            height={130}
            className="object-cover "
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
          <p className="text-gray-500">{profile.email}</p>
          {profile.bio && <p className="mt-2 text-white/50">{profile.bio}</p>}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 my-10" />

     

      {profile.posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {profile.posts.map((post) => (
            <a
              key={post.id}
              href={`/${profile.username}/${post.slug}`}
              className=" p-5 border-b border-gray-300 flex flex-row-reverse justify-between"
            >
              {post.img_url && (
                <div className="w-[250px] h-[150px] shrink-0 overflow-hidden mb-3">
                  <Image
                    src={post.img_url}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="flex flex-col items-start gap-5">
                <h3 className="text-[30px] leading-[120%] text-wrap text-white font-semibold">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="mt-1 p-1 bg-white rounded text-sm font-medium">{post.category}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
