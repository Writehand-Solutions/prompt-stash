---
id: 5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t
locked: false
title: Interview Question Generator
description: Generate relevant interview questions based on a job description and required skills.
input_variables:
  - name: job_description
    description: A brief description of the job position
    type: string
    required: true
    variable_validation: ^.+$
  - name: required_skills
    description: A comma-separated list of required skills for the position
    type: string
    required: true
    variable_validation: ^[\w\s]+(,[\w\s]+)*$
tags:
  - Interview Questions
  - Recruitment
  - HR
examples:
  - input:
      job_description: We are seeking a full-stack web developer to join our team and work on various client projects.
      required_skills: JavaScript, React, Node.js, SQL, Git
    output: |-
      1. Can you describe a complex web application you've built using React and Node.js?
      2. How do you approach optimizing database queries in SQL for better performance?
      3. Explain your workflow when using Git for version control in a team environment.
      4. How do you stay updated with the latest trends and best practices in JavaScript development?
      5. Can you walk us through your process for debugging a performance issue in a full-stack application?
created_at: '2024-03-15T14:00:00Z'
updated_at: null
bookmarked: false
---

Generate interview questions for the following job description and required skills:
Job Description: {job_description}
Required Skills: {required_skills}

