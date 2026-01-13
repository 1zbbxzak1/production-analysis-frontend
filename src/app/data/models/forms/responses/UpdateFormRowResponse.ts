import {FormRowDto} from './FormRowDto';

export interface UpdateFormRowResponse {
    rows: FormRowDto[] | null;
    totals: Record<number, any> | null;
}
