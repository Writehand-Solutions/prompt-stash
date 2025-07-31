import fs from "fs/promises";
import yaml from "js-yaml";
import slugify from "slugify";
import { prompts } from "../lib/data/default-prompts"; // Adjust path as needed

async function migratePromptsToMarkdown() {
  try {
    // Create directory if it doesn't exist
    await fs.mkdir("prompts", { recursive: true });

    for (const prompt of prompts) {
      // Destructure prompt, separating template from other properties
      const { template, ...frontMatter } = prompt;

      // Generate slug from title
      const slug = slugify(prompt.title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });

      // Create markdown content with YAML front matter
      const markdownContent = `---
${yaml.dump(frontMatter, {
        lineWidth: -1, // Prevent line wrapping
        noRefs: true // Handle circular references
      })}---
${template ? `\n${template}\n` : ""}
`;

      // Write to file
      const filePath = `prompts/${slug}.md`;
      await fs.writeFile(filePath, markdownContent, "utf8");

      console.log(`✅ Created: ${filePath}`);
    }

    console.log("✅ All prompts successfully exported to prompts");
  } catch (error) {
    console.error("❌ Error migrating prompts:", error);
    process.exit(1);
  }
}

// Execute the migration
migratePromptsToMarkdown();
