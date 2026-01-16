import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Footer} from '../../footer/footer';
import {HeaderOperator} from '../../../operator/components/header-operator/header-operator';
import {BackHeader} from '../../back-header/back-header';
import {Loader} from '../../loader/loader';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {TuiDataListWrapper, TuiFilterByInputPipe, TuiStringifyContentPipe} from '@taiga-ui/kit';
import {TuiComboBoxModule, TuiInputModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiTextfieldOptionsDirective} from '@taiga-ui/core';
import {HeaderForm} from '../components/header-form/header-form';
import {CompletedFormPopUp} from '../components/completed-form-pop-up/completed-form-pop-up';
import {BaseFormTypeTables} from '../directives/base-form-type-tables';

@Component({
    selector: 'app-form-type-1-2',
    imports: [
        Footer,
        HeaderOperator,
        BackHeader,
        Loader,
        NgIf,
        NgForOf,
        NgStyle,
        TuiInputModule,
        TuiDataListWrapper,
        ReactiveFormsModule,
        TuiComboBoxModule,
        TuiStringifyContentPipe,
        TuiFilterByInputPipe,
        TuiTextfieldControllerModule,
        TuiTextfieldOptionsDirective,
        HeaderForm,
        NgClass,
        TuiButton,
        CompletedFormPopUp
    ],
    templateUrl: './form-type-1-2.html',
    styleUrl: './form-type-1-2.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormType12 extends BaseFormTypeTables implements OnInit {

    protected columnAlignments: ('left' | 'center' | 'right')[] = [
        'center', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'left'
    ];
}
