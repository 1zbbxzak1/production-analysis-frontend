import {OperationBasedOnType} from '../enums/OperationBasedOnType';

export interface UpdateOperationRequest {
    name: string;
    durationInSeconds: number | null;
    basedOnType: OperationBasedOnType;
    basedOperationId: number | null;
    basedProductId: number | null;
}
