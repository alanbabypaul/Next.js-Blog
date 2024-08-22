"use client";

import React, { JSX, useState } from "react";
import Link from "next/link";
import { NextResponse } from "next/server";


export default function Component({
  id,
  title,
  content,
  date,
}: {
  id: string;
  title: string;
  content: string;
  date: string;
  
}) {
    // state created
    const [isDeleted, setIsDeleted] = useState(false);

    // handle delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete post");
      } else {
        if (res.ok) {
          console.log("Post deleted successfully");
          setIsDeleted(true);
    
          
        }
      }
    } catch (error) {
      console.log("Error in deleting post: " + error);
    }
  };
// getAllPosts
if (isDeleted) return null;
  return (
    <div key={id} className="border border-gray-200 p-4 my-4">
      <Link href={`/blog/post/${id}`}>{title}</Link>
      <p className="text-gray-500">{date}</p>
      <p>{content}</p>
      
      <button
        onClick={() => handleDelete(id)}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}
