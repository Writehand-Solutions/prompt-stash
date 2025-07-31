---
id: 3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r
locked: false
title: Data Visualization Recommendation
description: Suggest appropriate chart types and visualization techniques based on given data characteristics.
input_variables:
  - name: data_description
    description: Description of the data to be visualized, including types of variables and relationships
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Data Visualization
  - Chart Recommendation
  - Data Analysis
examples:
  - input:
      data_description: Time series data showing monthly sales for multiple product categories over the past year
    output: |-
      - Line chart: Best for showing trends over time for multiple categories.
      - Stacked area chart: Useful for comparing the total sales and the contribution of each category.
      - Heatmap: Effective for highlighting seasonal patterns in sales across categories.
created_at: '2024-03-15T12:00:00Z'
updated_at: null
bookmarked: false
creator: system
---

Recommend appropriate data visualization techniques for the following data: {data_description}

