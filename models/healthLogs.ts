import mongoose from "mongoose"

const healthLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },

    mood: { type: String, enum: ['happy', 'neutral', 'stressed', 'tired', 'sad'], required: true },
    energyLvl: { type: Number, min: 1, max: 10, required: true },

    sleepHours: Number,
    steps: Number,
    distanceWalked: Number,
    runningDistance: Number,
    caloriesBurned: Number,

    heartRate: Number,
    bloodPressure: {
        systolic: Number,
        diastolic: Number,
    },
    oxygenSaturation: Number,
    bloodSugar: Number,
    bodyWeight: Number,
    waterIntake: Number,
    date: { type: Date, default: Date.now },
});

const healthLogModel = mongoose.model('HealthLogs', healthLogSchema)

export default healthLogModel