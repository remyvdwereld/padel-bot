import axios from "axios";

// https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html
type DiscordMessage = {
  username?: string; // Describes the username of the user, limited to 1-80 characters.
  content: string; // Contains the main content of the comment, limited to 2000 characters.
  embeds?: {
    title?: string; // Represents the title of the comment, limited to 256 characters.
    description?: string; // Describes the detailed information of the comment, limited to 4096 characters.
    fields?: {
      name: string; // Represents the name of each field, limited to 256 characters.
      value: string; // Contains the value of each field, limited to 1024 characters.
    }[];
  }[]; // Indicates the number of embed objects, limited to 10.
  author?: {
      name: string; // Specifies the name of the author, limited to 256 characters.
  };
  footer?: {
      text: string; // Describes the footer text, limited to 2048 characters.
  };
};

export const sendDiscordMessage = (message:DiscordMessage) => {
  const url = process.env.DISCORD_WEBHOOK_URL
  if (url) {
    axios.post(url, message)
    .catch((error) => {
      console.log("Error sending Discord message:", error);
    });
  } else {
    console.log("No DISCORD_WEBHOOK_URL variable found in .env file")
  }

};
