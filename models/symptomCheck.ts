import mongoose from "mongoose"

const symptomChecksSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    userInput: {type: String, required: true},
    AIResposne: {type: String, required: true},
    createdAt: { type: Date, default: Date.now }
})

const symptomChecksModel = mongoose.model('SymptomsCheck', symptomChecksSchema)

export default symptomChecksModel