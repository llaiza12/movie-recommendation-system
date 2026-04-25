const API_URL = "http://127.0.0.1:8000";

// Function to get collaborative filtering recommendations
export async function getCollaborativeRecommendations(userId: number) {
    const url  = `${API_URL}/api/user/${userId}`;
    const res = await fetch(url);

    const data = (await res).json();
    return data;
}

// Function to get content-based recommendations
export async function getContentRecommendations(title: string) {
    const url = `${API_URL}/api/content/${title}`;
    const res = await fetch(url);

    const data = (await res).json();
    return data;
}

// Function to get popular movie recommendations
export async function getPopularRecommendations() {
    const url = `${API_URL}/api/popular`;
    const res = await fetch(url);
    
    const data = (await res).json();
    return data;
}