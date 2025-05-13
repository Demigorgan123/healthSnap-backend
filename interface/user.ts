interface iSignup{
    name: string,
    email: string,
    passwd: string,
    profilePic?: string
}

interface iLogin{
    email: string,
    passwd: string
}

interface iDecodeUser{
    userId: string,
    email: string
}

interface iUserInput{
    userInput: string
}

interface iHealthLog {
  mood?: 'happy' | 'neutral' | 'stressed' | 'tired' | 'sad' | 'anxious'

  energyLvl?: number

  sleepHours?: number

  steps?: number
  distanceWalked?: number
  running?: number

  caloriesBurned?: number
  heartRate?: number
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  oxygenSaturation?: number
  bloodSugar?: number
  bodyWeight?: number
  waterIntake?: number
}

export {iSignup, iLogin, iDecodeUser, iUserInput, iHealthLog}