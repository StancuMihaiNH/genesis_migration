type Model = {
  displayName: string;
  id: string;
};

export const models: Model[] = [
  {
    displayName: "GPT 4",
    id: "gpt-4",
  },
  {
    displayName: "Claude Opus 3",
    id: "claude-3-opus",
  },
  {
    displayName: "NH Q&A",
    id: "nh-qa",
  },
];

export const getModelName = (id: string) => {
  return models.find((model) => model.id === id)?.displayName;
};
