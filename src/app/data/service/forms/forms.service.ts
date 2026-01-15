import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SearchFormsFilterDto} from '../../models/forms/requests/SearchFormsFilterDto';
import {Observable} from 'rxjs';
import {FormShortDtoPaginatedResponse} from '../../models/forms/responses/FormShortDtoPaginatedResponse';
import {CreateFormRequest} from '../../models/forms/requests/CreateFormRequest';
import {FormShortDto} from '../../models/forms/responses/FormShortDto';
import {FormDto} from '../../models/forms/responses/FormDto';
import {FormRowDto} from '../../models/forms/responses/FormRowDto';
import {UpdateFormRowRequest} from '../../models/forms/requests/UpdateFormRowRequest';
import {UpdateFormRowResponse} from '../../models/forms/responses/UpdateFormRowResponse';
import {FormCountsDto} from '../../models/forms/responses/FormCountsDto';

@Injectable()
export class FormsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _api: string = `${environment.api}/forms`;

    public searchForms(filter: SearchFormsFilterDto): Observable<FormShortDtoPaginatedResponse> {
        return this._http.post<FormShortDtoPaginatedResponse>(`${this._api}/search`, filter);
    }

    public createNewForm(create: CreateFormRequest): Observable<FormShortDto> {
        return this._http.post<FormShortDto>(`${this._api}`, create);
    }

    public getFormById(id: number): Observable<FormDto> {
        return this._http.get<FormDto>(`${this._api}/${id}`);
    }

    public getFormRows(id: number): Observable<FormRowDto[]> {
        return this._http.get<FormRowDto[]>(`${this._api}/${id}/rows`);
    }

    public updateFormRow(formId: number, rowOrder: number, values: UpdateFormRowRequest): Observable<UpdateFormRowResponse> {
        return this._http.put<UpdateFormRowResponse>(`${this._api}/${formId}/rows/${rowOrder}`, values);
    }

    public completeForm(formId: number): Observable<void> {
        return this._http.post<void>(`${this._api}/${formId}/complete`, formId);
    }

    public getFormCounts(): Observable<FormCountsDto> {
        return this._http.get<FormCountsDto>(`${this._api}/counts`);
    }

    public deleteForm(formId: number): Observable<void> {
        return this._http.delete<void>(`${this._api}/${formId}`);
    }
}
