"use client";
import { getCollaborativeRecommendations } from "@/lib/api";
import { getContentRecommendations } from "@/lib/api";
import { getPopularRecommendations } from "@/lib/api";
import { useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [movies, setMovies] = useState<string[]>([]);

  const getUserRecs = async () => {
    try {
      const data = await getCollaborativeRecommendations(Number(userId));
      setMovies(data.recommendations);
    } catch (error) {
      console.error("Error fetching collaborative recommendations:", error);
    }
  };

  const getContentRecs = async () => {
    try {
      const data = await getContentRecommendations(String(movieTitle));
      setMovies(data.recommendations);
    } catch (error) {
      console.error("Error fetching content-based recommendations:", error);
    }
  };

  const getPopularRecs = async () => {
    try {
      const data = await getPopularRecommendations();
      setMovies(data.recommendations);
    } catch (error) {
      console.error("Error fetching popular recommendations:", error);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-white">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-center py-26 px-16 sm:items-start">
        <h1 className="text-5xl mb-8 font-bold text-blue-800 text-shadow-sm ">
          Movie Recommender
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          Using the MovieLens dataset, this system provides personalized movie recommendations based on user preferences and movie content. <br /><br />Enter a User ID to get collaborative filtering recommendations or a Movie Title for content-based suggestions.
          If you don't have a User ID, the system provides popular movie recommendations based on overall ratings.
        </p>
        <div className="flex flex-row"> 
          <h1 className="text-lg font-semibold text-black">
            Enter a User ID:
          </h1>
          <h1 className="text-lg font-normal ml-2 text-gray-600">(1 - 610)</h1>
        </div>
        <input type="text" placeholder="User ID" className="p-4 border rounded-lg w-full border-black text-black" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)}/>

        <div className="flex justify-between w-full flex-row mb-8">
        <button className="mt-4 mb-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition" onClick={getUserRecs}>
          Get User-Based Recommendations
        </button>
        <button className="mt-4 mb-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition" onClick={getPopularRecs}>
          No User ID?
        </button>
        </div>

        <div className="flex w-full flex-row">
          <h1 className="text-lg font-semibold text-black">
            Enter a Movie Title: 
          </h1>
          <h1 className="text-lg font-normal ml-2 text-gray-600">(include year, e.g. "Toy Story (1995)")</h1>
        </div>
        
        <input type="text" placeholder="Jumanji (1995)" className="p-4 border rounded-lg w-full border-black text-black" 
        value={movieTitle} 
        onChange={(e) => setMovieTitle(e.target.value)}/>
        <button className="mt-4 mb-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition" onClick={getContentRecs}>
          Get Content-Based Recommendations
        </button>
        
        <div className="mt-8 mb-8 w-full">
          {movies?.length > 0 && (
            <div>
              <h1 className="text-2xl font-bold text-blue-900 mb-4">Recommended Movies:</h1>
              <ul className="list-disc pl-5">
                {movies.map((movie, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    {movie}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {movies?.length === 0 && (
            <p className="text-lg text-gray-700">No recommendations to display. Please enter a User ID or Movie Title.</p>
          )}
        </div>

      </main>
    </div>
  );
}
