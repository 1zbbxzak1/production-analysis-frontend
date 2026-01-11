import {PaTypeDto} from '../enums/PaTypeDto';
import {FormStatus} from '../enums/FormStatus';
import {FormContextDto} from '../FormContextDto';
import {FormRowDto} from './FormRowDto';
import {FormTemplateDto} from '../FormTemplateDto';

export interface FormDto {
    id: number;
    paType: PaTypeDto;
    status: FormStatus;
    creationDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    updateDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    context: FormContextDto;
    rows: FormRowDto[] | null;
    template: FormTemplateDto;
    totalValues?: Record<number, any> | null;
}
