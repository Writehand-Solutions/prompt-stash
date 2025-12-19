id: a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p
locked: false
title: LinkedIn Headline Optimizer
description: Create a clear, high-impact LinkedIn headline that positions the user for their ideal audience and outcome.
input_variables:
  - name: name
    description: The person’s name (optional, used for context only)
    type: string
    required: false
    variable_validation: ^.*$
  - name: role_or_expertise
    description: The primary role, expertise, or identity the person wants to be known for
    type: string
    required: true
    variable_validation: ^.+$
  - name: target_audience
    description: The specific audience or ICP the person serves
    type: string
    required: true
    variable_validation: ^.+$
  - name: core_outcome
    description: The main result, transformation, or value delivered to the audience
    type: string
    required: true
    variable_validation: ^.+$
  - name: differentiation
    description: What makes their approach unique (method, philosophy, angle, or mechanism)
    type: string
    required: false
    variable_validation: ^.*$
tags:
  - LinkedIn
  - Personal Branding
  - Positioning
  - Professional Headline
examples:
  - input:
      name: Sam Sutherland
      role_or_expertise: AI Productisation Strategist
      target_audience: coaches and consultants
      core_outcome: turn their expertise into scalable AI-powered products
      differentiation: without chatbots or custom code
    output: AI Productisation Strategist | Helping Coaches & Consultants Turn Expertise into Scalable AI Products — Without Chatbots or Code
created_at: '2025-12-19T02:00:00Z'
updated_at: null
bookmarked: false
---

Create a new LinkedIn headline using the inputs below.

Guidelines:
- Keep it concise (ideally 120–220 characters)
- Lead with role or positioning
- Clearly state who it’s for and the outcome
- Use separators like “|” or “—” for clarity
- Avoid buzzwords and vague claims

Name (optional): {name}
Role / Expertise: {role_or_expertise}
Target Audience: {target_audience}
Core Outcome: {core_outcome}
Differentiation (optional): {differentiation}
