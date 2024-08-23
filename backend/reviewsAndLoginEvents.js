/* eslint-disable */

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const bucketName = "activity-2-f4bb7.appspot.com";
const axios = require("axios");
const { BigQuery } = require("@google-cloud/bigquery");
//intitialization of firebase app
admin.initializeApp();

//db instance
const db = admin.firestore();

//reference to users collection
const usersRef = db.collection("users");
const reviewsRef = db.collection("reviews");
const express = require("express");
const { firestore } = require("firebase-admin");

//enabling cors for local testing
const cors = require("cors")({ origin: true });
const app = express();

app.use(cors);
//function to create an user
exports.createUser = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      response.set("Access-Control-Allow-Origin", "*");
      response.set("Access-Control-Allow-Methods", "GET, POST");

      const { email, password } = request.body; // Assuming you receive name and email in request body
      // Add a new document with a generated ID

      if (!email || !password) {
        return response.status(400).send("Missing parameters");
      }

      //refering to users collection

      const newUserRef = await usersRef.add({
        email: email,
        password: password,
      });

      return response.status(200).json({ id: newUserRef.id });
    } catch (error) {
      // Error handling
      return response.status(500).send("Failed to create user");
    }
  });
});

//function to verify the users
exports.verifyUser = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      response.set("Access-Control-Allow-Origin", "*");
      response.set("Access-Control-Allow-Methods", "GET, POST");
      const { email, password } = request.body;
      if (!email || !password) {
        return response.status(400).send("Email and password are required.");
      }

      const snapshot = await usersRef.where("email", "==", email).get();

      if (snapshot.empty) {
        return response.status(404).send("User not found");
      }

      let user;
      snapshot.forEach((doc) => {
        user = doc.data();
      });

      if (user.password === password) {
        return response
          .status(200)
          .json({ success: true, message: "User verified successfully" });
      } else {
        return response
          .status(401)
          .json({ success: true, message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      return response.status(500).send("Internal server error");
    }
  });
});

//function to upload the image
exports.uploadImage = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const base64Data = request.body.base64Image;

      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");

      const imageBuffer = Buffer.from(base64Image, "base64");

      const filename = `image_${Date.now()}.png`;

      await storage.bucket(bucketName).file(filename).save(imageBuffer, {
        contentType: "image/png", // Adjust the content type if your image is not PNG
        public: true, // Optional: Make the file public
      });

      // Respond with success message or other data
      response.status(200).send(`Image ${filename} uploaded successfully.`);
    } catch (error) {
      console.error("Error uploading image:", error);
      response.status(500).send("Internal server error");
    }
  });
});

exports.fetchAllImages = functions.https.onRequest(
  async (request, response) => {
    cors(request, response, async () => {
      try {
        // Fetch all objects from the bucket
        const [files] = await storage.bucket(bucketName).getFiles();

        // Construct URLs or return metadata for each file
        const images = files.map((file) => ({
          name: file.name,
          // Adjust URL format as per your bucket configuration
          url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
          contentType: file.metadata.contentType,
          size: file.metadata.size,
        }));

        // Respond with the list of images
        response.status(200).json(images);
      } catch (error) {
        console.error("Error fetching images:", error);
        response.status(500).send("Error fetching images.");
      }
    });
  }
);

function categorizeSentiment(score) {
  if (score >= 0.8) {
    return "very positive";
  } else if (score >= 0.4) {
    return "positive";
  } else if (score >= -0.4) {
    return "neutral";
  } else if (score >= -0.8) {
    return "negative";
  } else {
    return "very negative";
  }
}

exports.sentimentAnalyser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    let text, userRating, roomNumber;

    if (!req.body.given_name && !req.body.family_name) {
      res.status(400).json({
        error:
          "Please provide text and rating in the request body or as query parameters",
      });

      return;
    }
    const { given_name, family_name } = req.body;

    if (req.body && req.body.text && req.body.rating && req.body.roomNumber) {
      text = req.body.text;
      userRating = req.body.rating;
      roomNumber = req.body.roomNumber;
    } else if (
      req.query &&
      req.query.text &&
      req.query.rating &&
      req.query.roomNumber
    ) {
      text = req.query.text;
      userRating = req.query.rating;
      roomNumber = req.query.roomNumber;
    } else {
      res.status(400).json({
        error:
          "Please provide text and rating in the request body or as query parameters",
      });

      return;
    }

    try {
      userRating = parseFloat(userRating);
      if (userRating < 0 || userRating > 5) {
        throw new Error("User rating must be between 0 and 5");
      }
    } catch (error) {
      res.status(400).json({ error: error.message });

      return;
    }

    // Prepare the request payload
    const payload = {
      document: {
        type: "PLAIN_TEXT",
        content: text,
      },
      encodingType: "UTF8",
    };

    // Make the API request
    const url =
      "url";

    try {
      const responseOfAnalyser = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const sentimentData = responseOfAnalyser.data;
      const documentSentiment = sentimentData.documentSentiment || {};
      const sentimentScore = documentSentiment.score || 0;
      const sentimentCategory = categorizeSentiment(sentimentScore);

      // Calculate the total review score
      const sentimentScoreOutOf5 = sentimentScore * 5;
      const totalReviewScore = 0.6 * userRating + 0.4 * sentimentScoreOutOf5;

      const result = {
        user_rating: userRating,
        sentiment_score: sentimentScoreOutOf5,
        total_review_score: totalReviewScore,
        sentiment_category: sentimentCategory,
        document_sentiment: documentSentiment,
        language: sentimentData.language || "unknown",
        sentences: sentimentData.sentences || [],
      };

      const newReviewsRef = await reviewsRef.add({
        text: text,
        rating: userRating,
        sentiment: result.sentiment_category,
        given_name: given_name,
        family_name: family_name,
        roomNumber: roomNumber,
      });

      return res.status(200).json({ id: newReviewsRef.id });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        error: "Failed to analyze sentiment",
        details: error.response ? error.response.data : error.message,
      });
    }
  });
});

exports.fetchReviews = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      response.set("Access-Control-Allow-Origin", "*");
      response.set("Access-Control-Allow-Methods", "GET, POST");

      const reviewsSnapshot = await reviewsRef.get();

      const reviews = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      console.log("reviews", reviews);
      response.status(200).json(reviews);
    } catch (error) {
      // Error handling
      console.log("error", error);
      return response.status(500).send(error);
    }
  });
});

exports.fetchReviewsForRoom = functions.https.onRequest(
  async (request, response) => {
    cors(request, response, async () => {
      try {
        const { roomNumber } = request.body;

        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET, POST");

        const reviewsSnapshot = await reviewsRef
          .where("roomNumber", "==", roomNumber)
          .get();
        if (reviewsSnapshot.empty) {
          console.log("No matching reviews.");
          return response.status(200).json([]);
        }

        const reviews = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        response.status(200).json(reviews);
      } catch (error) {
        // Error handling
        console.log("error", error);
        return response.status(500).send(error);
      }
    });
  }
);

exports.captureLoginEvent = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { userEmail, loginTime } = req.body;

    if (!userEmail || !loginTime) {
      return res.status(400).send("Missing required fields");
    }

    const bigquery = new BigQuery();

    const rows = [
      {
        user_email: userEmail,
        login_time: loginTime,
      },
    ];

    try {
      await bigquery.dataset("group_25").table("login_events").insert(rows);
      res.status(200).send("Successfully logged login data to BigQuery");
    } catch (error) {
      console.error("Error inserting rows into BigQuery:", error);
      res.status(500).send("Failed to log login data to BigQuery");
    }
  });
});

exports.storeRatingsInBiqQuery = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { rating, given_name, roomNumber, sentiment, text } = req.body;

    if (!rating) {
      return res.status(400).send("Missing required fields");
    }

    const bigquery = new BigQuery();

    const rows = [
      {
        rating: rating,
        given_name: given_name,
        roomNumber: roomNumber,
        sentiment: sentiment,
        text: text,
      },
    ];

    try {
      const response = await bigquery
        .dataset("group_25")
        .table("ratings")
        .insert(rows);
      console.log("response of ratingin big query", response);
      res.status(200).send("Successfully logged ratings to BigQuery");
    } catch (error) {
      console.error("Error inserting rows into BigQuery:", error);
      res.status(500).send("Failed to log ratings data to BigQuery");
    }
  });
});
