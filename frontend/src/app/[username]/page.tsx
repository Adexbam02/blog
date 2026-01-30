"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

type UserProfile = {
  username: string;
  email: string;
  bio: string | null;
  profile_picture_url: string | null;
  banner_picture_url: string | null;
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
    <div className="grid grid-cols-4">
      <div>a</div>
      <div className="w-full mx-auo mt10  bg-blac col-span-2 border-x border-black/30 min-h-screen">
        <div>
          <div className="flex flex-col relative">
            <div className="w-full h-[200px] relative bg-black">
              {profile.banner_picture_url && (
                <Image
                  src={profile.banner_picture_url}
                  alt="Banner"
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            <div className="w-[135px] h-[135px] rounded-md border-2 border-black/30 absolute left-6 bottom-[-60px] bg-black overflow-hidden ">
              <Image
                src={profile.profile_picture_url || "/default-profile.png"}
                alt="Profile Picture"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          <div className="mt-20 px-6">
            <div className="flex w-full justify-between">
              <div className="flex flex-col items-start gap-">
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <p>{profile.email}</p>
              </div>

              <button>Edit Profile | Follow</button>
            </div>

            <p className="my-5 font-semibold">{profile.bio}</p>
          </div>
        </div>

        <div className="flex items-center gap-6"></div>

        {/* Divider */}
        <div className="h-px bg-gray-300 my10" />

        {profile.posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="">
            {profile.posts.map((post) => (
              <Link
                key={post.id}
                href={`/${profile.username}/${post.slug}`}
                className="w-full p-5 border-b border-black/30 flex flex-row-reverse justify-between"
              >
                {post.img_url && (
                  <div className="w-[30%] h-[130px] shrink-0 overflow-hidden mb-3">
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
                  <h3 className="text-[30px] leading-[120%] text-wrap  font-semibold">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-1 p-1 bg-white rounded text-sm font-medium">
                    {post.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div>b</div>
    </div>
  );
}
