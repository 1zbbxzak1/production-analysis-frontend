import {FormRowValueDto} from '../FormRowValueDto';

export interface FormRowDto {
    order: number;
    isAuxiliaryOperation: boolean;
    productId: number | null;
    groupKey: number | null;
    values: Record<string, FormRowValueDto> | null;
}
