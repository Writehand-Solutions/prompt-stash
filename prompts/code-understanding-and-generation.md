---
id: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
locked: false
title: Code Understanding and Generation
description: This prompt enables the AI to understand and generate code snippets based on natural language descriptions, supporting multiple programming languages.
input_variables:
  - name: description
    description: The natural language description of the code snippet
    type: string
    required: true
    variable_validation: ^.+$
  - name: language
    description: The programming language for the code snippet
    type: string
    required: true
    variable_validation: ^(Python|JavaScript|Java|C\+\+|Ruby)$
tags:
  - Code understanding
  - Code writing
examples:
  - input:
      description: Find the sum of two numbers
      language: Python
    output: |-
      def sum_numbers(a, b):
          return a + b
created_at: '2024-03-08T18:30:00Z'
updated_at: '2024-03-08T18:45:00Z'
bookmarked: false
---

You are an AI programming assistant. Given the following description, provide the corresponding code snippet in the specified programming language. Description: {description} Programming Language: {language}

