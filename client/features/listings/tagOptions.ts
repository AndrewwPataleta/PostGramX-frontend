export interface TagCategory {
  title: string;
  tags: string[];
}

export const listingTagCategories: TagCategory[] = [
  {
    title: "Prohibited / Restricted content",
    tags: [
      "Casino",
      "Betting",
      "Gambling",
      "Adult content",
      "Crypto tokens / ICO",
      "Financial advice",
      "Political ads",
      "Supplements / pills",
    ],
  },
  {
    title: "Allowed formats / style",
    tags: [
      "Links allowed",
      "Promo codes allowed",
      "Giveaway allowed",
      "NSFW not allowed",
      "English only",
      "Russian allowed",
    ],
  },
  {
    title: "Post control",
    tags: ["Can edit after posting", "No edits after posting", "Must be pre-approved"],
  },
];

export const flattenTagOptions = (categories: TagCategory[]): string[] =>
  categories.flatMap((category) => category.tags);
