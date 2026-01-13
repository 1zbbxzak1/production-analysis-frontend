import {PaTypeDto} from '../enums/PaTypeDto';
import {ProductContextDto} from '../ProductContextDto';
import {OperationOrProductContextDto} from '../OperationOrProductContextDto';

export interface CreateFormRequest {
    paType: PaTypeDto;
    shiftId: number;
    assigneeId: number;
    formDate: string; // на беке 0001-01-01T00:00:00
    product: ProductContextDto | null;
    products: ProductContextDto[] | null;
    operationOrProduct: OperationOrProductContextDto | null;
}
