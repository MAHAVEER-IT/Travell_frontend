const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.token}`
  }
}

export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(bookingData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create booking')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export const getUserBookings = async () => {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      headers: getAuthHeader()
    })

    if (!response.ok) {
      throw new Error('Failed to fetch bookings')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

export const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeader()
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to cancel booking')
    }

    return await response.json()
  } catch (error) {
    console.error('Error canceling booking:', error)
    throw error
  }
} 