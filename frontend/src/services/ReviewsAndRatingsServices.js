export const fetchReviews = async (payload) => {
  try {
    const response = await fetch(
      "https://us-central1-activity-2-f4bb7.cloudfunctions.net/fetchReviewsForRoom",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const status = response.status;
    const responseJson = await response.json();

    if (!response.ok) {
      if (status === 404) {
        return { status, data: [] };
      }
      throw { message: "Failed to fetch booking information", status };
    }

    return { status, data: responseJson };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const addReview = async (reviewData) => {
  try {
    const response = await fetch(
      "https://us-central1-activity-2-f4bb7.cloudfunctions.net/sentimentAnalyser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add review");
    }
    const storeInBigQuery = await fetch(
      "https://us-central1-activity-2-f4bb7.cloudfunctions.net/storeRatingsInBiqQuery",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const fetchBookingsByUser = async (user) => {
  try {
    const response = await fetch(
      `https://14ul0d9spk.execute-api.us-east-1.amazonaws.com/dev/getAllBookings/${user}`
    );

    const status = response.status;
    const responseJson = await response.json();

    if (!response.ok) {
      if (status === 404) {
        return { status, data: [] };
      }
      throw { message: "Failed to fetch booking information", status };
    }

    return { status, data: responseJson };
  } catch (error) {
    console.error("Error fetching booking information:", error);
    throw error;
  }
};

export const raiseConcern = async (payload) => {
  try {
    const response = await fetch(
      "https://us-central1-csci-5410-428021.cloudfunctions.net/publish_message_to_agent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to raise concern");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export default { fetchReviews, addReview };
