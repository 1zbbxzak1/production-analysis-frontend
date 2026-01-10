import {Component, inject} from '@angular/core';
import {BackHeader} from '../components/back-header/back-header';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';
import {TuiComboBoxModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiInputDate, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {TuiDay} from '@taiga-ui/cdk';
import {Router} from '@angular/router';

@Component({
    selector: 'app-fifth-type',
    imports: [
        BackHeader,
        TuiDataListWrapper,
        TuiComboBoxModule,
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiStringifyContentPipe,
        TuiFilterByInputPipe,
        TuiTextfield,
        TuiInputDate,
        FormsModule,
        TuiButton,
    ],
    templateUrl: './fifth-type.html',
    styleUrl: './fifth-type.css',
})
export class FifthType {

    protected readonly controlOperators = new FormControl<{ name: string; surname: string } | null>(
        null,
    );
    protected readonly operators = [
        {name: 'John', surname: 'Cleese'},
        {name: 'Eric', surname: 'Idle'},
        {name: 'Graham', surname: 'Chapman'},
        {name: 'Michael', surname: 'Palin'},
        {name: 'Terry', surname: 'Gilliam'},
        {name: 'Terry', surname: 'Jones'},
    ];
    protected readonly controlDate = new FormControl<TuiDay | null>(null);
    protected readonly today = TuiDay.currentLocal();

    protected readonly controlShifts = new FormControl<string | null>(null);
    protected readonly shifts = [
        '08:00', '12:00', '14:00', '16:00', '17:00', '18:00',
    ];

    protected readonly controlProduct = new FormControl<string | null>(null);
    protected readonly product = [
        'Втулка', 'Напильник', 'Предмет'
    ];

    private readonly _router: Router = inject(Router);

    protected readonly stringify = (item: { name: string; surname: string }): string =>
        `${item.name} ${item.surname}`;

    protected readonly stringifyShift = (shift: string): string => shift;

    protected readonly stringifyProduct = (product: string): string => product;

    protected goBack(): void {
        this._router.navigate(['department-head']);
    }
}
