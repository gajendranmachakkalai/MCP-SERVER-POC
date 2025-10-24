import http from "./http";

export function fetchEmployees() {
    return http.get("/employee");
}

export function fetchEmployeeById(id: number) {
    return http.get(`/employee/${id}`);
}