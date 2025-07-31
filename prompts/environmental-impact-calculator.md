---
id: 0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y
locked: false
title: Environmental Impact Calculator
description: Estimate the environmental impact of various activities or products based on user input.
input_variables:
  - name: activity_product
    description: The activity or product to calculate the environmental impact for
    type: string
    required: true
    variable_validation: ^.+$
  - name: quantity_duration
    description: The quantity or duration of the activity or product use
    type: string
    required: true
    variable_validation: ^\d+(\.\d+)? [\w\s]+$
  - name: frequency
    description: How often the activity is performed or the product is used
    type: string
    required: true
    variable_validation: ^(Daily|Weekly|Monthly|Yearly|One-time)$
tags:
  - Environmental Impact
  - Sustainability
  - Carbon Footprint
examples:
  - input:
      activity_product: Car commute
      quantity_duration: 20 miles
      frequency: Daily
    output: |-
      ## Carbon Footprint

      Estimated CO2 emissions: 4.6 kg per day, or 1,679 kg per year
      Based on an average passenger vehicle emitting 404 grams of CO2 per mile.

      ## Fuel Consumption

      Estimated fuel usage: 1 gallon per day, or 365 gallons per year
      Assuming an average fuel efficiency of 20 miles per gallon.

      ## Cost

      Estimated fuel cost: $3 per day, or $1,095 per year
      Based on an average gas price of $3 per gallon.

      ## Recommendations

      1. Consider carpooling to reduce individual emissions and costs.
      2. Explore public transportation options if available in your area.
      3. Look into remote work possibilities to eliminate commute days.
      4. If feasible, consider switching to an electric or hybrid vehicle to reduce emissions.
      5. Offset your carbon footprint by supporting verified carbon offset projects.
created_at: '2024-03-15T19:00:00Z'
updated_at: null
bookmarked: false
---

Calculate the environmental impact of the following activity or product:
Activity/Product: {activity_product}
Quantity/Duration: {quantity_duration}
Frequency: {frequency}

