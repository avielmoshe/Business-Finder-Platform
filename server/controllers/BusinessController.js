import Business from "../models/BusinessModel.js";

export const crateNewBusiness = async (req, res) => {
  const { name, description, location, category } = req.body;
  const userId = req.user.id;

  if (!name || !description || !location || !category) {
    return res.status(400).send({ error: "All fields are required" });
  }

  try {
    const planLimits = {
      Standard: 1,
      Gold: 3,
      Platinum: 5,
    };
    const userPlan = req.user.plan || "Standard";
    const businessLimit = planLimits[userPlan];
    const ownedBusinessCount = await Business.countDocuments({ owner: userId });
    if (ownedBusinessCount >= businessLimit) {
      return res.status(403).send({
        error: `Business creation limit reached. Your plan (${userPlan}) allows you to create up to ${businessLimit} businesses.`,
      });
    }

    const newBusiness = new Business({
      owner: userId,
      category,
      name,
      description,
      location,
    });
    const savedBusiness = await newBusiness.save();
    res.status(201).send({
      message: "Business successfully created",
      post: savedBusiness,
    });
  } catch (error) {
    console.error("Error creating Business:", error);
    res.status(500).send({ error: "Server error. Could not create Business." });
  }
};

export const getAllBusiness = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 20;
  const skip = (page - 1) * limit;
  try {
    const BusinessData = await Business.find()
      .skip(skip)
      .limit(limit)
      .populate("reviews", "userId comment createdAt")
      .sort({ createdAt: -1 });

    const totalBusinesses = await Business.countDocuments(); // Get total count of businesses
    const totalPages = Math.ceil(totalBusinesses / limit);

    if (BusinessData.length === 0) {
      return res
        .status(404)
        .send({ message: "No Business found matching the criteria" });
    }

    res.status(200).send({
      message: "Businesses retrieved successfully",
      currentPage: parseInt(page, 10),
      totalPages,
      totalBusinesses,
      BusinessData,
    });
  } catch (error) {
    console.error("Error fetching Business:", error);
    res.status(500).send({ error: "Server error. Could not fetch Business." });
  }
};

export const getFilteredBusiness = async (req, res) => {
  try {
    const { subscribers, category, location, description, name } = req.query;

    const query = {};

    // Filter by the number of subscribers
    if (subscribers) {
      const subscriberCounts = subscribers.split(",").map(Number); // Convert to an array of numbers
      query.subscribers = { $size: subscriberCounts[0] }; // Filter by array size (only supports one size at a time)
    }

    // Filter by category
    if (category) {
      query.category = { $in: category.split(",") };
    }

    // Filter by location
    if (location) {
      query.location = { $in: location.split(",") };
    }

    // Filter by description (case-insensitive partial match)
    if (description) {
      query.description = { $regex: description, $options: "i" };
    }

    // Filter by name (case-insensitive partial match)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Fetch the filtered businesses with populated reviews
    const FilteredBusiness = await Business.find(query).populate(
      "reviews.userId",
      "username email"
    );

    // Check if any businesses were found
    if (FilteredBusiness.length === 0) {
      return res.status(404).json({
        message: "No businesses found matching the criteria",
      });
    }

    res.status(200).json({
      message: "Filtered Business retrieved successfully",
      FilteredBusiness,
    });
  } catch (error) {
    console.error("Error retrieving Business:", error);
    res.status(500).json({
      error: "Server error. Could not retrieve Business.",
    });
  }
};

export const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const BusinessById = await Business.findById(id).populate(
      "reviews",
      "userId comment createdAt"
    );
    if (!BusinessById) {
      return res
        .status(404)
        .send({ error: "Business not found pls add new Business" });
    }
    res.status(200).send(BusinessById);
  } catch (error) {
    console.error("Error finding postById by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBusinessByUser = async (req, res) => {
  try {
    const id = req.user.id;
    const BusinessByUser = await Business.find({ owner: id }).populate(
      "reviews",
      "userId comment createdAt"
    );
    if (!BusinessByUser) {
      return res
        .status(404)
        .send({ error: "Business not found pls add new Business" });
    }
    res.status(200).send(BusinessByUser);
  } catch (error) {
    console.error("Error finding postById by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBusinessById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const BusinessById = await Business.findById(id);
  if (!BusinessById) {
    return res.status(404).send({ error: "Business not found" });
  }
  if (userId === BusinessById.owner.toString()) {
    try {
      const deleteBusiness = await Business.findByIdAndDelete(id);
      res.status(200).send({
        message: "Business deleted successfully",
        deleteBusiness,
      });
    } catch (error) {
      console.error("Error finding Business by ID:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else
    res.status(400).send({
      status: "failed",
      mes: "only user that created the Business can delete him",
    });
};

export const updateBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { name, description, category, location } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this business" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (location) updates.location = location;

    updates.updatedAt = Date.now();

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("Error updating business:", error);
    res.status(500).json({ error: "Server error. Could not update business." });
  }
};

export const createReview = async (req, res) => {
  try {
    const { businessId } = req.params; // Business ID from the URL parameter
    const { comment } = req.body; // Review comment from the request body
    const userId = req.user.id; // Get the authenticated user's ID

    // Check if the business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Create a new review object
    const newReview = {
      userId,
      comment,
      createdAt: Date.now(),
    };

    // Add the new review to the business's reviews array
    business.reviews.push(newReview);

    // Save the business with the new review
    await business.save();

    res.status(201).json({
      message: "Review added successfully",
      reviews: business.reviews,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Server error. Could not add review." });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { businessId, reviewId } = req.params;
    const userId = req.user.id;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const reviewIndex = business.reviews.findIndex(
      (review) =>
        review._id.toString() === reviewId &&
        review.userId.toString() === userId
    );

    if (reviewIndex === -1) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    business.reviews.splice(reviewIndex, 1);

    await business.save();

    res.status(200).json({
      message: "Review deleted successfully",
      reviews: business.reviews,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Server error. Could not delete review." });
  }
};
