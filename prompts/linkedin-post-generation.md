---
id: 5e9b8f8c-a5d9-4e9b-8f8c-a5d9e9b8f8c
locked: false
title: LinkedIn Post Generation
description: This prompt allows users to generate a LinkedIn post to promote their latest content based on a provided summary.
input_variables:
  - name: type_content
    description: The type of content being promoted (e.g., blog post, video, infographic)
    type: string
    required: true
    variable_validation: ^.+$
  - name: counter_p
    description: The number of paragraphs to use in the LinkedIn post
    type: integer
    required: true
    variable_validation: ^\d+$
  - name: language
    description: The language to use for the LinkedIn post
    type: string
    required: true
    variable_validation: ^.+$
  - name: summary
    description: The summary of the content being promoted
    type: string
    required: true
    variable_validation: ^.+$
  - name: format
    description: The format of the summary (e.g., text, markdown, JSON)
    type: string
    required: true
    variable_validation: ^.+$
  - name: link
    description: The link to the content being promoted
    type: string
    required: true
    variable_validation: ^.+$
  - name: target_audience
    description: The target audience for the LinkedIn post
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Social Media
  - Marketing
  - Content Promotion
  - LinkedIn
  - Text Generation
examples:
  - input:
      type_content: blog post
      counter_p: 3
      language: English
      summary: This blog post provides an in-depth analysis of the latest trends in artificial intelligence and how they are impacting various industries. It explores the potential benefits and challenges of AI adoption and offers practical recommendations for businesses looking to leverage this technology.
      format: text
      link: https://www.example.com/ai-trends
      target_audience: Technology professionals, business leaders
    output: |-
      Have you been keeping up with the latest advancements in artificial intelligence? In my latest blog post, I dive deep into the trends that are reshaping industries across the board.

      This comprehensive analysis covers the potential benefits and challenges of AI adoption, as well as practical steps businesses can take to harness this powerful technology. Whether you're a tech professional or a business leader, you won't want to miss this insightful read.

      Check out the full post here: https://www.example.com/ai-trends. I've tailored the content to our target audience of technology professionals and business leaders, so you're sure to find it valuable.
created_at: '2024-03-04T19:20:00Z'
updated_at: '2024-03-04T19:35:00Z'
bookmarked: false
---

You are an expert assistant who can generate a LinkedIn post to invite people to visit a link that is a {type_content}, the post should be generated based on a summary.

The post should be written in the first person and use {counter_p} paragraphs to separate ideas or concepts, be conscientious and get to the point.

Start your post with a question to create an engagement. Create a post in {language} on LinkedIn to promote my latest content based on this summary: {summary}

The summary is in {format} format.

Here is the link: {link} and remember to target the post to the {target_audience} audience.

