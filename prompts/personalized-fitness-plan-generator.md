---
id: 9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x
locked: false
title: Personalized Fitness Plan Generator
description: Create customized workout plans based on user goals, fitness level, and available equipment.
input_variables:
  - name: fitness_goal
    description: The primary fitness goal of the user
    type: string
    required: true
    variable_validation: ^(Weight Loss|Muscle Gain|Endurance|Flexibility|General Fitness)$
  - name: fitness_level
    description: The current fitness level of the user
    type: string
    required: true
    variable_validation: ^(Beginner|Intermediate|Advanced)$
  - name: available_equipment
    description: A comma-separated list of available fitness equipment
    type: string
    required: true
    variable_validation: ^[\w\s]+(,[\w\s]+)*$
  - name: time_available
    description: The amount of time available for workouts per session
    type: string
    required: true
    variable_validation: ^\d+ (minutes|hours)$
tags:
  - Fitness
  - Workout Plan
  - Personal Training
examples:
  - input:
      fitness_goal: Weight Loss
      fitness_level: Beginner
      available_equipment: Dumbbells, Resistance Bands, Yoga Mat
      time_available: 30 minutes
    output: |-
      # 4-Week Weight Loss Workout Plan for Beginners

      ## Week 1-2: Full Body Circuit (3 times per week)

      1. Bodyweight Squats: 3 sets of 10 reps
      2. Dumbbell Rows: 3 sets of 10 reps
      3. Push-ups (or Modified Push-ups): 3 sets of 5-10 reps
      4. Resistance Band Leg Press: 3 sets of 12 reps
      5. Plank: 3 sets of 20-30 seconds

      Rest 30 seconds between exercises and 1-2 minutes between circuits.

      ## Week 3-4: Upper/Lower Split (4 times per week)

      ### Upper Body (2 times per week)

      1. Dumbbell Chest Press: 3 sets of 10 reps
      2. Resistance Band Rows: 3 sets of 12 reps
      3. Dumbbell Shoulder Press: 3 sets of 10 reps
      4. Resistance Band Bicep Curls: 3 sets of 12 reps
      5. Tricep Dips (using a chair): 3 sets of 8-10 reps

      ### Lower Body (2 times per week)

      1. Dumbbell Goblet Squats: 3 sets of 12 reps
      2. Resistance Band Leg Press: 3 sets of 15 reps
      3. Dumbbell Romanian Deadlifts: 3 sets of 10 reps
      4. Resistance Band Glute Bridges: 3 sets of 15 reps
      5. Bodyweight Calf Raises: 3 sets of 20 reps

      Rest 45 seconds between exercises and 1-2 minutes between sets.

      ## Cardio (2-3 times per week)

      Perform 15-20 minutes of moderate-intensity cardio (e.g., brisk walking, jogging in place, or jumping jacks) on non-strength training days or after your strength workouts if time allows.

      ## Cool-down and Stretching (5 minutes)

      Perform light stretching for major muscle groups after each workout to improve flexibility and reduce muscle soreness.
created_at: '2024-03-15T18:00:00Z'
updated_at: null
bookmarked: false
---

Generate a personalized fitness plan based on the following information:
Goal: {fitness_goal}
Fitness Level: {fitness_level}
Available Equipment: {available_equipment}
Time Available: {time_available}

