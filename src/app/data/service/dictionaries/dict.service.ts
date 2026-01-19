import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {DepartmentDto} from '../../models/dictionaries/responses/DepartmentDto';
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
export class DictService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _api: string = `${environment.api}/dictionaries`;

    // Department
    public getDepartments(): Observable<DepartmentDto[]> {
        return this._http.get<DepartmentDto[]>(`${this._api}/departments`);
    }

    public createDepartment(request: CreateDepartmentRequest): Observable<DepartmentDto> {
        return this._http.post<DepartmentDto>(`${this._api}/departments`, request);
    }

    public updateDepartment(id: number, request: UpdateDepartmentRequest): Observable<DepartmentDto> {
        return this._http.put<DepartmentDto>(`${this._api}/departments/${id}`, request);
    }

    public deleteDepartment(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/departments/${id}`);
    }

    // DowntimeReasonGroup
    public getDowntimeReasonGroups(): Observable<DowntimeReasonGroupDto[]> {
        return this._http.get<DowntimeReasonGroupDto[]>(`${this._api}/downtime-reason-groups`);
    }

    public createDowntimeReasonGroup(request: CreateDowntimeReasonGroupRequest): Observable<DowntimeReasonGroupDto> {
        return this._http.post<DowntimeReasonGroupDto>(`${this._api}/downtime-reason-groups`, request);
    }

    public updateDowntimeReasonGroup(id: number, request: UpdateDowntimeReasonGroupRequest): Observable<DowntimeReasonGroupDto> {
        return this._http.put<DowntimeReasonGroupDto>(`${this._api}/downtime-reason-groups/${id}`, request);
    }

    public deleteDowntimeReasonGroup(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/downtime-reason-groups/${id}`);
    }

    // Employee
    public getEmployees(): Observable<EmployeeDto[]> {
        return this._http.get<EmployeeDto[]>(`${this._api}/employees`);
    }

    public createEmployee(request: CreateEmployeeRequest): Observable<EmployeeDto> {
        return this._http.post<EmployeeDto>(`${this._api}/employees`, request);
    }

    public updateEmployee(id: number, request: UpdateEmployeeRequest): Observable<EmployeeDto> {
        return this._http.put<EmployeeDto>(`${this._api}/employees/${id}`, request);
    }

    public deleteEmployee(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/employees/${id}`);
    }

    // Position
    public getPositions(): Observable<PositionDto[]> {
        return this._http.get<PositionDto[]>(`${this._api}/positions`);
    }

    public createPosition(request: CreatePositionRequest): Observable<PositionDto> {
        return this._http.post<PositionDto>(`${this._api}/positions`, request);
    }

    public updatePosition(id: number, request: UpdatePositionRequest): Observable<PositionDto> {
        return this._http.put<PositionDto>(`${this._api}/positions/${id}`, request);
    }

    public deletePosition(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/positions/${id}`);
    }

    // Enterprise
    public getEnterprises(): Observable<EnterpriseDto[]> {
        return this._http.get<EnterpriseDto[]>(`${this._api}/enterprises`);
    }

    public createEnterprise(request: CreateEnterpriseRequest): Observable<EnterpriseDto> {
        return this._http.post<EnterpriseDto>(`${this._api}/enterprises`, request);
    }

    public updateEnterprise(id: number, request: UpdateEnterpriseRequest): Observable<EnterpriseDto> {
        return this._http.put<EnterpriseDto>(`${this._api}/enterprises/${id}`, request);
    }

    public deleteEnterprise(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/enterprises/${id}`);
    }

    // AuxiliaryOperation
    public getAuxiliaryOperations(): Observable<AuxiliaryOperationDto[]> {
        return this._http.get<AuxiliaryOperationDto[]>(`${this._api}/auxiliary-operations`);
    }

    public createAuxiliaryOperation(request: CreateAuxiliaryOperationRequest): Observable<AuxiliaryOperationDto> {
        return this._http.post<AuxiliaryOperationDto>(`${this._api}/auxiliary-operations`, request);
    }

    public updateAuxiliaryOperation(id: number, request: UpdateAuxiliaryOperationRequest): Observable<AuxiliaryOperationDto> {
        return this._http.put<AuxiliaryOperationDto>(`${this._api}/auxiliary-operations/${id}`, request);
    }

    public deleteAuxiliaryOperation(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/auxiliary-operations/${id}`);
    }

    // Operation
    public getOperations(): Observable<OperationDto[]> {
        return this._http.get<OperationDto[]>(`${this._api}/operations`);
    }

    public createOperation(request: CreateOperationRequest): Observable<OperationDto> {
        return this._http.post<OperationDto>(`${this._api}/operations`, request);
    }

    public updateOperation(id: number, request: UpdateOperationRequest): Observable<OperationDto> {
        return this._http.put<OperationDto>(`${this._api}/operations/${id}`, request);
    }

    public deleteOperation(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/operations/${id}`);
    }

    // Product
    public getProducts(): Observable<ProductDto[]> {
        return this._http.get<ProductDto[]>(`${this._api}/products`);
    }

    public createProduct(request: CreateProductRequest): Observable<ProductDto> {
        return this._http.post<ProductDto>(`${this._api}/products`, request);
    }

    public updateProduct(id: number, request: UpdateProductRequest): Observable<ProductDto> {
        return this._http.put<ProductDto>(`${this._api}/products/${id}`, request);
    }

    public deleteProduct(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/products/${id}`);
    }

    // Shift
    public getShifts(): Observable<ShiftDto[]> {
        return this._http.get<ShiftDto[]>(`${this._api}/shifts`);
    }

    public createShift(request: CreateShiftRequest): Observable<ShiftDto> {
        return this._http.post<ShiftDto>(`${this._api}/shifts`, request);
    }

    public updateShift(id: number, request: UpdateShiftRequest): Observable<ShiftDto> {
        return this._http.put<ShiftDto>(`${this._api}/shifts/${id}`, request);
    }

    public deleteShift(id: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/shifts/${id}`);
    }


}
