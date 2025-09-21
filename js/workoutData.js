const WORKOUT_TEMPLATES = [
  // ===== MUSCLE GROUP FOCUS WORKOUTS =====

  // Chest Focus Workouts
  {
    id: "chest-mass",
    name: "Chest Focus - Mass Building",
    muscles: ["Chest", "Arms", "Shoulders"],
    exercises: [
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Incline Barbell Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link: "" },
      { name:"Weighted Dips", muscle:"Chest", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Cable Flyes", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Decline Push-ups", muscle:"Chest", defaultSets:2, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/decline-push-up" }
    ]
  },
  {
    id: "chest-definition",
    name: "Chest Focus - Definition & Shape",
    muscles: ["Chest", "Arms", "Shoulders"],
    exercises: [
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Flat Dumbbell Press", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-bench-press" },
      { name:"Incline Cable Flyes", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Dips", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Cable Crossover", muscle:"Chest", defaultSets:3, defaultReps:15, exercise_link: "" },
      { name:"Push-ups", muscle:"Chest", defaultSets:2, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/push-up" }
    ]
  },
  {
    id: "chest-beginner",
    name: "Chest - Beginner",
    muscles: ["Chest", "Arms"],
    exercises: [
      { name:"Push-ups", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/push-up", met:7 },
      { name:"Incline Push-ups", muscle:"Chest", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/incline-push-up", met:7 },
      { name:"Knee Push-ups", muscle:"Chest", defaultSets:2, defaultReps:12, exercise_link: "", met:6 },
      { name:"Dumbbell Floor Press", muscle:"Chest", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-floor-press", met:6 },
      { name:"Machine Chest Press", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/machine-chest-press", met:5 },
      { name:"Cable Chest Press", muscle:"Chest", defaultSets:2, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-chest-press", met:5 }
    ]
  },
  {
    id: "chest-intermediate",
    name: "Chest - Intermediate",
    muscles: ["Chest", "Arms", "Shoulders"],
    exercises: [
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press", met:6 },
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press", met:6 },
      { name:"Dips", muscle:"Chest", defaultSets:3, defaultReps:10, exercise_link: "", met:7 },
      { name:"Cable Flyes", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Push-ups", muscle:"Chest", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/push-up", met:7 },
      { name:"Incline Cable Flyes", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link: "", met:4 }
    ]
  },
  {
    id: "chest-advanced",
    name: "Chest - Advanced",
    muscles: ["Chest", "Arms", "Shoulders"],
    exercises: [
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:5, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press", met:6 },
      { name:"Incline Barbell Press", muscle:"Chest", defaultSets:4, defaultReps:6, exercise_link: "", met:6 },
      { name:"Weighted Dips", muscle:"Chest", defaultSets:4, defaultReps:8, exercise_link: "", met:7 },
      { name:"Decline Bench Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link: "", met:6 },
      { name:"Cable Flyes", muscle:"Chest", defaultSets:4, defaultReps:12, exercise_link: "", met:4 },
      { name:"Pec Deck Machine", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link: "", met:4 }
    ]
  },

  // Back Focus Workouts
  {
    id: "back-width",
    name: "Back Focus - Width & V-Taper",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Wide Grip Pull-ups", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link: "" },
      { name:"Wide Grip Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"T-Bar Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Straight Arm Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Close Grip Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Cable Pullovers", muscle:"Back", defaultSets:3, defaultReps:15, exercise_link: "" }
    ]
  },
  {
    id: "back-thickness",
    name: "Back Focus - Thickness & Density",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Deadlift", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link: "" },
      { name:"Barbell Rows", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row" },
      { name:"Chest Supported Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Dumbbell Shrugs", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-shrug" },
      { name:"Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link: "" }
    ]
  },
  {
    id: "back-beginner",
    name: "Back - Beginner",
    muscles: ["Back", "Arms"],
    exercises: [
      { name:"Assisted Pull-ups", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link:"", met:6 },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Single Arm Dumbbell Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Face Pulls", muscle:"Back", defaultSets:2, defaultReps:12, exercise_link: "", met:4 },
      { name:"Superman", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/superman", met:4 }
    ]
  },
  {
    id: "back-intermediate",
    name: "Back - Intermediate",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Pull-ups", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link: "", met:8 },
      { name:"Barbell Rows", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row", met:5 },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Face Pulls", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Straight Arm Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "", met:4 }
    ]
  },
  {
    id: "back-advanced",
    name: "Back - Advanced",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Deadlift", muscle:"Back", defaultSets:5, defaultReps:5, exercise_link: "", met:6 },
      { name:"Weighted Pull-ups", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link: "", met:8 },
      { name:"Barbell Rows", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row", met:5 },
      { name:"T-Bar Row", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link: "", met:5 },
      { name:"Wide Grip Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Shrugs", muscle:"Back", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-shrug", met:4 }
    ]
  },

  // Shoulder Focus Workouts
  {
    id: "shoulders-mass",
    name: "Shoulder Focus - Mass & Strength",
    muscles: ["Shoulders", "Arms", "Chest"],
    exercises: [
      { name:"Standing Barbell Press", muscle:"Shoulders", defaultSets:4, defaultReps:6, exercise_link: "" },
      { name:"Seated Dumbbell Press", muscle:"Shoulders", defaultSets:3, defaultReps:8, exercise_link: "" },
      { name:"Dumbbell Lateral Raises", muscle:"Shoulders", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise" },
      { name:"Bent-Over Rear Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Upright Rows", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-upright-row" },
      { name:"Front Raises", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-front-raise" }
    ]
  },
  {
    id: "shoulders-definition",
    name: "Shoulder Focus - Definition & Conditioning",
    muscles: ["Shoulders", "Arms", "Chest"],
    exercises: [
      { name:"Arnold Press", muscle:"Shoulders", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-arnold-press" },
      { name:"Cable Lateral Raises", muscle:"Shoulders", defaultSets:4, defaultReps:15, exercise_link: "" },
      { name:"Reverse Cable Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link: "" },
      { name:"Pike Push-ups", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Cable Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:20, exercise_link: "" },
      { name:"Handstand Push-ups", muscle:"Shoulders", defaultSets:2, defaultReps:5, exercise_link: "" }
    ]
  },
  {
    id: "shoulders-beginner",
    name: "Shoulders - Beginner",
    muscles: ["Shoulders", "Arms"],
    exercises: [
      { name:"Seated Dumbbell Press", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Lateral Raises", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise", met:4 },
      { name:"Front Raises", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-front-raise", met:4 },
      { name:"Rear Delt Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Arnold Press", muscle:"Shoulders", defaultSets:2, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-arnold-press", met:5 },
      { name:"Machine Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/machine-shoulder-press", met:5 }
    ]
  },
  {
    id: "shoulders-intermediate",
    name: "Shoulders - Intermediate",
    muscles: ["Shoulders", "Arms"],
    exercises: [
      { name:"Seated Dumbbell Press", muscle:"Shoulders", defaultSets:4, defaultReps:10, exercise_link: "", met:5 },
      { name:"Lateral Raises", muscle:"Shoulders", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise", met:4 },
      { name:"Arnold Press", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-arnold-press", met:5 },
      { name:"Rear Delt Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Upright Rows", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-upright-row", met:5 },
      { name:"Cable Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link: "", met:4 }
    ]
  },
  {
    id: "shoulders-advanced",
    name: "Shoulders - Advanced",
    muscles: ["Shoulders", "Arms"],
    exercises: [
      { name:"Standing Barbell Press", muscle:"Shoulders", defaultSets:5, defaultReps:5, exercise_link: "", met:5 },
      { name:"Seated Dumbbell Press", muscle:"Shoulders", defaultSets:4, defaultReps:8, exercise_link: "", met:5 },
      { name:"Lateral Raises", muscle:"Shoulders", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise", met:4 },
      { name:"Rear Delt Flyes", muscle:"Shoulders", defaultSets:4, defaultReps:12, exercise_link: "", met:4 },
      { name:"Upright Rows", muscle:"Shoulders", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-upright-row", met:5 },
      { name:"Pike Push-ups", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "", met:7 }
    ]
  },

  // Arms Focus Workouts
  {
    id: "arms-mass",
    name: "Arms Focus - Mass & Size",
    muscles: ["Arms", "Shoulders", "Chest"],
    exercises: [
      { name:"Close Grip Bench Press", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-close-grip-bench-press" },
      { name:"Barbell Curls", muscle:"Arms", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-curl" },
      { name:"Weighted Dips", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Preacher Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-preacher-curl" },
      { name:"Overhead Tricep Extension", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension" },
      { name:"Hammer Curls", muscle:"Arms", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/dumbbell-hammer-curl" }
    ]
  },
  {
    id: "arms-definition",
    name: "Arms Focus - Definition & Conditioning",
    muscles: ["Arms", "Shoulders", "Chest"],
    exercises: [
      { name:"Diamond Push-ups", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Cable Bicep Curls", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link: "" },
      { name:"Tricep Pushdowns", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link: "" },
      { name:"Concentration Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-concentration-curl" },
      { name:"Cable Tricep Extensions", muscle:"Arms", defaultSets:3, defaultReps:15, exercise_link: "" },
      { name:"21s Bicep Curls", muscle:"Arms", defaultSets:2, defaultReps:21, exercise_link:"https://musclewiki.com/exercise/barbell-curl" }
    ]
  },
  {
    id: "biceps-beginner",
    name: "Biceps - Beginner",
    muscles: ["Arms"],
    exercises: [
      { name:"Dumbbell Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-curl", met:4 },
      { name:"Hammer Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-hammer-curl", met:4 },
      { name:"Cable Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Preacher Curls", muscle:"Arms", defaultSets:2, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-preacher-curl", met:4 },
      { name:"Concentration Curls", muscle:"Arms", defaultSets:2, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-concentration-curl", met:4 },
      { name:"Barbell Curls", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-curl", met:4 }
    ]
  },
  {
    id: "biceps-intermediate",
    name: "Biceps - Intermediate",
    muscles: ["Arms"],
    exercises: [
      { name:"Barbell Curls", muscle:"Arms", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-curl", met:4 },
      { name:"Preacher Curls", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-preacher-curl", met:4 },
      { name:"Hammer Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-hammer-curl", met:4 },
      { name:"Cable Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Concentration Curls", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-concentration-curl", met:4 },
      { name:"Incline Dumbbell Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "", met:4 }
    ]
  },
  {
    id: "biceps-advanced",
    name: "Biceps - Advanced",
    muscles: ["Arms"],
    exercises: [
      { name:"Barbell Curls", muscle:"Arms", defaultSets:5, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-curl", met:4 },
      { name:"Preacher Curls", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-preacher-curl", met:4 },
      { name:"Hammer Curls", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-hammer-curl", met:4 },
      { name:"Cable Curls", muscle:"Arms", defaultSets:4, defaultReps:10, exercise_link: "", met:4 },
      { name:"21s Bicep Curls", muscle:"Arms", defaultSets:3, defaultReps:21, exercise_link:"https://musclewiki.com/exercise/barbell-curl", met:4 },
      { name:"Incline Dumbbell Curls", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link: "", met:4 }
    ]
  },
  {
    id: "triceps-beginner",
    name: "Triceps - Beginner",
    muscles: ["Arms"],
    exercises: [
      { name:"Tricep Pushdowns", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Overhead Tricep Extension", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension", met:4 },
      { name:"Close Grip Push-ups", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link: "", met:7 },
      { name:"Tricep Dips", muscle:"Arms", defaultSets:2, defaultReps:10, exercise_link: "", met:7 },
      { name:"Cable Overhead Extension", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "", met:4 },
      { name:"Kickbacks", muscle:"Arms", defaultSets:2, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-tricep-kickback", met:4 }
    ]
  },
  {
    id: "triceps-intermediate",
    name: "Triceps - Intermediate",
    muscles: ["Arms"],
    exercises: [
      { name:"Close Grip Bench Press", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-close-grip-bench-press", met:6 },
      { name:"Overhead Tricep Extension", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension", met:4 },
      { name:"Tricep Pushdowns", muscle:"Arms", defaultSets:4, defaultReps:12, exercise_link: "", met:4 },
      { name:"Dips", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link: "", met:7 },
      { name:"Skull Crushers", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Cable Overhead Extension", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "", met:4 }
    ]
  },
  {
    id: "triceps-advanced",
    name: "Triceps - Advanced",
    muscles: ["Arms"],
    exercises: [
      { name:"Close Grip Bench Press", muscle:"Arms", defaultSets:5, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-close-grip-bench-press", met:6 },
      { name:"Weighted Dips", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link: "", met:7 },
      { name:"Overhead Tricep Extension", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension", met:4 },
      { name:"Tricep Pushdowns", muscle:"Arms", defaultSets:4, defaultReps:10, exercise_link: "", met:4 },
      { name:"Skull Crushers", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link: "", met:5 },
      { name:"Cable Kickbacks", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-tricep-kickback", met:4 }
    ]
  },

  // Legs Focus Workouts
  {
    id: "legs-beginner",
    name: "Legs - Beginner",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Bodyweight Squat", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/bodyweight-squat", met:5 },
      { name:"Goblet Squat", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat", met:5 },
      { name:"Walking Lunges", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Step-ups", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-step-up", met:6 },
      { name:"Glute Bridges", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/glute-bridge", met:4 },
      { name:"Calf Raises", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link: "", met:4 }
    ]
  },
  {
    id: "legs-intermediate",
    name: "Legs - Intermediate",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-squat", met:5 },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift", met:5 },
      { name:"Walking Lunges", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link: "", met:5 },
      { name:"Bulgarian Split Squat", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat", met:5 },
      { name:"Leg Press", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/machine-leg-press", met:4 },
      { name:"Calf Raises", muscle:"Legs", defaultSets:4, defaultReps:15, exercise_link: "", met:4 }
    ]
  },
  {
    id: "legs-advanced",
    name: "Legs - Advanced",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:5, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-squat", met:5 },
      { name:"Front Squat", muscle:"Legs", defaultSets:4, defaultReps:6, exercise_link: "", met:5 },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift", met:5 },
      { name:"Bulgarian Split Squat", muscle:"Legs", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat", met:5 },
      { name:"Walking Lunges", muscle:"Legs", defaultSets:4, defaultReps:10, exercise_link: "", met:5 },
      { name:"Single Leg Calf Raise", muscle:"Legs", defaultSets:4, defaultReps:12, exercise_link: "", met:4 }
    ]
  },

  // Core Focus Workouts
  {
    id: "core-beginner",
    name: "Core - Beginner",
    muscles: ["Core"],
    exercises: [
      { name:"Plank", muscle:"Core", defaultSets:3, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/plank", met:4 },
      { name:"Bird Dog", muscle:"Core", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/bird-dog", met:3 },
      { name:"Dead Bug", muscle:"Core", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dead-bug", met:3 },
      { name:"Glute Bridges", muscle:"Core", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/glute-bridge", met:4 },
      { name:"Superman", muscle:"Core", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/superman", met:4 },
      { name:"Russian Twists", muscle:"Core", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/russian-twist", met:4 }
    ]
  },
  {
    id: "core-intermediate",
    name: "Core - Intermediate",
    muscles: ["Core"],
    exercises: [
      { name:"Plank", muscle:"Core", defaultSets:4, defaultReps:45, exercise_link:"https://musclewiki.com/exercise/plank", met:4 },
      { name:"Russian Twists", muscle:"Core", defaultSets:4, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/russian-twist", met:4 },
      { name:"Leg Raises", muscle:"Core", defaultSets:3, defaultReps:15, exercise_link: "", met:4 },
      { name:"Bicycle Crunches", muscle:"Core", defaultSets:3, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/bicycle-crunch", met:4 },
      { name:"Mountain Climbers", muscle:"Core", defaultSets:3, defaultReps:30, exercise_link:"https://musclewiki.com/exercise/mountain-climber", met:8 },
      { name:"Flutter Kicks", muscle:"Core", defaultSets:3, defaultReps:30, exercise_link: "", met:4 }
    ]
  },
  {
    id: "core-advanced",
    name: "Core - Advanced",
    muscles: ["Core"],
    exercises: [
      { name:"Plank", muscle:"Core", defaultSets:5, defaultReps:90, exercise_link:"https://musclewiki.com/exercise/plank", met:4 },
      { name:"Hollow Body Hold", muscle:"Core", defaultSets:4, defaultReps:30, exercise_link: "", met:4 },
      { name:"L-Sit", muscle:"Core", defaultSets:3, defaultReps:20, exercise_link: "", met:5 },
      { name:"Dragon Flags", muscle:"Core", defaultSets:3, defaultReps:8, exercise_link: "", met:6 },
      { name:"V-ups", muscle:"Core", defaultSets:3, defaultReps:15, exercise_link: "", met:5 },
      { name:"Windshield Wipers", muscle:"Core", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/windshield-wiper", met:5 }
    ]
  },
  {
    id: "core-strength",
    name: "Core Strength & Stability",
    muscles: ["Core", "Back"],
    exercises: [
      { name:"Plank", muscle:"Core", defaultSets:4, defaultReps:60, exercise_link:"https://musclewiki.com/exercise/plank", met:4 },
      { name:"Dead Bug", muscle:"Core", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dead-bug", met:3 },
      { name:"Bird Dog", muscle:"Core", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/bird-dog", met:3 },
      { name:"Hollow Body Hold", muscle:"Core", defaultSets:3, defaultReps:30, exercise_link: "", met:4 },
      { name:"Superman", muscle:"Back", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/superman", met:4 },
      { name:"Russian Twists", muscle:"Core", defaultSets:3, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/russian-twist", met:4 }
    ]
  },

  // ===== SPLIT ROUTINE WORKOUTS =====

  // Push Day Workouts
  {
    id: "push-strength",
    name: "Push Day - Strength Focus",
    muscles: ["Chest", "Shoulders", "Arms"],
    exercises: [
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press", met:6 },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:6, exercise_link:"", met:5 },
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press", met:6 },
      { name:"Dumbbell Lateral Raise", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise", met:4 },
      { name:"Close Grip Bench Press", muscle:"Arms", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-close-grip-bench-press", met:6 },
      { name:"Overhead Triceps Extension", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension", met:4 }
    ]
  },
  // Pull Day Workouts
  {
    id: "pull-strength",
    name: "Pull Day - Strength Focus",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Deadlift", muscle:"Back", defaultSets:4, defaultReps:5, exercise_link: "", met:6 },
      { name:"Weighted Pull-ups", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link: "", met:8 },
      { name:"Barbell Rows", muscle:"Back", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row", met:5 },
      { name:"Chest Supported Row", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link: "", met:5 },
      { name:"Barbell Curl", muscle:"Arms", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-curl", met:4 },
      { name:"Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "", met:4 }
    ]
  },
  {
    id: "pull-hypertrophy",
    name: "Pull Day - Hypertrophy Focus",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Pull-ups", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link: "" },
      { name:"Pendlay Rows", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-pronated-pendlay-row" },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Bent-Over Dumbbell Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Preacher Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-preacher-curl" },
      { name:"Hammer Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-hammer-curl" }
    ]
  },
  {
    id: "pull-volume",
    name: "Pull Day - High Volume",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Conventional Deadlift", muscle:"Back", defaultSets:3, defaultReps:6, exercise_link: "" },
      { name:"Chin-ups", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link: "" },
      { name:"T-Bar Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Wide Grip Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Cable Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link: "" },
      { name:"Dumbbell Curls", muscle:"Arms", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-curl" },
      { name:"Cable Hammer Curls", muscle:"Arms", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-rope-hammer-curl" }
    ]
  },

  // Push Day Workouts
  // Legs Day Workouts
  {
    id: "legs-functional",
    name: "Leg Day - Functional & Athletic",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Goblet Squat", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat" },
      { name:"Single Leg Deadlift", muscle:"Legs", defaultSets:3, defaultReps:8, exercise_link: "" },
      { name:"Reverse Lunges", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Step-ups", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-step-up" },
      { name:"Sumo Squat", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Curtsy Lunge", muscle:"Legs", defaultSets:2, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Calf Raise Hold", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link: "" }
    ]
  },
  // Full Body Workouts
  {
    id: "full-body-strength",
    name: "Full Body - Strength Focus",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-squat" },
      { name:"Bench Press", muscle:"Chest", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Barbell Row", muscle:"Back", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row" },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:8, exercise_link: "" },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift" },
      { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link: "" }
    ]
  },
  {
    id: "full-body-hypertrophy",
    name: "Full Body - Hypertrophy Focus",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Front Squats", muscle:"Legs", defaultSets:4, defaultReps:10, exercise_link: "" },
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Chest-Supported Row", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Seated Leg Curls", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/machine-seated-leg-curl" },
      { name:"Dumbbell Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "" }
    ]
  },
  {
    id: "full-body-athletic",
    name: "Full Body - Power & Conditioning",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Deadlifts", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link: "" },
      { name:"Push Press", muscle:"Shoulders", defaultSets:3, defaultReps:8, exercise_link: "" },
      { name:"Bulgarian Split Squats", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat" },
      { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Kettlebell Swings", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/kettlebell-swing" },
      { name:"Dumbbell Thrusters", muscle:"Full Body", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-thruster" }
    ]
  },
  {
    id: "full-body-beginner",
    name: "Full Body - Beginner Friendly",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Goblet Squat", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat" },
      { name:"Push-ups", muscle:"Chest", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/push-up" },
      { name:"Dumbbell Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Dumbbell Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Reverse Lunges", muscle:"Legs", defaultSets:2, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Plank", muscle:"Core", defaultSets:3, defaultReps:30, exercise_link:"https://musclewiki.com/exercise/plank" }
    ]
  },
  // Upper Body Workouts
  {
    id: "upper-strength",
    name: "Upper Body - Strength Focus",
    muscles: ["Chest", "Back", "Shoulders", "Arms"],
    exercises: [
      { name:"Bench Press", muscle:"Chest", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Weighted Pull-ups", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link: "" },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:6, exercise_link: "" },
      { name:"Barbell Rows", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row" },
      { name:"Close Grip Bench Press", muscle:"Arms", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-close-grip-bench-press" },
      { name:"Barbell Curl", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-curl" }
    ]
  },
  {
    id: "upper-hypertrophy",
    name: "Upper Body - Hypertrophy Focus",
    muscles: ["Chest", "Back", "Shoulders", "Arms"],
    exercises: [
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Dumbbell Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Dips", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Preacher Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-preacher-curl" },
      { name:"Lateral Raises", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise" }
    ]
  },
  {
    id: "upper-volume",
    name: "Upper Body - High Volume",
    muscles: ["Chest", "Back", "Shoulders", "Arms"],
    exercises: [
      { name:"Flat Dumbbell Press", muscle:"Chest", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-bench-press" },
      { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Arnold Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-arnold-press" },
      { name:"T-Bar Row", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Incline Chest Flyes", muscle:"Chest", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-chest-fly" },
      { name:"Cable Tricep Pushdowns", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link: "" },
      { name:"Cable Hammer Curls", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-rope-hammer-curl" }
    ]
  },
  // Lower Body Workouts
  {
    id: "lower-strength",
    name: "Lower Body - Strength Focus",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-squat" },
      { name:"Conventional Deadlift", muscle:"Legs", defaultSets:3, defaultReps:5, exercise_link: "" },
      { name:"Front Squat", muscle:"Legs", defaultSets:3, defaultReps:6, exercise_link: "" },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift" },
      { name:"Bulgarian Split Squat", muscle:"Legs", defaultSets:2, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat" },
      { name:"Standing Calf Raise", muscle:"Legs", defaultSets:4, defaultReps:12, exercise_link: "" }
    ]
  },
  {
    id: "lower-hypertrophy",
    name: "Lower Body - Hypertrophy Focus",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-squat" },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift" },
      { name:"Walking Lunges", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link: "" },
      { name:"Leg Press", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/machine-leg-press" },
      { name:"Hamstring Curl", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/machine-seated-leg-curl" },
      { name:"Leg Extension", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/machine-leg-extension" },
      { name:"Seated Calf Raise", muscle:"Legs", defaultSets:4, defaultReps:18, exercise_link: "" }
    ]
  },
  {
    id: "lower-functional",
    name: "Lower Body - Functional Training",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Goblet Squat", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat" },
      { name:"Single Leg Deadlift", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link: "" },
      { name:"Reverse Lunges", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Step-ups", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-step-up" },
      { name:"Lateral Lunges", muscle:"Legs", defaultSets:2, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Cossack Squat", muscle:"Legs", defaultSets:2, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat" },
      { name:"Single Leg Calf Raise", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link: "" }
    ]
  },
  // Specialized Workouts
  {
    id: "bodyweight-only",
    name: "Bodyweight Only - No Equipment",
    muscles: ["Full Body", "Chest", "Back", "Legs", "Core"],
    exercises: [
      { name:"Push-ups", muscle:"Chest", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/push-up", met:7 },
      { name:"Diamond Push-ups", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link: "", met:8 },
      { name:"Pull-ups", muscle:"Back", defaultSets:4, defaultReps:10, exercise_link: "", met:8 },
      { name:"Bodyweight Squat", muscle:"Legs", defaultSets:4, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/bodyweight-squat", met:5 },
      { name:"Walking Lunges", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link: "", met:5 },
      { name:"Plank", muscle:"Core", defaultSets:4, defaultReps:60, exercise_link:"https://musclewiki.com/exercise/plank", met:4 }
    ]
  },
  {
    id: "home-workout",
    name: "Home Workout - Minimal Equipment",
    muscles: ["Full Body", "Legs", "Chest", "Back", "Core"],
    exercises: [
      { name:"Goblet Squat", muscle:"Legs", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat", met:5 },
      { name:"Push-ups", muscle:"Chest", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/push-up", met:7 },
      { name:"Dumbbell Row", muscle:"Back", defaultSets:4, defaultReps:12, exercise_link: "", met:5 },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-overhead-press", met:5 },
      { name:"Glute Bridges", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/glute-bridge", met:4 },
      { name:"Plank", muscle:"Core", defaultSets:3, defaultReps:45, exercise_link:"https://musclewiki.com/exercise/plank", met:4 }
    ]
  },
  {
    id: "strength-endurance",
    name: "Strength & Endurance Mix",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press", met:6 },
      { name:"Barbell Squat", muscle:"Legs", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-squat", met:5 },
      { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link: "", met:8 },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link: "", met:5 },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift", met:5 },
      { name:"Plank", muscle:"Core", defaultSets:3, defaultReps:60, exercise_link:"https://musclewiki.com/exercise/plank", met:4 }
    ]
  },
];

// Comprehensive exercise database with all possible exercises
const COMPREHENSIVE_EXERCISES = [
  // Chest Exercises
  { name: "Barbell Bench Press", muscle: "Chest", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-bench-press", met: 6 },
  { name: "Dumbbell Bench Press", muscle: "Chest", defaultSets: 4, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-bench-press", met: 6 },
  { name: "Incline Bench Press", muscle: "Chest", defaultSets: 4, defaultReps: 8, exercise_link: "", met: 6 },
  { name: "Incline Dumbbell Press", muscle: "Chest", defaultSets: 4, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-incline-bench-press", met: 6 },
  { name: "Decline Bench Press", muscle: "Chest", defaultSets: 3, defaultReps: 8, exercise_link: "", met: 6 },
  { name: "Chest Flyes", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
  { name: "Cable Flyes", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
  { name: "Pec Deck Machine", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
  { name: "Push-ups", muscle: "Chest", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/push-up", met: 7 },
  { name: "Diamond Push-ups", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 8 },
  { name: "Dips", muscle: "Chest", defaultSets: 3, defaultReps: 10, exercise_link: "", met: 7 },
  { name: "Weighted Dips", muscle: "Chest", defaultSets: 3, defaultReps: 8, exercise_link: "", met: 7 },

 // Back Exercises
 { name: "Deadlift", muscle: "Back", defaultSets: 4, defaultReps: 6, exercise_link: "", met: 6 },
 { name: "Romanian Deadlift", muscle: "Back", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-romanian-deadlift", met: 5 },
 { name: "Pull-ups", muscle: "Back", defaultSets: 4, defaultReps: 8, exercise_link: "", met: 8 },
 { name: "Chin-ups", muscle: "Back", defaultSets: 4, defaultReps: 8, exercise_link: "", met: 8 },
 { name: "Weighted Pull-ups", muscle: "Back", defaultSets: 4, defaultReps: 6, exercise_link: "", met: 8 },
 { name: "Lat Pulldown", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "", met: 5 },
 { name: "Seated Cable Row", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "", met: 5 },
 { name: "Bent-Over Row", muscle: "Back", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-bent-over-row", met: 5 },
 { name: "T-Bar Row", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "", met: 5 },
 { name: "Single Arm Dumbbell Row", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "", met: 5 },
 { name: "Face Pulls", muscle: "Back", defaultSets: 3, defaultReps: 15, exercise_link: "", met: 4 },
 { name: "Straight Arm Pulldown", muscle: "Back", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
 { name: "Shrugs", muscle: "Back", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-shrug", met: 4 },

 // Shoulder Exercises
 { name: "Overhead Press", muscle: "Shoulders", defaultSets: 4, defaultReps: 8, exercise_link: "" },
 { name: "Seated Dumbbell Press", muscle: "Shoulders", defaultSets: 4, defaultReps: 10, exercise_link: "" },
 { name: "Arnold Press", muscle: "Shoulders", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-arnold-press" },
 { name: "Lateral Raises", muscle: "Shoulders", defaultSets: 4, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-lateral-raise" },
 { name: "Front Raises", muscle: "Shoulders", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-front-raise" },
 { name: "Rear Delt Flyes", muscle: "Shoulders", defaultSets: 3, defaultReps: 12, exercise_link: "" },
 { name: "Upright Rows", muscle: "Shoulders", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/barbell-upright-row" },
 { name: "Cable Lateral Raises", muscle: "Shoulders", defaultSets: 3, defaultReps: 15, exercise_link: "" },
 { name: "Face Pulls", muscle: "Shoulders", defaultSets: 3, defaultReps: 15, exercise_link: "" },

 // Arm Exercises
 { name: "Barbell Curl", muscle: "Arms", defaultSets: 4, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/barbell-curl" },
 { name: "Dumbbell Curl", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-curl" },
 { name: "Hammer Curls", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-hammer-curl" },
 { name: "Preacher Curls", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-preacher-curl" },
 { name: "Concentration Curls", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-concentration-curl" },
 { name: "Tricep Dips", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "" },
 { name: "Close Grip Bench Press", muscle: "Arms", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-close-grip-bench-press" },
 { name: "Overhead Tricep Extension", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension" },
 { name: "Tricep Pushdowns", muscle: "Arms", defaultSets: 4, defaultReps: 15, exercise_link: "" },
 { name: "Skull Crushers", muscle: "Arms", defaultSets: 3, defaultReps: 10, exercise_link: "" },

 // Leg Exercises
 { name: "Back Squat", muscle: "Legs", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-squat", met: 5 },
 { name: "Front Squat", muscle: "Legs", defaultSets: 4, defaultReps: 8, exercise_link: "", met: 5 },
 { name: "Goblet Squat", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-goblet-squat", met: 5 },
 { name: "Bulgarian Split Squat", muscle: "Legs", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat", met: 5 },
 { name: "Lunges", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 5 },
 { name: "Walking Lunges", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 5 },
 { name: "Step-ups", muscle: "Legs", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-step-up", met: 6 },
 { name: "Leg Press", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/machine-leg-press", met: 4 },
 { name: "Leg Extension", muscle: "Legs", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/machine-leg-extension", met: 4 },
 { name: "Leg Curl", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/machine-seated-leg-curl", met: 4 },
 { name: "Calf Raises", muscle: "Legs", defaultSets: 4, defaultReps: 15, exercise_link: "", met: 4 },
 { name: "Seated Calf Raises", muscle: "Legs", defaultSets: 4, defaultReps: 15, exercise_link: "", met: 4 },

 // Core Exercises
 { name: "Plank", muscle: "Core", defaultSets: 3, defaultReps: 60, exercise_link: "https://musclewiki.com/exercise/plank", trackingType: "time_distance" },
 { name: "Russian Twists", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/russian-twist" },
 { name: "Bicycle Crunches", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/bicycle-crunch" },
 { name: "Crunches", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/crunch" },
 { name: "Sit-ups", muscle: "Core", defaultSets: 3, defaultReps: 15, exercise_link: "" },
 { name: "Leg Raises", muscle: "Core", defaultSets: 3, defaultReps: 15, exercise_link: "" },
 { name: "Flutter Kicks", muscle: "Core", defaultSets: 3, defaultReps: 30, exercise_link: "" },
 { name: "Mountain Climbers", muscle: "Core", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/mountain-climber" },
 { name: "Dead Bug", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dead-bug" },
 { name: "Bird Dog", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/bird-dog" },
 { name: "Hollow Body Hold", muscle: "Core", defaultSets: 3, defaultReps: 30, exercise_link: "" },
 { name: "V-ups", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "" },
 { name: "Reverse Crunches", muscle: "Core", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/reverse-crunch" },
 { name: "Heel Touches", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "" },
 { name: "Spiderman Crunches", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "" },
 { name: "Jackknife Sit-ups", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "" },

 // Full Body Exercises
 { name: "Burpees", muscle: "Full Body", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/burpee" },
 { name: "Thrusters", muscle: "Full Body", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-thruster" },
 { name: "Clean and Press", muscle: "Full Body", defaultSets: 3, defaultReps: 8, exercise_link: "" },
 { name: "Kettlebell Swings", muscle: "Full Body", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/kettlebell-swing" },
 { name: "Box Jumps", muscle: "Full Body", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/box-jump" },
 { name: "Farmer's Walk", muscle: "Full Body", defaultSets: 3, defaultReps: 60, exercise_link: "" },

 // Bodyweight Exercises
 { name: "Push-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/push-up" },
 { name: "Pull-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 8, exercise_link: "" },
 { name: "Chin-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 8, exercise_link: "" },
 { name: "Dips", muscle: "Bodyweight", defaultSets: 3, defaultReps: 12, exercise_link: "" },
 { name: "Squats", muscle: "Bodyweight", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/bodyweight-squat" },
 { name: "Lunges", muscle: "Bodyweight", defaultSets: 3, defaultReps: 12, exercise_link: "" },
 { name: "Pike Push-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 10, exercise_link: "" },
 { name: "Diamond Push-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 12, exercise_link: "" },
 { name: "Plank", muscle: "Bodyweight", defaultSets: 3, defaultReps: 60, exercise_link: "https://musclewiki.com/exercise/plank" },
 { name: "Mountain Climbers", muscle: "Bodyweight", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/mountain-climber" },
 { name: "Burpees", muscle: "Bodyweight", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/burpee" },
 { name: "Jumping Jacks", muscle: "Bodyweight", defaultSets: 3, defaultReps: 30, exercise_link: "" },
 { name: "High Knees", muscle: "Bodyweight", defaultSets: 3, defaultReps: 30, exercise_link: "" },
 { name: "Bear Crawl", muscle: "Bodyweight", defaultSets: 3, defaultReps: 20, exercise_link: "" },
 { name: "Superman", muscle: "Bodyweight", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/superman" },

 // Cardio Exercises
 { name: "Running", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "", trackingType: "time_distance" },
 { name: "Cycling", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "", trackingType: "time_distance" },
 { name: "Jump Rope", muscle: "Cardio", defaultSets: 3, defaultReps: 100, exercise_link: "https://musclewiki.com/exercise/jump-rope", trackingType: "time_distance" },
 { name: "Rowing", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },
 { name: "Elliptical", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/elliptical", trackingType: "time_distance" },
 { name: "Stair Climber", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },
 { name: "Treadmill Walking", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "", trackingType: "time_distance" },
 { name: "Swimming", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },
 { name: "Battle Ropes", muscle: "Cardio", defaultSets: 3, defaultReps: 30, exercise_link: "", trackingType: "time_distance" },
 { name: "Ski Erg", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },
 { name: "Air Bike", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },
 { name: "Boxing", muscle: "Cardio", defaultSets: 3, defaultReps: 3, exercise_link: "", trackingType: "time_distance" },
 { name: "Recumbent Bike", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "", trackingType: "time_distance" },
 { name: "Spin Bike", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "", trackingType: "time_distance" },
 { name: "Arc Trainer", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "", trackingType: "time_distance" },
 { name: "VersaClimber", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },
 { name: "Jacob's Ladder", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },
 { name: "Stepper", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "", trackingType: "time_distance" },

 // Additional Core Exercises
 { name: "L-Sit", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "", met: 5 },
 { name: "Dragon Flags", muscle: "Core", defaultSets: 3, defaultReps: 8, exercise_link: "", met: 6 },
 { name: "Windshield Wipers", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/windshield-wiper", met: 5 },
 { name: "Hollow Body Hold", muscle: "Core", defaultSets: 3, defaultReps: 30, exercise_link: "", met: 4 },
 { name: "Jackknife Sit-ups", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 5 },
 { name: "Spiderman Crunches", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
 { name: "Heel Touches", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "", met: 4 },

 // Additional Equipment-Free Exercises
 { name: "Incline Push-ups", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/incline-push-up", met: 7 },
 { name: "Knee Push-ups", muscle: "Chest", defaultSets: 3, defaultReps: 15, exercise_link: "", met: 6 },
 { name: "Close Grip Push-ups", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 7 },
 { name: "Jump Squats", muscle: "Legs", defaultSets: 3, defaultReps: 15, exercise_link: "", met: 8 },
 { name: "Glute Bridges", muscle: "Legs", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/glute-bridge", met: 4 },
 { name: "Bear Crawl", muscle: "Full Body", defaultSets: 3, defaultReps: 20, exercise_link: "", met: 6 },

 // Additional Machine Exercises
 { name: "Machine Chest Press", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/machine-chest-press", met: 5 },
 { name: "Machine Shoulder Press", muscle: "Shoulders", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/machine-shoulder-press", met: 5 },
 { name: "Machine Fly", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
 { name: "Cable Chest Press", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/cable-chest-press", met: 5 },
 { name: "Cable Incline Fly", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
 { name: "Cable Reverse Fly", muscle: "Shoulders", defaultSets: 3, defaultReps: 15, exercise_link: "", met: 4 },

 // Additional Specialty Exercises
 { name: "Medicine Ball Slams", muscle: "Full Body", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 8 },
 { name: "Dumbbell Floor Press", muscle: "Chest", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-floor-press", met: 6 },
 { name: "Incline Dumbbell Curls", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },
 { name: "Cable Kickbacks", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/cable-tricep-kickback", met: 4 },
 { name: "Dumbbell Tricep Kickback", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-tricep-kickback", met: 4 },
 { name: "Single Leg Calf Raise", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "", met: 4 },

 // Additional Cardio Exercises
 { name: "Sprint Intervals", muscle: "Cardio", defaultSets: 4, defaultReps: 30, exercise_link: "", met: 10, trackingType: "time_distance" },
 { name: "High Knees", muscle: "Cardio", defaultSets: 3, defaultReps: 30, exercise_link: "", met: 8 },
 { name: "Jump Rope", muscle: "Cardio", defaultSets: 3, defaultReps: 100, exercise_link: "https://musclewiki.com/exercise/jump-rope", met: 10, trackingType: "time_distance" }
];
