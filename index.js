import alfy from "alfy";
import he from "he";
import base64 from "base-64";
import alfredNotifier from "alfred-notifier";
alfredNotifier();

let query = process.argv[2];

if (!process.env.BASE_URL) {
  throw "BASE_URL evironment variable not set";
}
if (!process.env.USERNAME) {
  throw "USERNAME evironment variable not set";
}
if (!process.env.API_TOKEN) {
  throw "API_TOKEN evironment variable not set";
}

let baseUrl = process.env.BASE_URL;

let url = `${baseUrl}/wiki/rest/quicknav/1/search?query=${query}`;
let username = process.env.USERNAME;
let apiToken = process.env.API_TOKEN;

// const response = await fetch(url, {
//   method: "GET",
//   headers: headers,
// });
// const body = await response.json();

const data = await alfy.fetch(url, {
  headers: {
    Authorization: "Basic " + base64.encode(`${username}:${apiToken}`),
  },
});

const items = [];

const classNames = ["content-type-page", "content-type-blogpost", "search-for"];

if (data?.contentNameMatches?.length > 0) {
  const contentGroups = [data.contentNameMatches[0]];

  for (const contentGroup of contentGroups) {
    for (const content of contentGroup) {
      if (classNames.includes(content.className)) {
        items.push({
          title: he.decode(content.name),
          subtitle: `${baseUrl}${content.href}`,
          arg: `${baseUrl}${content.href}`,
        });
      }
    }
  }
}

alfy.output(items);
