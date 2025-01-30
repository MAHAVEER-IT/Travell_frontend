const BASE_URL = 'https://travell-backend.onrender.com/api'

// For development/testing purposes
const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '12345678',
  role: 'admin',
  name: 'Admin User'
}

export const login = async (email, password) => {
  // For development/testing - hardcoded admin check
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      ...ADMIN_CREDENTIALS,
      token: 'admin-token'
    }
  }

  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    localStorage.setItem('token', data.token)
    return data
  } catch (error) {
    throw new Error(error.message || 'Login failed')
  }
}

export const register = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed')
  }
  return data
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// Add this function to get user profile
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }

    return await response.json()
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch profile')
  }
} 