---
id: cf5d8b5a-6eff-4c6f-b8b1-6e8a1f6d8b9a
locked: false
title: Text Summarization
description: A prompt that generates concise summaries of long articles or documents, preserving key information and main points.
input_variables:
  - name: text
    description: The input text to be summarized
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Summarization
  - English
examples:
  - input:
      text: A long article about the benefits of exercise and healthy eating habits.
    output: Regular exercise and a balanced diet are essential for maintaining good health. Exercise helps improve cardiovascular health, strengthens muscles and bones, and boosts mental well-being. Eating a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats provides the body with essential nutrients and reduces the risk of chronic diseases.
created_at: '2024-03-07T09:00:00Z'
updated_at: '2024-03-07T09:20:00Z'
bookmarked: false
---

Summarize the following text, focusing on the main ideas and key information: {text}

