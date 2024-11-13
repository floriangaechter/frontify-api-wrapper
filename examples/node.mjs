import { createClient } from "frontify-api-wrapper";

const client = await createClient({
  baseUrl: "",
  token: "",
});

const result = await client.query({
  query: `
    query CurrentUser {
      currentUser {
        id
        email
        avatar
        name
      }
    }
  `,
  variables: {},
});

console.log(result.data);
