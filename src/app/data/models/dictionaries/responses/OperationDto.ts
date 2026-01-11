import {OperationBasedOnType} from '../enums/OperationBasedOnType';

export interface OperationDto {
    id: number;
    name: string | null;
    duration: string; // формат: 00:30:00 (30 мин)
    basedOnType: OperationBasedOnType;
    basedOperationId: number | null;
    basedProductId: number | null;
}
