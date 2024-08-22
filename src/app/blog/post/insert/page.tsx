"use client";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/app/lib/definition";
import { getSession } from "next-auth/react";
import { title } from "process";
import Groq from "groq-sdk"; // Import Groq SDK

export default function Page() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const PROMPT =
    "You are a creative blog writer. write a 50-word blog post about the title below. You can write anything you want, but it must be at least 50 words long. The title is: ";
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uuid = uuidv4();
    try {
      fetch(
        `/api/posts?id=${uuid}&title=${formData.title}&author=${
          user?.name
        }&content=${content || formData.content}&date=${formData.date}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, id: uuid }),
        }
      );

      // Clear form fields
      setFormData({
        id: "",
        title: "",
        content: "",
        date: new Date().toISOString().slice(0, 10),
      });

      // Redirect to the posts page
      router.push("/blog/posts");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log(process.env.blog);
    getSession().then((session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        router.push("/blog/posts");
      }
    });
  }, []);

  // open ai generator
  // const generateContent = () => {
  //   setGenerating(true);
  //   if (!formData?.title) { return false }
  //   const requestParams = {
  //     model: "gpt-3.5-turbo",
  //     messages: [{ "role": "system", "content": PROMPT + formData?.title },
  //     { "role": "user", "content": formData?.title },]

  //   }
  //   const blog = "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"
  //   fetch('https://console.groq.com/playground', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${blog}`
  //     },
  //     body: JSON.stringify(requestParams)
  //   }).then(response => response.json())
  //     .then(data => {
  //       setContent(data.choices[0].message.content);
  //       console.log(data.choices[0].message.content);
  //       setGenerating(false);
  //     }).catch(console.error);
  // }

  // generate content using ai
  const generateContent = async () => {
    setGenerating(true);

    // Check if the title exists
    if (!formData.title) {
      setGenerating(false);
      return;
    }

    // Make sure the API key is correctly set
    const apiKey = "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";
    if (!apiKey) {
      console.error("API key is missing or not set correctly");
      setGenerating(false);
      return;
    }

    const groq = new Groq({
      apiKey: apiKey, // Using the correctly set API key
      dangerouslyAllowBrowser: true,
    });

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: PROMPT + formData.title,
          },
        ],
        model: "llama3-8b-8192", // Ensure the model is correct
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      let responseContent = "";
      for await (const chunk of chatCompletion) {
        responseContent += chunk.choices[0]?.delta?.content || "";
      }

      setContent(responseContent);

      // const generatedImageUrl = await generateImage(formData.title);
      setGenerating(false);
    } catch (error) {
      console.error("Error generating content:", error);
      setGenerating(false);
    }
  };

  const postContent = useMemo(() => {
    return content || formData.content;
  }, [content, formData.content]);

  // uploadImg
  const uploadImg = (event: any) => {
    const img = event.target.files[0];
    // console.log("image uploaded",img)
    if (img) {
      setImageFile(img);
      const previewImage = URL.createObjectURL(img);
      console.log("preview image", previewImage);
      setImagePreview(previewImage);
    }
  };

  // image generator
  // const generateImage = async (prompt:any) => {
  //   const response = await fetch("https://api.deepai.org/api/text2img", {
  //     method: "POST",
  //     headers: {
  //       "Api-Key": "0db7a1de-2741-4c51-8436-76ed2667f0a4", // Replace with your DeepAI API Key
  //     },
  //     body: new URLSearchParams({
  //       text: formData.title, // The prompt for image generation
  //     }),
  //   });

  //   const result = await response.json();
  //   console.log("generated image",result);
  //   return result.output_url; // This will return the generated image URL
  // };
  const isFormValid = () => {
    return formData.title.trim() !== "" && formData.content.trim() !== "";
  };
  const buttonClasses = isFormValid()
  ? "bg-purple-600 hover:bg-purple-700"
  : "bg-red-500 hover:bg-red-600";

  return (
    <div className="bg-white p-8 rounded shadow">
      <h2 className="text-2xl mb-4 text-purple-700">New Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border-2 border-purple-100 p-2 rounded-md focus:border-purple-200 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="content" className="block font-medium">
            Content:
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            value={postContent}
            onChange={handleChange}
            className="w-full border-2 border-purple-100 p-2 rounded-md focus:border-purple-200 focus:outline-none"
          />
          {generating && (
            <p className="text-purple-700 my-1">Generating content...</p>
          )}
          <button
            onClick={generateContent}
            type="button"
            className="bg-blue-400 text-white px-4 py-2 rounded-md bg-purple-600  hover:bg-purple-700"
          >
            Generate Content
          </button>
        </div>
        <div>
          {/* image genrate code starts */}

          <div className="my-4">
            <label htmlFor="imageUpload" className="block font-medium">
              Upload Image:
            </label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              onChange={uploadImg} // Function to handle image upload
              className="w-full border-2 border-purple-100 p-2 rounded-md focus:border-purple-200 focus:outline-none"
            />
          </div>
          {/* image genrate code ends */}

          {/* image priview  */}
          {imagePreview && (
            <div className="my-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-64  rounded-md h-auto "
              />
            </div>
          )}

          <label htmlFor="date" className="block font-medium">
            Date:
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            readOnly
            className="w-full border-2 border-purple-100 p-2 rounded-md focus:border-purple-200 focus:outline-none"
          />
        </div>

        <div>
          <button
            type="submit"
            className={`bg-blue-400 text-white px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 ${buttonClasses}`} 
            disabled={!isFormValid()} 
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
