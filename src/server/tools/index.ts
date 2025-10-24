import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";    
// import { EmployeeSchema } from "../../types/index.js";
import { EmployeeListSchema, EmployeeSchema } from "../../types";
import { fetchEmployees, fetchEmployeeById } from "../../services/employeeService";
export function registerTools(server: McpServer) {
 server.registerTool(
  "Get Employees",
  {
    title: "Get Employees",
    description: "Fetches a list of all employees from the Employee API.",
    outputSchema: EmployeeListSchema.shape,
  },
  async () => {
    const employeesResponse = await fetchEmployees();
    console.log("Employees Response:", employeesResponse);
    if (employeesResponse.status === 200) {
      const employeeList = employeesResponse.data;

      return {
        content: [
          {
            type: "text",
            // text: `Fetched ${validated.length} employees successfully.`
            text: JSON.stringify({ employeeList})
          }
        ],
        structuredContent: { employees: employeeList }
      };
    } else {
        return {
        content: [
          {
            type: "text",
            text: JSON.stringify({status: false, data : null})
          }
        ],
        structuredContent: { success: false, data: null }
      };
    }
  }
)

server.registerTool(
  "Get Employees By Id",
  {
    title: "Get Employees By Id",
    description: "fetches employee details by ID from the Employee API.",
    outputSchema: EmployeeSchema.shape,
    inputSchema: { 
        id: z.number().int().positive().describe("The ID of the employee to fetch.")
    }
  },
  async ({id}) => {
    const employeesResponse = await fetchEmployeeById(id);

    if (employeesResponse.status === 200) {
      const employeedata = employeesResponse.data;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ employeedata})
          }
        ],
        structuredContent: employeedata
      };
    } else {
        return {
        content: [
          {
            type: "text",
            text: JSON.stringify({status: false, data : null})
          }
        ],
        structuredContent: { success: false, data: null }
      };
    }
  });

};