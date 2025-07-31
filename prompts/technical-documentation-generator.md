---
id: 4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s
locked: false
title: Technical Documentation Generator
description: Create clear and concise technical documentation for software projects based on code snippets and brief descriptions.
input_variables:
  - name: code_snippet
    description: The code snippet to document
    type: string
    required: true
    variable_validation: ^[\s\S]+$
  - name: description
    description: A brief description of the code's purpose or functionality
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Technical Documentation
  - Code Documentation
  - Software Development
examples:
  - input:
      code_snippet: |-
        def calculate_area(length: float, width: float) -> float:
            return length * width
      description: A function to calculate the area of a rectangle
    output: |-
      # calculate_area

      Calculates the area of a rectangle.

      ## Parameters

      - length (float): The length of the rectangle
      - width (float): The width of the rectangle

      ## Returns

      - float: The calculated area of the rectangle

      ## Usage

      ```python
      area = calculate_area(5.0, 3.0)
      print(f'The area is: {area}')
      ```
created_at: '2024-03-15T13:00:00Z'
updated_at: null
bookmarked: false
---

Generate technical documentation for the following code snippet and description: 
Code: {code_snippet}
Description: {description}

