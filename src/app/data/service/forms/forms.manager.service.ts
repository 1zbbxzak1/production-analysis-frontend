import {ErrorHandler, inject, Injectable} from '@angular/core';
import {FormsService} from './forms.service';
import {SearchFormsFilterDto} from '../../models/forms/requests/SearchFormsFilterDto';
import {catchError, NEVER, Observable} from 'rxjs';
import {FormShortDtoPaginatedResponse} from '../../models/forms/responses/FormShortDtoPaginatedResponse';
import {CreateFormRequest} from '../../models/forms/requests/CreateFormRequest';
import {FormShortDto} from '../../models/forms/responses/FormShortDto';
import {FormDto} from '../../models/forms/responses/FormDto';
import {FormRowDto} from '../../models/forms/responses/FormRowDto';
import {UpdateFormRowRequest} from '../../models/forms/requests/UpdateFormRowRequest';
import {UpdateFormRowResponse} from '../../models/forms/responses/UpdateFormRowResponse';
import {FormCountsDto} from '../../models/forms/responses/FormCountsDto';

@Injectable()
export class FormsManagerService {

    private readonly _forms: FormsService = inject(FormsService);
    private readonly _error: ErrorHandler = inject(ErrorHandler);

    public searchForms(filter: SearchFormsFilterDto): Observable<FormShortDtoPaginatedResponse> {
        return this._forms.searchForms(filter).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public createNewForm(create: CreateFormRequest): Observable<FormShortDto> {
        return this._forms.createNewForm(create).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getFormById(id: number): Observable<FormDto> {
        return this._forms.getFormById(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getFormRows(id: number): Observable<FormRowDto[]> {
        return this._forms.getFormRows(id).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateFormRow(formId: number, rowOrder: number, values: UpdateFormRowRequest): Observable<UpdateFormRowResponse> {
        return this._forms.updateFormRow(formId, rowOrder, values).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public completeForm(formId: number): Observable<void> {
        return this._forms.completeForm(formId).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public getFormCounts(): Observable<FormCountsDto> {
        return this._forms.getFormCounts().pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteForm(formId: number): Observable<void> {
        return this._forms.deleteForm(formId).pipe(
            catchError(err => {
                this._error.handleError(err);
                return NEVER;
            }),
        );
    }
}
