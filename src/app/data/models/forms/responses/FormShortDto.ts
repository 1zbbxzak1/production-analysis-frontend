import {PaTypeDto} from '../enums/PaTypeDto';
import {FormStatus} from '../enums/FormStatus';
import {EmployeeDto} from '../../dictionaries/responses/EmployeeDto';
import {ShiftDto} from '../../dictionaries/responses/ShiftDto';

export interface FormShortDto {
    id: number;
    paType: PaTypeDto;
    status: FormStatus;
    creationDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    updateDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    formDate: string; // на беке 0001-01-01T00:00:00
    departmentId: number;
    creator: EmployeeDto;
    assignee: EmployeeDto;
    productNames: string | null;
    shift: ShiftDto;
}
