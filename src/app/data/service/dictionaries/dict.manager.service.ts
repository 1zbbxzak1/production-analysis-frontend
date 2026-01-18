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

@Injectable()
export class DictManagerService {

    private readonly _dict: DictService = inject(DictService);
    private readonly _error: ErrorHandler = inject(ErrorHandler);

    public getDepartments(): Observable<DepartmentDto[]> {
        return this._dict.getDepartments().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getDowntimeReasonGroups(): Observable<DowntimeReasonGroupDto[]> {
        return this._dict.getDowntimeReasonGroups().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getEmployees(): Observable<EmployeeDto[]> {
        return this._dict.getEmployees().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getPositions(): Observable<PositionDto[]> {
        return this._dict.getPositions().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getEnterprises(): Observable<EnterpriseDto[]> {
        return this._dict.getEnterprises().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getAuxiliaryOperations(): Observable<AuxiliaryOperationDto[]> {
        return this._dict.getAuxiliaryOperations().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getOperations(): Observable<OperationDto[]> {
        return this._dict.getOperations().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getProducts(): Observable<ProductDto[]> {
        return this._dict.getProducts().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getShifts(): Observable<ShiftDto[]> {
        return this._dict.getShifts().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createEmployee(employee: CreateEmployeeRequest): Observable<EmployeeDto> {
        return this._dict.createEmployee(employee).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateEmployee(id: number, employee: UpdateEmployeeRequest): Observable<EmployeeDto> {
        return this._dict.updateEmployee(id, employee).pipe(
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
}
