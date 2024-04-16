import React from "react";
import { PostCreate } from "./components/PostCreate";
import PostList from "./components/PostList";

export default function App() {
  return (
    <React.StrictMode>
      <PostCreate />
      <PostList />
    </React.StrictMode>
  );
} 