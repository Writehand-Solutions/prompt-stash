---
id: 5e8d4b7c-6d51-4e9f-bf7f-c7e8d4e4c4a4
locked: false
title: SQL Query Generation
description: This prompt allows users to describe their database query requirements in natural language and generates the corresponding SQL queries.
input_variables:
  - name: description
    description: The natural language description of the SQL query requirements
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - SQL
  - English
examples:
  - input:
      description: Retrieve the names and email addresses of all customers who have placed an order in the last 30 days
    output: |-
      SELECT c.name, c.email
      FROM customers c
      JOIN orders o ON c.id = o.customer_id
      WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
created_at: '2024-03-06T16:40:00Z'
updated_at: '2024-03-06T16:55:00Z'
bookmarked: false
---

Generate an SQL query based on the following description: {description}

