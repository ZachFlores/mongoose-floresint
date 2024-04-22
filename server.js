const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://nickflores34:P60Ax9XPHtmofN0x@cluster0.grkm6gm.mongodb.net/<dbname>?retryWrites=true&w=majority",)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB Atlas:", error);
  });

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
});

const Review = mongoose.model("Review", reviewSchema);

app.post("/api/reviews", async (req, res) => {
  try {
    const { name, review } = req.body;
    const newReview = new Review({ name, review });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
