import {OperationBasedOnType} from '../enums/OperationBasedOnType';

export interface CreateOperationRequest {
    name: string;
    durationInSeconds: number | null;
    basedOnType: OperationBasedOnType;
    basedOperationId: number | null;
    basedProductId: number | null;
}
