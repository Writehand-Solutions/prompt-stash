---
id: 6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u
locked: false
title: Product Description Optimizer
description: Enhance product descriptions for e-commerce platforms, focusing on key features and benefits.
input_variables:
  - name: product_name
    description: The name of the product
    type: string
    required: true
    variable_validation: ^.+$
  - name: original_description
    description: The original product description to be optimized
    type: string
    required: true
    variable_validation: ^.+$
  - name: key_features
    description: A comma-separated list of key features of the product
    type: string
    required: true
    variable_validation: ^[\w\s]+(,[\w\s]+)*$
tags:
  - Product Description
  - E-commerce
  - Content Optimization
examples:
  - input:
      product_name: UltraFlex Yoga Mat
      original_description: This yoga mat is made of high-quality materials and is suitable for all types of yoga practices.
      key_features: Non-slip surface, Extra thick padding, Eco-friendly materials, Easy to clean
    output: Elevate your yoga practice with the UltraFlex Yoga Mat, the ultimate companion for yogis of all levels. Crafted with eco-friendly materials, this premium mat features a non-slip surface that ensures stability in even the most challenging poses. The extra thick padding provides unparalleled comfort and joint protection, allowing you to flow through your practice with ease. Easy to clean and maintain, the UltraFlex Yoga Mat is designed to withstand the rigors of daily use while supporting your journey to inner peace and physical well-being. Experience the perfect balance of grip, cushioning, and sustainability – your body and the planet will thank you.
created_at: '2024-03-15T15:00:00Z'
updated_at: null
bookmarked: false
---

Optimize the following product description, highlighting key features and benefits:
Product Name: {product_name}
Original Description: {original_description}
Key Features: {key_features}

