---
id: 7f6c7d4b-4b8f-4c1d-8f4c-7b8f4c1d8f4c
locked: false
title: Language Translation
description: A prompt that enables high-quality translation between various languages, preserving context and meaning.
input_variables:
  - name: source_language
    description: The source language of the text to be translated
    type: string
    required: true
    variable_validation: ^(English|French|German|Spanish|Chinese|Russian)$
  - name: target_language
    description: The target language for the translation
    type: string
    required: true
    variable_validation: ^(English|French|German|Spanish|Chinese|Russian)$
  - name: text
    description: The text to be translated
    type: string
    required: true
    variable_validation: ^.+$
tags:
  - Multi-modal
  - English
  - French
examples:
  - input:
      source_language: English
      target_language: French
      text: Hello, how are you?
    output: Bonjour, comment allez-vous?
created_at: '2024-03-05T12:00:00Z'
updated_at: '2024-03-05T12:10:00Z'
bookmarked: false
---

Translate the following text from {source_language} to {target_language}: {text}

