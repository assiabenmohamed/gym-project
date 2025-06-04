import { SubscriptionPlan } from "../models/SubscriptionPlan.js";

export async function getPlan(req, res) {
  try {
    const plan = await SubscriptionPlan.find();
    res.json(plan);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in getPlan controller",
    });
  }
}
export async function createPlan(req, res) {
  try {
    const { duration, frequency, accessType, price } = req.body;

    const newPlan = new SubscriptionPlan({
      duration,
      frequency,
      accessType,
      price,
    });

    await newPlan.save();

    res.json({
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in createPlan controller",
    });
  }
}

export async function updatePlan(req, res) {
  try {
    const { id } = req.params;
    const { duration, frequency, accessType, price } = req.body;

    await SubscriptionPlan.findByIdAndUpdate(id, {
      duration,
      frequency,
      accessType,
      price,
    });

    res.json({
      message: "your data has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in updateProduct controller",
    });
  }
}
export async function deletePlan(req, res) {
  try {
    const { id } = req.params;

    await SubscriptionPlan.deleteOne({ _id: id });

    res.json({
      message: "Product has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in deletePlan controller",
    });
  }
}
