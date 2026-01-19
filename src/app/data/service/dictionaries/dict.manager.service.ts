import {ErrorHandler, inject, Injectable} from '@angular/core';
import {DictService} from "./dict.service";
import {catchError, NEVER, Observable} from "rxjs";
import {DepartmentDto} from "../../models/dictionaries/responses/DepartmentDto";
import {DowntimeReasonGroupDto} from "../../models/dictionaries/responses/DowntimeReasonGroupDto";
import {EmployeeDto} from "../../models/dictionaries/responses/EmployeeDto";
import {EnterpriseDto} from "../../models/dictionaries/responses/EnterpriseDto";
import {AuxiliaryOperationDto} from "../../models/dictionaries/responses/AuxiliaryOperationDto";
import {OperationDto} from "../../models/dictionaries/responses/OperationDto";
import {ProductDto} from "../../models/dictionaries/responses/ProductDto";
import {ShiftDto} from "../../models/dictionaries/responses/ShiftDto";
import {CreateEmployeeRequest} from '../../models/dictionaries/requests/CreateEmployeeRequest';
import {UpdateEmployeeRequest} from '../../models/dictionaries/requests/UpdateEmployeeRequest';
import {PositionDto} from '../../models/dictionaries/responses/PositionDto';
import {CreateDepartmentRequest} from '../../models/dictionaries/requests/CreateDepartmentRequest';
import {UpdateDepartmentRequest} from '../../models/dictionaries/requests/UpdateDepartmentRequest';
import {CreateDowntimeReasonGroupRequest} from '../../models/dictionaries/requests/CreateDowntimeReasonGroupRequest';
import {UpdateDowntimeReasonGroupRequest} from '../../models/dictionaries/requests/UpdateDowntimeReasonGroupRequest';
import {CreatePositionRequest} from '../../models/dictionaries/requests/CreatePositionRequest';
import {UpdatePositionRequest} from '../../models/dictionaries/requests/UpdatePositionRequest';
import {CreateEnterpriseRequest} from '../../models/dictionaries/requests/CreateEnterpriseRequest';
import {UpdateEnterpriseRequest} from '../../models/dictionaries/requests/UpdateEnterpriseRequest';
import {CreateAuxiliaryOperationRequest} from '../../models/dictionaries/requests/CreateAuxiliaryOperationRequest';
import {UpdateAuxiliaryOperationRequest} from '../../models/dictionaries/requests/UpdateAuxiliaryOperationRequest';
import {CreateOperationRequest} from '../../models/dictionaries/requests/CreateOperationRequest';
import {UpdateOperationRequest} from '../../models/dictionaries/requests/UpdateOperationRequest';
import {CreateProductRequest} from '../../models/dictionaries/requests/CreateProductRequest';
import {UpdateProductRequest} from '../../models/dictionaries/requests/UpdateProductRequest';
import {CreateShiftRequest} from '../../models/dictionaries/requests/CreateShiftRequest';
import {UpdateShiftRequest} from '../../models/dictionaries/requests/UpdateShiftRequest';

@Injectable()
export class DictManagerService {

    private readonly _dict: DictService = inject(DictService);
    private readonly _error: ErrorHandler = inject(ErrorHandler);

    // Department
    public getDepartments(): Observable<DepartmentDto[]> {
        return this._dict.getDepartments().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createDepartment(request: CreateDepartmentRequest): Observable<DepartmentDto> {
        return this._dict.createDepartment(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateDepartment(id: number, request: UpdateDepartmentRequest): Observable<DepartmentDto> {
        return this._dict.updateDepartment(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteDepartment(id: number): Observable<void> {
        return this._dict.deleteDepartment(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // DowntimeReasonGroup
    public getDowntimeReasonGroups(): Observable<DowntimeReasonGroupDto[]> {
        return this._dict.getDowntimeReasonGroups().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createDowntimeReasonGroup(request: CreateDowntimeReasonGroupRequest): Observable<DowntimeReasonGroupDto> {
        return this._dict.createDowntimeReasonGroup(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateDowntimeReasonGroup(id: number, request: UpdateDowntimeReasonGroupRequest): Observable<DowntimeReasonGroupDto> {
        return this._dict.updateDowntimeReasonGroup(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteDowntimeReasonGroup(id: number): Observable<void> {
        return this._dict.deleteDowntimeReasonGroup(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // Employee
    public getEmployees(): Observable<EmployeeDto[]> {
        return this._dict.getEmployees().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createEmployee(request: CreateEmployeeRequest): Observable<EmployeeDto> {
        return this._dict.createEmployee(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateEmployee(id: number, request: UpdateEmployeeRequest): Observable<EmployeeDto> {
        return this._dict.updateEmployee(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteEmployee(id: number): Observable<void> {
        return this._dict.deleteEmployee(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // Position
    public getPositions(): Observable<PositionDto[]> {
        return this._dict.getPositions().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createPosition(request: CreatePositionRequest): Observable<PositionDto> {
        return this._dict.createPosition(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updatePosition(id: number, request: UpdatePositionRequest): Observable<PositionDto> {
        return this._dict.updatePosition(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deletePosition(id: number): Observable<void> {
        return this._dict.deletePosition(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // Enterprise
    public getEnterprises(): Observable<EnterpriseDto[]> {
        return this._dict.getEnterprises().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createEnterprise(request: CreateEnterpriseRequest): Observable<EnterpriseDto> {
        return this._dict.createEnterprise(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateEnterprise(id: number, request: UpdateEnterpriseRequest): Observable<EnterpriseDto> {
        return this._dict.updateEnterprise(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteEnterprise(id: number): Observable<void> {
        return this._dict.deleteEnterprise(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // AuxiliaryOperation
    public getAuxiliaryOperations(): Observable<AuxiliaryOperationDto[]> {
        return this._dict.getAuxiliaryOperations().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createAuxiliaryOperation(request: CreateAuxiliaryOperationRequest): Observable<AuxiliaryOperationDto> {
        return this._dict.createAuxiliaryOperation(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateAuxiliaryOperation(id: number, request: UpdateAuxiliaryOperationRequest): Observable<AuxiliaryOperationDto> {
        return this._dict.updateAuxiliaryOperation(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteAuxiliaryOperation(id: number): Observable<void> {
        return this._dict.deleteAuxiliaryOperation(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // Operation
    public getOperations(): Observable<OperationDto[]> {
        return this._dict.getOperations().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createOperation(request: CreateOperationRequest): Observable<OperationDto> {
        return this._dict.createOperation(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateOperation(id: number, request: UpdateOperationRequest): Observable<OperationDto> {
        return this._dict.updateOperation(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteOperation(id: number): Observable<void> {
        return this._dict.deleteOperation(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // Product
    public getProducts(): Observable<ProductDto[]> {
        return this._dict.getProducts().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createProduct(request: CreateProductRequest): Observable<ProductDto> {
        return this._dict.createProduct(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateProduct(id: number, request: UpdateProductRequest): Observable<ProductDto> {
        return this._dict.updateProduct(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteProduct(id: number): Observable<void> {
        return this._dict.deleteProduct(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    // Shift
    public getShifts(): Observable<ShiftDto[]> {
        return this._dict.getShifts().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createShift(request: CreateShiftRequest): Observable<ShiftDto> {
        return this._dict.createShift(request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateShift(id: number, request: UpdateShiftRequest): Observable<ShiftDto> {
        return this._dict.updateShift(id, request).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteShift(id: number): Observable<void> {
        return this._dict.deleteShift(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }


}
