import {PaTypeDto} from '../enums/PaTypeDto';
import {FormStatus} from '../enums/FormStatus';
import {EmployeeDto} from '../../dictionaries/responses/EmployeeDto';

export interface FormShortDto {
    id: number;
    paType: PaTypeDto;
    status: FormStatus;
    creationDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    updateDate: string; // UTC на беке 2026-01-10T08:34:03.2005829Z
    departmentId: number;
    creator: EmployeeDto;
    assignee: EmployeeDto;
}
