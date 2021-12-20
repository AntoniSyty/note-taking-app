const { promisify } = require("util");
const request = promisify(require("request"));
const notesCount = 10;

// This file tests main functionalities
const run = async () => {
  let result;
  var baseUrl = process.argv.slice(2)[0];
  if (!baseUrl) {
    console.log(
      "Please define the baseUrl. Example: npm run test https://example.com/Prod"
    );
    return;
  }

  console.log("\nSign up as user 'test'\n");
  result = await sendRequest({
    method: "POST",
    url: baseUrl + "signup",
    body: {
      username: "test",
      password: "Abc123!"
    }
  });
  console.log(result);

  console.log("\nSign in as user 'test'\n");
  result = await sendRequest({
    method: "POST",
    url: baseUrl + "/signin",
    body: {
      username: "test",
      password: "Abc123!",
    },
  });
  console.log(result);
  const { token } = result;

  console.log(`\nCreate ${notesCount} new notes\n`);
  for (let i = 0; i < notesCount; i++) {
    result = await sendRequest({
      method: "POST",
      url: baseUrl + "/notes",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
    });
  }

  console.log("\nGet five notes:\n");
  result = await sendRequest({
    method: "GET",
    url: baseUrl + "/notes",
    headers: {
      Authorization: "Bearer " + token,
    },
    qs: {
      limit: 5,
    },
  });
  console.log(result);

  let cursor = result.cursor.after;

  console.log("\nGet the next five notes using the cursor:\n");
  result = await sendRequest({
    method: "GET",
    url: baseUrl + "/notes",
    headers: {
      Authorization: "Bearer " + token,
    },
    qs: {
      limit: 5,
      cursor: cursor,
    },
  });
  console.log(result);

  let experimentalNoteId = result.data[0].noteId;

  console.log(`\nUpdate note with noteId ${experimentalNoteId}:\n`);
  await sendRequest({
    method: "PUT",
    url: baseUrl + `/notes/${experimentalNoteId}`,
    headers: {
      Authorization: "Bearer " + token,
    },
    body: {
      text: "updated text",
    },
  });

  result = await sendRequest({
    method: "GET",
    url: baseUrl + `/notes/${experimentalNoteId}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  console.log(result);

  console.log(`\nDelete note with noteId ${experimentalNoteId}\n`);
  await sendRequest({
    method: "DELETE",
    url: baseUrl + `/notes/${experimentalNoteId}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  console.log("\nTests passed successfully. Thanks\n");
};

const sendRequest = async (options) => {
  if (options.body) options.body = JSON.stringify(options.body);
  const result = await request(options);
  if (result.statusCode >= 400) {
    throw new Error(`Something went wrong`);
  }
  try {
    return JSON.parse(result.body);
  } catch (e) {
    return result.body;
  }
};

run();
