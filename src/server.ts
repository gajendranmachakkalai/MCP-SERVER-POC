import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "./server/tools";
import express from "express";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

async function main(){
    const server = new McpServer({
        name: "CES MCP Server",
        version: "1.0.0",
    });
    registerTools(server);
    // const transport = new StdioServerTransport();
    // await server.connect(transport);

    // const transports = {
    //     streamable: {} as Record<string, StreamableHTTPServerTransport>,
    //     sse: {} as Record<string, SSEServerTransport>,
    // }
    
    const app = express();
    app.use(express.json());
    
    app.get("/healthcheck", (_req, res) => res.send("MCP Server is running!"));
    
    app.post("/mcp", async (req, res) => {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            enableJsonResponse: true,
        });

        res.on("close", () => {
            transport.close();
        });

        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });

    // app.get("/sse", async (_req, res) => {
    //     const transport = new SSEServerTransport("/message", res);
    //     transports.sse[transport.sessionId] = transport;
    //     res.on("close", () => {
    //         delete transports.sse[transport.sessionId];
    //     });
    //     await server.connect(transport);
    // });

    // app.post("/message", async (req, res) => {
    //     const sessionId = req.query.sessionId as string;
    //     const transport = transports.sse[sessionId];
    //     if (transport) {
    //         await transport.handlePostMessage(req, res, req.body);
    //     } else {
    //         res.status(400).send("No transport found for the given sessionId");
    //     }
    // });

    dotenv.config(); 
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`MCP Server is running on http://localhost:${port}/mcp`);
    });
    console.log("Server is ready.");
}

main().catch(console.error);