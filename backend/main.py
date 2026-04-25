from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
)

# Load datasets
ratings = pd.read_csv("ratings.csv", usecols=["userId", "movieId", "rating"])
movies = pd.read_csv("movies.csv")

# User-item Rating Matrix
user_item_matrix = ratings.pivot(
    index="userId",
    columns="movieId",
    values="rating"
).fillna(0) # Fill missing ratings with 0

# Compute user similarity using cosine similarity
user_similarity = cosine_similarity(user_item_matrix)

# User-Based Collaborative Filtering
def recommend_user(user_id, top_n=5):
    if user_id not in user_item_matrix.index:
        return [] # empty list if user not found
    
    user_index = user_item_matrix.index.get_loc(user_id)

    similarity_scores = user_similarity[user_index] # list of similarity scores for the user

    # compute weighted ratings for all movies based on similarity scores and user ratings
    weighted_ratings = np.dot(similarity_scores, user_item_matrix) / np.sum(similarity_scores)

    # Sorts the weigted ratings in descending order and gets the top n indices
    recommended_indices = np.argsort(weighted_ratings)[::-1][:top_n]
    
    top_movie_ids = user_item_matrix.columns[recommended_indices]
    recommended_movies = movies[movies["movieId"].isin(top_movie_ids)]["title"].tolist()
    return recommended_movies

# Initialize TfidfVectorizer
tfidf = TfidfVectorizer(stop_words='english')

# looks at all genres (vocabulary) and converts text into numbers
tfidf_matrix = tfidf.fit_transform(movies['genres'])

# Compute cosine similarity between movies based on genres
content_similarity = cosine_similarity(tfidf_matrix)

# Content-Based Filtering
def recommend_content(title, top_n=5):
    if title not in movies['title'].values:
        return [] # empty list if movie not found
    
    movie_index = movies[movies['title'] == title].index[0]

    similarity_scores = content_similarity[movie_index] # list of similarity scores for the movie

    # Sorts the similarity scores in descending order and gets the top n indices
    recommended_indices = np.argsort(similarity_scores)[::-1][1:top_n+1] # skip the first one as it is the same movie
    
    recommended_movies = movies.iloc[recommended_indices]['title'].tolist()
    return recommended_movies

def recommend_popular():
    # Calculate average ratings for each movie
    avg_ratings = ratings.groupby('movieId')['rating'].mean()
    
    top_movies_ids = avg_ratings.sort_values(ascending=False).head(5).index
    
    recommended_movies = movies[movies['movieId'].isin(top_movies_ids)]['title'].tolist()
    return recommended_movies

# API Endpoints
@app.get("/api/user/{user_id}")
def get_user_recommendations(user_id: int):
    recommendations = recommend_user(user_id)
    return {"recommendations": recommendations}

@app.get("/api/content/{title}")
def get_content_recommendations(title: str):
    recommendations = recommend_content(title)
    return {"recommendations": recommendations}

@app.get("/api/popular")
def get_popular_recommendations():
    recommendations = recommend_popular()
    return {"recommendations": recommendations}

@app.get("/")
def home():
    return {"message": "Welcome to the Movie Recommender API!"}