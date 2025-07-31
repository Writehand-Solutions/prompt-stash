---
id: 8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w
locked: false
title: Code Refactoring Advisor
description: Analyze code snippets and provide suggestions for improving code quality, readability, and efficiency.
input_variables:
  - name: language
    description: The programming language of the code snippet
    type: string
    required: true
    variable_validation: ^(Python|JavaScript|Java|C\+\+|Ruby)$
  - name: code_snippet
    description: The code snippet to be analyzed and refactored
    type: string
    required: true
    variable_validation: ^[\s\S]+$
tags:
  - Code Refactoring
  - Code Quality
  - Software Development
examples:
  - input:
      language: Python
      code_snippet: |-
        def calculate_total(items):
            total = 0
            for i in range(len(items)):
                total = total + items[i]
            return total
    output: |-
      ## Use built-in sum() function

      Replace the manual loop with Python's built-in sum() function for better readability and efficiency.

      ```python
      def calculate_total(items):
          return sum(items)
      ```

      ## Use type hinting

      Add type hints to improve code readability and catch potential type-related errors.

      ```python
      from typing import List

      def calculate_total(items: List[float]) -> float:
          return sum(items)
      ```

      ## Consider input validation

      Add input validation to ensure the function receives a valid list of numbers.

      ```python
      from typing import List

      def calculate_total(items: List[float]) -> float:
          if not isinstance(items, list) or not all(isinstance(item, (int, float)) for item in items):
              raise ValueError("Input must be a list of numbers")
          return sum(items)
      ```
created_at: '2024-03-15T17:00:00Z'
updated_at: null
bookmarked: false
---

Analyze the following code snippet and provide suggestions for refactoring to improve quality, readability, and efficiency:
Language: {language}
Code:
{code_snippet}

