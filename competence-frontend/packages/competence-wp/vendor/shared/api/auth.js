// packages/shared/api/auth.ts
import axios from 'axios';
export async function loginUser(username, password) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const tokenResponse = await axios.post(`${url}/token/`, {
        username,
        password,
    });
    const token = tokenResponse.data.access;
    const userResponse = await axios.get(`${url}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = userResponse.data;
    const roles = Array.isArray(userInfo.roles) ? userInfo.roles : []; // ✅ safe fallback
    return { token, roles, userInfo }; // ✅ return only the data needed
}
