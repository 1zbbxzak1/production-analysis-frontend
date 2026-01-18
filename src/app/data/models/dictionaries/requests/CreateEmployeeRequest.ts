export interface CreateEmployeeRequest {
    firstName: string;
    lastName: string;
    middleName: string | null;
    positionId: number;
    email: string | null;
    departmentId: number;
}
