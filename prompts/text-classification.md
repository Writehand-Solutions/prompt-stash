---
id: c0a5d9e9-b8f8-4b1d-9d2c-a5d9e9b8f8b1
locked: false
title: Text Classification
description: This prompt allows users to classify text documents into predefined categories based on their content and features.
input_variables:
  - name: text
    description: The input text to be classified
    type: string
    required: true
    variable_validation: ^.+$
  - name: categories
    description: The list of predefined categories for classification
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Classification
  - Tagging
  - English
examples:
  - input:
      text: A news article about the latest advancements in artificial intelligence.
      categories: Technology, Science, Politics, Sports, Entertainment
    output: Technology
created_at: '2024-03-04T19:20:00Z'
updated_at: '2024-03-04T19:35:00Z'
bookmarked: false
---

Classify the following text into one of the provided categories: {text}
Categories: {categories}

