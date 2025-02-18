"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface Post {
  id: number
  title: string
  content: string
  author: string
  date: string
}

const initialPosts: Post[] = [
  {
    id: 1,
    title: "Welcome to MTUCoin Forum",
    content: "This is the official forum for MTUCoin discussions.",
    author: "Admin",
    date: "2023-06-01",
  },
  {
    id: 2,
    title: "MTUCoin Price Prediction",
    content: "What are your thoughts on MTUCoin's price in the next 6 months?",
    author: "CryptoEnthusiast",
    date: "2023-06-02",
  },
]

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPost: Post = {
      id: posts.length + 1,
      title: newPostTitle,
      content: newPostContent,
      author: "Current User", // In a real app, this would be the logged-in user
      date: new Date().toISOString().split("T")[0],
    }
    setPosts([...posts, newPost])
    setNewPostTitle("")
    setNewPostContent("")
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Community Forum</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  placeholder="Post Title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Textarea
                  placeholder="Post Content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit Post</Button>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                Posted by {post.author} on {post.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

