import {PaTypeDto} from '../enums/PaTypeDto';
import {ProductContextDto} from '../ProductContextDto';
import {OperationOrProductContextDto} from '../OperationOrProductContextDto';

export interface CreateFormRequest {
    paType: PaTypeDto;
    shiftId: number;
    assigneeId: number;
    product: ProductContextDto;
    products: ProductContextDto[] | null;
    operationOrProduct: OperationOrProductContextDto;
}
