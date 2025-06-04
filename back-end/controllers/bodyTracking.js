import { BodyTracking } from "../models/bodyTracking";
import { User } from "../models/users";

export async function getBody(req, res) {
  try {
    const body = await BodyTracking.find();
    res.json(body);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in getPlan controller",
    });
  }
}
export async function createBody(req, res) {
  try {
    const {
      email,
      date,
      weight,
      fatMass,
      muscleMass,
      bonMass,
      visceralFat,
      metabolicRate,
      metabolicAge,
      waterMass,
      note,
    } = req.body;
    const user = await User.findOne({
      email: email,
    });
    id = user._id;
    const newBody = new Body({
      id,
      date,
      weight,
      fatMass,
      muscleMass,
      bonMass,
      visceralFat,
      metabolicRate,
      metabolicAge,
      waterMass,
      note,
    });

    newBody.save();

    res.json({
      message: "Body created successfully",
      body: newBody,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in createBody controller",
    });
  }
}
export async function updateBody(req, res) {
  try {
    const { id } = req.params;
    const {
      firstname,
      lastname,
      date,
      weight,
      fatMass,
      muscleMass,
      bonMass,
      visceralFat,
      metabolicRate,
      metabolicAge,
      waterMass,
      note,
    } = req.body;

    await BodyTracking.findByIdAndUpdate(id, {
      firstname,
      lastname,
      date,
      weight,
      fatMass,
      muscleMass,
      bonMass,
      visceralFat,
      metabolicRate,
      metabolicAge,
      waterMass,
      note,
    });

    res.json({
      message: "your data has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in updateBody controller",
    });
  }
}
export async function deleteBody(req, res) {
  try {
    const { id } = req.params;

    await BodyTracking.deleteOne({ _id: id });

    res.json({
      message: "Product has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error in deleteBody controller",
    });
  }
}
