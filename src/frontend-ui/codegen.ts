import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema:
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    "https://d531fgj3c7.execute-api.us-east-1.amazonaws.com",
  documents: ["src/**/*.{gql,graphql}"],
  generates: {
    "./src/graphql/__generated__/schema.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
