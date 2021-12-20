exports.handler = async () => ({
  statusCode: 200,
  headers: { "Access-Control-Allow-Origin": "*" },
  body: JSON.stringify({
    endpoints: [
      {
        title: "Sign Up",
        method: "POST",
        url: "/Prod/singup",
        statusCode: 201,
        requestBody: {
          username: "string",
          password: "string",
        },
      },
      {
        title: "Sign In",
        method: "POST",
        url: "/Prod/singin",
        statusCode: 201,
        requestBody: {
          username: "string",
          password: "string",
        },
        responseBody: {
          token: "string",
        },
      },
      {
        title: "Create note",
        method: "POST",
        url: "/Prod/notes",
        statusCode: 201,
        responseBody: {
          data: [
            {
              noteId: "string",
              text: "string",
            },
          ],
        },
      },
      {
        title: "Update note",
        method: "PUT",
        url: "/Prod/notes",
        statusCode: 200,
        responseBody: {
          data: [
            {
              noteId: "string",
              text: "string",
            },
          ],
        },
      },
      {
        title: "List notes",
        method: "GET",
        url: "/Prod/notes",
        statusCode: 200,
        queryParameters: {
          limit: "number",
          cursor: "string",
        },
        responseBody: {
          data: [
            {
              noteId: "string",
              text: "string",
            },
          ],
          cursor: {
            after: "string",
          },
        },
      },
      {
        title: "Delete note",
        method: "DELETE",
        url: "/Prod/notes/{noteId}",
        statusCode: 204,
      },
    ],
  }),
});
