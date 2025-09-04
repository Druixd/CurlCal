const WORKOUT_TEMPLATES = [
  {
    id: "push-strength",
    name: "Push Day - Strength Focus",
    muscles: ["Chest", "Shoulders", "Arms"],
    exercises: [
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:6, exercise_link:"" },
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Dumbbell Lateral Raise", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise" },
      { name:"Close Grip Bench Press", muscle:"Arms", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-close-grip-bench-press" },
      { name:"Overhead Triceps Extension", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension" }
    ]
  },
  {
    id: "push-hypertrophy",
    name: "Push Day - Hypertrophy Focus",
    muscles: ["Chest", "Shoulders", "Arms"],
    exercises: [
      { name:"Flat Dumbbell Press", muscle:"Chest", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-bench-press" },
      { name:"Incline Bench Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/incline-bench-press" },
      { name:"Seated Dumbbell Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-seated-shoulder-press" },
      { name:"Side Lateral Raises", muscle:"Shoulders", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise" },
      { name:"Dips", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/parallel-bar-dips" },
      { name:"Triceps Pushdowns", muscle:"Arms", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-tricep-pushdown" },
      { name:"Front Raises", muscle:"Shoulders", defaultSets:2, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-front-raise" }
    ]
  },
  {
    id: "push-power",
    name: "Push Day - Power & Athletic",
    muscles: ["Chest", "Shoulders", "Arms"],
    exercises: [
      { name:"Explosive Push Press", muscle:"Shoulders", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-push-press" },
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Dumbbell Incline Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Arnold Press", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-arnold-press" },
      { name:"Diamond Push-ups", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/diamond-push-up" },
      { name:"Cable Lateral Raises", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-lateral-raise" }
    ]
  },
  {
    id: "pull-strength",
    name: "Pull Day - Strength Focus",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Deadlift", muscle:"Back", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-deadlift" },
      { name:"Weighted Pull-ups", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/weighted-pull-up" },
      { name:"Barbell Rows", muscle:"Back", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row" },
      { name:"Chest Supported Row", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-chest-supported-row" },
      { name:"Barbell Curl", muscle:"Arms", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-curl" },
      { name:"Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-face-pull" }
    ]
  },
  {
    id: "pull-hypertrophy",
    name: "Pull Day - Hypertrophy Focus",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Pull-ups", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/pull-up" },
      { name:"Pendlay Rows", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-pronated-pendlay-row" },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/cable-lat-pulldown" },
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/cable-seated-row" },
      { name:"Bent-Over Dumbbell Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-fly" },
      { name:"Preacher Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-preacher-curl" },
      { name:"Hammer Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-hammer-curl" }
    ]
  },
  {
    id: "pull-volume",
    name: "Pull Day - High Volume",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Conventional Deadlift", muscle:"Back", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-deadlift" },
      { name:"Chin-ups", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/chin-up" },
      { name:"T-Bar Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-t-bar-row" },
      { name:"Wide Grip Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-wide-grip-lat-pulldown" },
      { name:"Cable Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-face-pull" },
      { name:"Dumbbell Curls", muscle:"Arms", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-curl" },
      { name:"Cable Hammer Curls", muscle:"Arms", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-rope-hammer-curl" }
    ]
  },
  {
    id: "legs-functional",
    name: "Leg Day - Functional & Athletic",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Goblet Squat", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat" },
      { name:"Single Leg Deadlift", muscle:"Legs", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-single-leg-deadlift" },
      { name:"Reverse Lunges", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Step-ups", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-step-up" },
      { name:"Sumo Squat", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/sumo-squat" },
      { name:"Curtsy Lunge", muscle:"Legs", defaultSets:2, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Calf Raise Hold", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/machine-standing-calf-raise" }
    ]
  },
  {
    id: "full-body-strength",
    name: "Full Body - Strength Focus",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-squat" },
      { name:"Bench Press", muscle:"Chest", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Barbell Row", muscle:"Back", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row" },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/standing-barbell-press" },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift" },
      { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/pull-up" }
    ]
  },
  {
    id: "full-body-hypertrophy",
    name: "Full Body - Hypertrophy Focus",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Front Squats", muscle:"Legs", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-front-squat" },
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Chest-Supported Row", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-chest-supported-row" },
      { name:"Seated Leg Curls", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/machine-seated-leg-curl" },
      { name:"Dumbbell Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-seated-shoulder-press" },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-lat-pulldown" }
    ]
  },
  {
    id: "full-body-athletic",
    name: "Full Body - Power & Conditioning",
    muscles: ["Full Body", "Legs", "Chest", "Back"],
    exercises: [
      { name:"Deadlifts", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-deadlift" },
      { name:"Push Press", muscle:"Shoulders", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-push-press" },
      { name:"Bulgarian Split Squats", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat" },
      { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/pull-up" },
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
      { name:"Dumbbell Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-row" },
      { name:"Dumbbell Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-seated-shoulder-press" },
      { name:"Reverse Lunges", muscle:"Legs", defaultSets:2, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Plank", muscle:"Core", defaultSets:3, defaultReps:30, exercise_link:"https://musclewiki.com/exercise/plank" }
    ]
  },
  {
    id: "upper-strength",
    name: "Upper Body - Strength Focus",
    muscles: ["Chest", "Back", "Shoulders", "Arms"],
    exercises: [
      { name:"Bench Press", muscle:"Chest", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Weighted Pull-ups", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/weighted-pull-up" },
      { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/standing-barbell-press" },
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
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/cable-seated-row" },
      { name:"Dumbbell Shoulder Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-seated-shoulder-press" },
      { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-lat-pulldown" },
      { name:"Dips", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/parallel-bar-dips" },
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
      { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/pull-up" },
      { name:"Arnold Press", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-arnold-press" },
      { name:"T-Bar Row", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/barbell-t-bar-row" },
      { name:"Incline Chest Flyes", muscle:"Chest", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-chest-fly" },
      { name:"Cable Tricep Pushdowns", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-tricep-pushdown" },
      { name:"Cable Hammer Curls", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-rope-hammer-curl" }
    ]
  },
  {
    id: "lower-strength",
    name: "Lower Body - Strength Focus",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-squat" },
      { name:"Conventional Deadlift", muscle:"Legs", defaultSets:3, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/barbell-deadlift" },
      { name:"Front Squat", muscle:"Legs", defaultSets:3, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-front-squat" },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift" },
      { name:"Bulgarian Split Squat", muscle:"Legs", defaultSets:2, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat" },
      { name:"Standing Calf Raise", muscle:"Legs", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/machine-standing-calf-raise" }
    ]
  },
  {
    id: "lower-hypertrophy",
    name: "Lower Body - Hypertrophy Focus",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-squat" },
      { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-romanian-deadlift" },
      { name:"Walking Lunges", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-walking-lunge" },
      { name:"Leg Press", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/machine-leg-press" },
      { name:"Hamstring Curl", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/machine-seated-leg-curl" },
      { name:"Leg Extension", muscle:"Legs", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/machine-leg-extension" },
      { name:"Seated Calf Raise", muscle:"Legs", defaultSets:4, defaultReps:18, exercise_link:"https://musclewiki.com/exercise/machine-seated-calf-raise" }
    ]
  },
  {
    id: "lower-functional",
    name: "Lower Body - Functional Training",
    muscles: ["Legs", "Core"],
    exercises: [
      { name:"Goblet Squat", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat" },
      { name:"Single Leg Deadlift", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-single-leg-deadlift" },
      { name:"Reverse Lunges", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Step-ups", muscle:"Legs", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-step-up" },
      { name:"Lateral Lunges", muscle:"Legs", defaultSets:2, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-lunge" },
      { name:"Cossack Squat", muscle:"Legs", defaultSets:2, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-goblet-squat" },
      { name:"Single Leg Calf Raise", muscle:"Legs", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/machine-standing-calf-raise" }
    ]
  },
  {
    id: "chest-mass",
    name: "Chest Focus - Mass Building",
    muscles: ["Chest", "Arms", "Shoulders"],
    exercises: [
      { name:"Barbell Bench Press", muscle:"Chest", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-bench-press" },
      { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
      { name:"Incline Barbell Press", muscle:"Chest", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/incline-bench-press" },
      { name:"Weighted Dips", muscle:"Chest", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/weighted-dip" },
      { name:"Cable Flyes", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-fly" },
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
      { name:"Incline Cable Flyes", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-incline-fly" },
      { name:"Dips", muscle:"Chest", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/parallel-bar-dips" },
      { name:"Cable Crossover", muscle:"Chest", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-crossover" },
      { name:"Push-ups", muscle:"Chest", defaultSets:2, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/push-up" }
    ]
  },
  {
    id: "back-width",
    name: "Back Focus - Width & V-Taper",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Wide Grip Pull-ups", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/wide-grip-pull-up" },
      { name:"Wide Grip Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/cable-wide-grip-lat-pulldown" },
      { name:"T-Bar Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-t-bar-row" },
      { name:"Straight Arm Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-straight-arm-pulldown" },
      { name:"Close Grip Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/cable-lat-pulldown" },
      { name:"Cable Pullovers", muscle:"Back", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-pullover" }
    ]
  },
  {
    id: "back-thickness",
    name: "Back Focus - Thickness & Density",
    muscles: ["Back", "Arms", "Shoulders"],
    exercises: [
      { name:"Deadlift", muscle:"Back", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/barbell-deadlift" },
      { name:"Barbell Rows", muscle:"Back", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-bent-over-row" },
      { name:"Chest Supported Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/dumbbell-chest-supported-row" },
      { name:"Seated Cable Row", muscle:"Back", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/cable-seated-row" },
      { name:"Dumbbell Shrugs", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-shrug" },
      { name:"Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-face-pull" }
    ]
  },
  {
    id: "shoulders-mass",
    name: "Shoulder Focus - Mass & Strength",
    muscles: ["Shoulders", "Arms", "Chest"],
    exercises: [
      { name:"Standing Barbell Press", muscle:"Shoulders", defaultSets:4, defaultReps:6, exercise_link:"https://musclewiki.com/exercise/standing-barbell-press" },
      { name:"Seated Dumbbell Press", muscle:"Shoulders", defaultSets:3, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/dumbbell-seated-shoulder-press" },
      { name:"Dumbbell Lateral Raises", muscle:"Shoulders", defaultSets:4, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-lateral-raise" },
      { name:"Bent-Over Rear Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-reverse-fly" },
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
      { name:"Cable Lateral Raises", muscle:"Shoulders", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-lateral-raise" },
      { name:"Reverse Cable Flyes", muscle:"Shoulders", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-reverse-fly" },
      { name:"Pike Push-ups", muscle:"Shoulders", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/pike-push-up" },
      { name:"Cable Face Pulls", muscle:"Shoulders", defaultSets:3, defaultReps:20, exercise_link:"https://musclewiki.com/exercise/cable-face-pull" },
      { name:"Handstand Push-ups", muscle:"Shoulders", defaultSets:2, defaultReps:5, exercise_link:"https://musclewiki.com/exercise/handstand-push-up" }
    ]
  },
  {
    id: "arms-mass",
    name: "Arms Focus - Mass & Size",
    muscles: ["Arms", "Shoulders", "Chest"],
    exercises: [
      { name:"Close Grip Bench Press", muscle:"Arms", defaultSets:4, defaultReps:8, exercise_link:"https://musclewiki.com/exercise/barbell-close-grip-bench-press" },
      { name:"Barbell Curls", muscle:"Arms", defaultSets:4, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/barbell-curl" },
      { name:"Weighted Dips", muscle:"Arms", defaultSets:3, defaultReps:10, exercise_link:"https://musclewiki.com/exercise/weighted-dip" },
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
      { name:"Diamond Push-ups", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/diamond-push-up" },
      { name:"Cable Bicep Curls", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-curl" },
      { name:"Tricep Pushdowns", muscle:"Arms", defaultSets:4, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-tricep-pushdown" },
      { name:"Concentration Curls", muscle:"Arms", defaultSets:3, defaultReps:12, exercise_link:"https://musclewiki.com/exercise/dumbbell-concentration-curl" },
      { name:"Cable Tricep Extensions", muscle:"Arms", defaultSets:3, defaultReps:15, exercise_link:"https://musclewiki.com/exercise/cable-overhead-tricep-extension" },
      { name:"21s Bicep Curls", muscle:"Arms", defaultSets:2, defaultReps:21, exercise_link:"https://musclewiki.com/exercise/barbell-curl" }
    ]
  }
];

// Comprehensive exercise database with all possible exercises
const COMPREHENSIVE_EXERCISES = [
 // Chest Exercises
 { name: "Barbell Bench Press", muscle: "Chest", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-bench-press" },
 { name: "Dumbbell Bench Press", muscle: "Chest", defaultSets: 4, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-bench-press" },
 { name: "Incline Bench Press", muscle: "Chest", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/incline-bench-press" },
 { name: "Incline Dumbbell Press", muscle: "Chest", defaultSets: 4, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-incline-bench-press" },
 { name: "Decline Bench Press", muscle: "Chest", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/decline-bench-press" },
 { name: "Chest Flyes", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-fly" },
 { name: "Cable Flyes", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/cable-fly" },
 { name: "Pec Deck Machine", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/machine-fly" },
 { name: "Push-ups", muscle: "Chest", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/push-up" },
 { name: "Diamond Push-ups", muscle: "Chest", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/diamond-push-up" },
 { name: "Dips", muscle: "Chest", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/parallel-bar-dips" },
 { name: "Weighted Dips", muscle: "Chest", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/weighted-dip" },

 // Back Exercises
 { name: "Deadlift", muscle: "Back", defaultSets: 4, defaultReps: 6, exercise_link: "https://musclewiki.com/exercise/barbell-deadlift" },
 { name: "Romanian Deadlift", muscle: "Back", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-romanian-deadlift" },
 { name: "Pull-ups", muscle: "Back", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/pull-up" },
 { name: "Chin-ups", muscle: "Back", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/chin-up" },
 { name: "Weighted Pull-ups", muscle: "Back", defaultSets: 4, defaultReps: 6, exercise_link: "https://musclewiki.com/exercise/weighted-pull-up" },
 { name: "Lat Pulldown", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/cable-lat-pulldown" },
 { name: "Seated Cable Row", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/cable-seated-row" },
 { name: "Bent-Over Row", muscle: "Back", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-bent-over-row" },
 { name: "T-Bar Row", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/barbell-t-bar-row" },
 { name: "Single Arm Dumbbell Row", muscle: "Back", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-row" },
 { name: "Face Pulls", muscle: "Back", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/cable-face-pull" },
 { name: "Straight Arm Pulldown", muscle: "Back", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/cable-straight-arm-pulldown" },
 { name: "Shrugs", muscle: "Back", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-shrug" },

 // Shoulder Exercises
 { name: "Overhead Press", muscle: "Shoulders", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/standing-barbell-press" },
 { name: "Seated Dumbbell Press", muscle: "Shoulders", defaultSets: 4, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-seated-shoulder-press" },
 { name: "Arnold Press", muscle: "Shoulders", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-arnold-press" },
 { name: "Lateral Raises", muscle: "Shoulders", defaultSets: 4, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-lateral-raise" },
 { name: "Front Raises", muscle: "Shoulders", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-front-raise" },
 { name: "Rear Delt Flyes", muscle: "Shoulders", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-reverse-fly" },
 { name: "Upright Rows", muscle: "Shoulders", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/barbell-upright-row" },
 { name: "Cable Lateral Raises", muscle: "Shoulders", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/cable-lateral-raise" },
 { name: "Face Pulls", muscle: "Shoulders", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/cable-face-pull" },

 // Arm Exercises
 { name: "Barbell Curl", muscle: "Arms", defaultSets: 4, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/barbell-curl" },
 { name: "Dumbbell Curl", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-curl" },
 { name: "Hammer Curls", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-hammer-curl" },
 { name: "Preacher Curls", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-preacher-curl" },
 { name: "Concentration Curls", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-concentration-curl" },
 { name: "Tricep Dips", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/parallel-bar-dips" },
 { name: "Close Grip Bench Press", muscle: "Arms", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-close-grip-bench-press" },
 { name: "Overhead Tricep Extension", muscle: "Arms", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-overhead-tricep-extension" },
 { name: "Tricep Pushdowns", muscle: "Arms", defaultSets: 4, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/cable-tricep-pushdown" },
 { name: "Skull Crushers", muscle: "Arms", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/ez-bar-skull-crusher" },

 // Leg Exercises
 { name: "Back Squat", muscle: "Legs", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-squat" },
 { name: "Front Squat", muscle: "Legs", defaultSets: 4, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-front-squat" },
 { name: "Goblet Squat", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-goblet-squat" },
 { name: "Bulgarian Split Squat", muscle: "Legs", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-bulgarian-split-squat" },
 { name: "Lunges", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-lunge" },
 { name: "Walking Lunges", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-walking-lunge" },
 { name: "Step-ups", muscle: "Legs", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/dumbbell-step-up" },
 { name: "Leg Press", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/machine-leg-press" },
 { name: "Leg Extension", muscle: "Legs", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/machine-leg-extension" },
 { name: "Leg Curl", muscle: "Legs", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/machine-seated-leg-curl" },
 { name: "Calf Raises", muscle: "Legs", defaultSets: 4, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/machine-standing-calf-raise" },
 { name: "Seated Calf Raises", muscle: "Legs", defaultSets: 4, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/machine-seated-calf-raise" },

 // Core Exercises
 { name: "Plank", muscle: "Core", defaultSets: 3, defaultReps: 60, exercise_link: "https://musclewiki.com/exercise/plank", trackingType: "time_distance" },
 { name: "Russian Twists", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/russian-twist" },
 { name: "Bicycle Crunches", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/bicycle-crunch" },
 { name: "Crunches", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/crunch" },
 { name: "Sit-ups", muscle: "Core", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/sit-up" },
 { name: "Leg Raises", muscle: "Core", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/lying-leg-raise" },
 { name: "Flutter Kicks", muscle: "Core", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/flutter-kick" },
 { name: "Mountain Climbers", muscle: "Core", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/mountain-climber" },
 { name: "Dead Bug", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dead-bug" },
 { name: "Bird Dog", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/bird-dog" },
 { name: "Hollow Body Hold", muscle: "Core", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/hollow-body-hold" },
 { name: "V-ups", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/v-up" },
 { name: "Reverse Crunches", muscle: "Core", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/reverse-crunch" },
 { name: "Heel Touches", muscle: "Core", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/heel-touch" },
 { name: "Spiderman Crunches", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/spiderman-crunch" },
 { name: "Jackknife Sit-ups", muscle: "Core", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/jackknife-sit-up" },

 // Full Body Exercises
 { name: "Burpees", muscle: "Full Body", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/burpee" },
 { name: "Thrusters", muscle: "Full Body", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/dumbbell-thruster" },
 { name: "Clean and Press", muscle: "Full Body", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/barbell-clean-and-press" },
 { name: "Kettlebell Swings", muscle: "Full Body", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/kettlebell-swing" },
 { name: "Box Jumps", muscle: "Full Body", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/box-jump" },
 { name: "Farmer's Walk", muscle: "Full Body", defaultSets: 3, defaultReps: 60, exercise_link: "https://musclewiki.com/exercise/farmers-walk" },

 // Bodyweight Exercises
 { name: "Push-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/push-up" },
 { name: "Pull-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/pull-up" },
 { name: "Chin-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 8, exercise_link: "https://musclewiki.com/exercise/chin-up" },
 { name: "Dips", muscle: "Bodyweight", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/parallel-bar-dips" },
 { name: "Squats", muscle: "Bodyweight", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/bodyweight-squat" },
 { name: "Lunges", muscle: "Bodyweight", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/bodyweight-lunge" },
 { name: "Pike Push-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/pike-push-up" },
 { name: "Diamond Push-ups", muscle: "Bodyweight", defaultSets: 3, defaultReps: 12, exercise_link: "https://musclewiki.com/exercise/diamond-push-up" },
 { name: "Plank", muscle: "Bodyweight", defaultSets: 3, defaultReps: 60, exercise_link: "https://musclewiki.com/exercise/plank" },
 { name: "Mountain Climbers", muscle: "Bodyweight", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/mountain-climber" },
 { name: "Burpees", muscle: "Bodyweight", defaultSets: 3, defaultReps: 10, exercise_link: "https://musclewiki.com/exercise/burpee" },
 { name: "Jumping Jacks", muscle: "Bodyweight", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/jumping-jack" },
 { name: "High Knees", muscle: "Bodyweight", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/high-knee" },
 { name: "Bear Crawl", muscle: "Bodyweight", defaultSets: 3, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/bear-crawl" },
 { name: "Superman", muscle: "Bodyweight", defaultSets: 3, defaultReps: 15, exercise_link: "https://musclewiki.com/exercise/superman" },

 // Cardio Exercises
 { name: "Running", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/running", trackingType: "time_distance" },
 { name: "Cycling", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/cycling", trackingType: "time_distance" },
 { name: "Jump Rope", muscle: "Cardio", defaultSets: 3, defaultReps: 100, exercise_link: "https://musclewiki.com/exercise/jump-rope", trackingType: "time_distance" },
 { name: "Rowing", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/rowing", trackingType: "time_distance" },
 { name: "Elliptical", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/elliptical", trackingType: "time_distance" },
 { name: "Stair Climber", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/stair-climber", trackingType: "time_distance" },
 { name: "Treadmill Walking", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/treadmill-walking", trackingType: "time_distance" },
 { name: "Swimming", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/swimming", trackingType: "time_distance" },
 { name: "Battle Ropes", muscle: "Cardio", defaultSets: 3, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/battle-rope", trackingType: "time_distance" },
 { name: "Ski Erg", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/ski-erg", trackingType: "time_distance" },
 { name: "Air Bike", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/air-bike", trackingType: "time_distance" },
 { name: "Boxing", muscle: "Cardio", defaultSets: 3, defaultReps: 3, exercise_link: "https://musclewiki.com/exercise/boxing", trackingType: "time_distance" },
 { name: "Recumbent Bike", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/recumbent-bike", trackingType: "time_distance" },
 { name: "Spin Bike", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/spin-bike", trackingType: "time_distance" },
 { name: "Arc Trainer", muscle: "Cardio", defaultSets: 1, defaultReps: 30, exercise_link: "https://musclewiki.com/exercise/arc-trainer", trackingType: "time_distance" },
 { name: "VersaClimber", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/versaclimber", trackingType: "time_distance" },
 { name: "Jacob's Ladder", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/jacobs-ladder", trackingType: "time_distance" },
 { name: "Stepper", muscle: "Cardio", defaultSets: 1, defaultReps: 20, exercise_link: "https://musclewiki.com/exercise/stepper", trackingType: "time_distance" }
];