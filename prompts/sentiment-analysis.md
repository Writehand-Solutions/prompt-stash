---
id: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
locked: false
title: Sentiment Analysis
description: Analyze the sentiment of given text, classifying it as positive, negative, or neutral.
input_variables:
  - name: text
    description: The text to be analyzed for sentiment
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Sentiment Analysis
  - Text Classification
  - Social Media Monitoring
examples:
  - input:
      text: I absolutely love this product! It's amazing!
    output: 'Positive: The text expresses strong positive sentiment with words like ''love'' and ''amazing''.'
created_at: '2024-03-15T10:00:00Z'
updated_at: null
bookmarked: false
creator: system
---

Analyze the sentiment of the following text and classify it as positive, negative, or neutral: {text}

