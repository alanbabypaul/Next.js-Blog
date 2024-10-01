"use client";

import React, { JSX, useState } from "react";
import Link from "next/link";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth.config";


export default async function Component({
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

// check user is loged in or not
  return (
    <div key={id} className="border border-gray-200 p-4 my-4">
     <h1> <Link href={`/blog/post/${id}`}>{title}</Link></h1>
     <h2>{}</h2>
     <div className="flex justify-center items-center p-4">
  <img 
    src="https://www.shutterstock.com/image-photo/young-female-travel-blogger-sitting-260nw-1500799619.jpg" 
    alt="Travel Blogger" 
    className="w-full max-w-md h-auto rounded-lg shadow-md"
  />
</div>
      <p className="text-gray-500 text-xs">{date}</p>
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
