import {FormStatus} from '../enums/FormStatus';

export interface SearchFormsFilterDto {
    departmentId: number | null;
    status: FormStatus;
    pageNumber: number;
    pageSize: number;
}
