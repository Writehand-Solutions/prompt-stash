---
id: 6c84fb90-12c4-11e1-840d-7b25c5ee775a
locked: false
title: Agent-based API Interaction
description: This prompt enables an AI agent to interact with APIs to retrieve information and perform actions based on user input.
input_variables:
  - name: user_input
    description: The user's input or request
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Agents
  - Interacting with APIs
examples:
  - input:
      user_input: What's the weather like in New York?
    output: The AI agent queries a weather API and responds with the current weather conditions in New York.
created_at: '2024-03-10T14:00:00Z'
updated_at: '2024-03-10T14:30:00Z'
bookmarked: false
---

You are an AI agent that can interact with APIs to retrieve information and perform actions based on user input. {user_input}

