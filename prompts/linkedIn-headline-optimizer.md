---
id: 8c1f2a3b-4d5e-6f70-8a9b-1c2d3e4f5a6b
locked: false
title: LinkedIn Headline Generator
description: "Generate a punchy, outcome-driven LinkedIn headline tailored to a specific audience, offer, and positioning."

input_variables:

* name: role_or_positioning
  description: "The primary role or positioning you want to lead with"
  type: string
  required: true
  variable_validation: "^.+$"

* name: target_audience
  description: "Who you help (ICP)"
  type: string
  required: true
  variable_validation: "^.+$"

* name: core_outcome
  description: "The main result or transformation you create"
  type: string
  required: true
  variable_validation: "^.+$"

* name: proof_or_credibility
  description: "Credibility signal (optional), e.g. Founder, MBA, 10+ years experience"
  type: string
  required: false
  variable_validation: "^.*$"

* name: keywords
  description: "A comma-separated list of keywords to include (optional)"
  type: string
  required: false
  variable_validation: "^[\w\s]+(,[\w\s]+)*$"

tags:

* LinkedIn
* Personal Branding
* Positioning

examples:

* input:
  role_or_positioning: "AI Productisation Pioneer | Co-Founder & CEO"
  target_audience: "coaches and consultants"
  core_outcome: "turn expertise into scalable AI-powered lead generation products"
  proof_or_credibility: "MBA (Digital Transformation)"
  keywords: "AI lead generation, client delivery, AI products"
  output: |-
  Option 1: AI Productisation Pioneer | Helping Coaches & Consultants Turn Expertise into AI Lead-Gen Products
  Option 2: Co-Founder & CEO | AI Productisation | Helping Coaches & Consultants Convert Leads with AI-Powered Products
  Option 3: AI Productisation (MBA) | Building Scalable AI Products for Coaches & Consultants

created_at: "2025-12-19T02:00:00Z"
updated_at: null
bookmarked: false

---

Generate LinkedIn headlines using the following inputs.

Rules:

* Provide 8–12 headline options
* Keep each headline under 220 characters
* Use separators like "|" or "—" for clarity
* Lead with role or positioning
* Clearly state audience and outcome
* Avoid buzzwords and vague claims

Inputs:
Role / Positioning: {role_or_positioning}
Target Audience: {target_audience}
Core Outcome: {core_outcome}
Proof / Credibility (optional): {proof_or_credibility}
Keywords (optional): {keywords}

---
