import {FormShortDto} from './FormShortDto';

export interface FormShortDtoPaginatedResponse {
    items: FormShortDto[] | null;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}
