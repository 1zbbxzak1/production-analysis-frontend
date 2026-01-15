import {FormStatus} from '../enums/FormStatus';

export interface SearchFormsFilterDto {
    departmentId: number | null;
    status: FormStatus | null;
    pageNumber: number;
    pageSize: number;
}
