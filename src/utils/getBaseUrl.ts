export const ERROR_MESSAGES = {
  PROTOCOL_ERROR: "Invalid baseUrl: HTTPS is required.",
  BASE_URL_ERROR: "Invalid baseUrl: ",
};

export const getBaseUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "https:") {
      throw new Error(ERROR_MESSAGES.PROTOCOL_ERROR);
    }

    // Ensure no trailing slash and append '/graphql'
    return `${parsedUrl.origin}/graphql`;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(ERROR_MESSAGES.BASE_URL_ERROR + error.message);
    } else {
      throw new Error(ERROR_MESSAGES.BASE_URL_ERROR + error);
    }
  }
};
