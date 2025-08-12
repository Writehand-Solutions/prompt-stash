---
id: "c5d7c9ac-7a9e-4b2d-9d1e-2f5a8a7a2b91"
locked: false
title: "Compose engaging social media captions"
description: "Craft captivating social media captions that resonate with your audience. Boost engagement and enhance your brand's presence with every post!"
tags:
  - "Public Relations"
  - "Communications Director"
bookmarked: false
created_at: "2025-08-12T00:00:00Z"
updated_at: "2025-08-12T00:00:00Z"
input_variables:
  - name: target_audience
    description: Who the content is for (e.g., "Young professionals").
    type: string
    required: true
    variable_validation: "^.+$"
  - name: brand_voice
    description: Brand voice or tone (e.g., "Inspirational and empowering").
    type: string
    required: true
    variable_validation: "^.+$"
  - name: key_message
    description: Core message to communicate.
    type: string
    required: true
    variable_validation: "^.+$"
  - name: current_campaign_theme
    description: Campaign theme to align with; will also be used as a hashtag.
    type: string
    required: true
    variable_validation: "^.+$"
---

As a **Communications Director** with expertise in **Public Relations**, write 5 captivating social-media captions that resonate with **{target_audience}**. The captions must:

- Reflect our **brand voice**: **{brand_voice}**
- Convey the **key message**: **{key_message}**
- Align with the current campaign theme: **{current_campaign_theme}**
- Be concise, engaging, and interaction-oriented
- Vary the hook and angle across the 5 captions
- Use natural language; 0–2 tasteful emoji per caption
- Include 1–2 relevant hashtags, **including** `#{current_campaign_theme}` (remove spaces)

Return the result **only** in this format:

## Output
1. "..."
2. "..."
3. "..."
4. "..."
5. "..."
