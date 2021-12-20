// Create a DocumentClient that represents the query to add an item
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient({
  params: { TableName: process.env.NOTES_TABLE },
});

exports.handler = async (event) => {
  switch (event.httpMethod.toLowerCase()) {
    case "put":
      return updateNote(event);
    case "post":
      return createNote(event);
    case "delete":
      return deleteNote(event);
    case "get":
      if (event.pathParameters) {
        return getNote(event);
      }

    default:
      return listNotes(event);
  }
};

// Called with API-GW event
const updateNote = async (event) => {
  const username = extractUsername(event);
  const body = JSON.parse(event.body);
  const { noteId } = event.pathParameters;
  const text = body.text;

  let params = {
    Key: {
      noteId: noteId,
      username: username,
    },
    UpdateExpression: "set #txt = :x",
    ExpressionAttributeValues: {
      ":x": text,
    },
    ExpressionAttributeNames: {
      "#txt": "text",
    },
  };

  try {
    await docClient.update(params).promise();
    return createResponse(null, 204);
  } catch (err) {
    return createResponse({ message: `Unable to update note: ${err}` }, 500);
  }
};

// Called with API-GW event
const createNote = async (event) => {
  const username = extractUsername(event);
  const body = JSON.parse(event.body);
  let params = {
    Item: {
      username: username,
      noteId: event.requestContext.requestId,
      text: body.text,
    },
  };

  try {
    await docClient.put(params).promise();
    return createResponse(null, 201);
  } catch (err) {
    responseBody = { message: `Unable to create note: ${err}` };
    return createResponse(responseBody, 500);
  }
};

// Called with API-GW event
const deleteNote = async (event) => {
  const username = extractUsername(event);
  const { noteId } = event.pathParameters;
  let params = {
    Key: {
      username: username,
      noteId: noteId,
    },
  };

  try {
    await docClient.delete(params).promise();
    return createResponse(null, 204);
  } catch (err) {
    return createResponse({ message: `Unable to delete note: ${err}` }, 500);
  }
};

// Called with API-GW event
const getNote = async (event) => {
  const username = extractUsername(event);
  const { noteId } = event.pathParameters;
  let params = {
    KeyConditionExpression: "username = :x and noteId = :y",
    ExpressionAttributeValues: {
      ":x": username,
      ":y": noteId,
    },
  };

  try {
    const result = await docClient.query(params).promise();
    let elements = [];
    elements.push({
      noteId: result.Items[0].noteId,
      text: result.Items[0].text,
    });

    responseBody = {
      data: elements,
    };

    return createResponse(responseBody);
  } catch (err) {
    responseBody = { message: `Unable to get note: ${err}` };
    return createResponse(responseBody, 500);
  }
};

// Called with API-GW event
const listNotes = async (event) => {
  const username = extractUsername(event);

  let cursor = "";
  let limit = 10;
  if (event.queryStringParameters) {
    cursor = event.queryStringParameters["cursor"];
    limit = event.queryStringParameters["limit"];
  }

  let params = {
    KeyConditionExpression: "username = :x",
    ExpressionAttributeValues: {
      ":x": username,
    },
    Limit: limit,
  };

  if (cursor) {
    params.ExclusiveStartKey = {
      username: username,
      noteId: cursor,
    };
  }

  let responseBody = "";
  let statusCode = 0;

  try {
    const data = await docClient.query(params).promise();
    let elements = [];
    data.Items.forEach((element) => {
      elements.push({ noteId: element.noteId, text: element.text });
    });
    responseBody = {
      data: elements,
      cursor: { after: data.LastEvaluatedKey.noteId },
    };
    statusCode = 200;
  } catch (err) {
    responseBody = { message: `Unable to get notes: ${err}` };
    statusCode = 500;
  }

  return createResponse(responseBody, statusCode);
};

// ============================== HELPERS ==============================

const extractUsername = (event) =>
  event.requestContext.authorizer.claims["cognito:username"];

const createResponse = (data, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
