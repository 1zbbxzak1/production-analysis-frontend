import {OperationDto} from "./OperationDto";

export interface ProductDto {
    id: number;
    name: string | null;
    tactTime: string; // формат: 00:30:00 (30 мин)
    enterpriseId: number;
    SubOperations: OperationDto[] | null;
}
