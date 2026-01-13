import {PaTypeDto} from '../enums/PaTypeDto';
import {FormStatus} from '../enums/FormStatus';
import {FormContextDto} from '../FormContextDto';
import {FormRowDto} from './FormRowDto';
import {FormTemplateDto} from '../FormTemplateDto';
import {ShiftDto} from '../../dictionaries/responses/ShiftDto';
import {DepartmentDto} from '../../dictionaries/responses/DepartmentDto';

export interface FormDto {
    id: number;
    paType: PaTypeDto;
    status: FormStatus;
    creationDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    updateDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    formDate: string; // на беке 0001-01-01T00:00:00
    shift: ShiftDto;
    department: DepartmentDto;
    context: FormContextDto;
    rows: FormRowDto[] | null;
    template: FormTemplateDto;
    totalValues: Record<number, any> | null;
}
