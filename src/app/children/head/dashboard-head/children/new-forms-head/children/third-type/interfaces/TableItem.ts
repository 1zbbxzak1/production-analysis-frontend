import {FormControl} from '@angular/forms';
import {ProductDto} from '../../../../../../../../data/models/dictionaries/responses/ProductDto';

export interface TableItem {
    product: FormControl<ProductDto | null>;
    cycleTime: FormControl<number | null>;
    dailyPace: FormControl<number | null>;
}
