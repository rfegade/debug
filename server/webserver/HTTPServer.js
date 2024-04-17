import http from "http";

import url from "url";

import authenticateUser from "../utils/authenticateUser";
import validateInput from "../utils/validateInput";
import Request from "./Request";

class HTTPServer {
  constructor(config) {
    this._config = config;
    this._server = null;
  }

  start() {
    const requestHandler = this.requestHandler.bind(this);
    this._server = http.createServer(requestHandler).listen(8009);
  }

  async stop() {
    await this._server.close();
  }

  async requestHandler(httpRequest, response) {
    try {
      // console.log("Incoming request:", httpRequest.url);
      const queryData = url.parse(httpRequest.url, true).query;
      const request = new Request(queryData, httpRequest, response);

      // console.log("request", request);

      try {
        await authenticateUser(request, queryData);
      } catch (error) {
        // console.error("Authentication error:", error);
        request.setData(queryData);
        request.error("unauthorized");
        return;
      }

      const path = request.getPath();
      // console.log("Request path:", path);

      const endpoint = this._config.endpoints[path];
      if (!endpoint) {
        // console.error("Endpoint not found:", path);
        response.writeHead(404);
        response.end("Not Found");
        return;
      }

      const error = validateInput.validate(endpoint.data, request.getData());
      if (error) {
        // console.error("Input validation error:", validationError);
        const timestamp = `[${new Date().toISOString()}]`;
        request.fail("invalid input");
        return;
      }

      // console.log("Handling endpoint:", path);
      endpoint.respond(request);
    } catch (error) {
      // console.error("Server error:", error);
      response.writeHead(500);
      response.end("Internal Server Error");
    }
  }
}

module.exports = HTTPServer;
