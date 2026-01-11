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

@Injectable()
export class DictService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _api: string = `${environment.api}/dictionaries`;

    public getDepartments(): Observable<DepartmentDto[]> {
        return this._http.get<DepartmentDto[]>(`${this._api}/departments`);
    }

    public getDowntimeReasonGroups(): Observable<DowntimeReasonGroupDto[]> {
        return this._http.get<DowntimeReasonGroupDto[]>(`${this._api}/downtime-reason-groups`);
    }

    public getEmployees(): Observable<EmployeeDto[]> {
        return this._http.get<EmployeeDto[]>(`${this._api}/employees`);
    }

    public getEnterprises(): Observable<EnterpriseDto[]> {
        return this._http.get<EnterpriseDto[]>(`${this._api}/enterprises`);
    }

    public getAuxiliaryOperations(): Observable<AuxiliaryOperationDto[]> {
        return this._http.get<AuxiliaryOperationDto[]>(`${this._api}/auxiliary-operations`);
    }

    public getOperations(): Observable<OperationDto[]> {
        return this._http.get<OperationDto[]>(`${this._api}/operations`);
    }

    public getProducts(): Observable<ProductDto[]> {
        return this._http.get<ProductDto[]>(`${this._api}/products`);
    }

    public getShifts(): Observable<ShiftDto[]> {
        return this._http.get<ShiftDto[]>(`${this._api}/shifts`);
    }
}
