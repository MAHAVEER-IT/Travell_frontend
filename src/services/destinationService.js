const API_URL = import.meta.env.VITE_API_URL || 'https://travell-backend.onrender.com/api'

// Get auth token from localStorage
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.token}`,
    'Access-Control-Allow-Origin': '*'
  }
}

export const getAllDestinations = async () => {
  try {
    const response = await fetch(`${API_URL}/destinations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch destinations')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching destinations:', error)
    throw new Error(error.message)
  }
}

export const createDestination = async (destinationData) => {
  const response = await fetch(`${API_URL}/destinations`, {
    method: 'POST',
    headers: getAuthHeader(),
    credentials: 'include',
    body: JSON.stringify(destinationData)
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Could not create destination')
  }
  return data
}

export const updateDestination = async (id, destinationData) => {
  const response = await fetch(`${API_URL}/destinations/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    credentials: 'include',
    body: JSON.stringify(destinationData)
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Could not update destination')
  }
  return data
}

export const deleteDestination = async (id) => {
  const response = await fetch(`${API_URL}/destinations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
    credentials: 'include'
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Could not delete destination')
  }
  return data
}

export const getRecentDestinations = async (limit = 3) => {
  try {
    const response = await fetch(`${API_URL}/destinations/recent?limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch recent destinations')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching recent destinations:', error)
    throw error
  }
} 