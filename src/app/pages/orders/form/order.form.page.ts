import {
    Component,
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
    RouterLink,
} from '@angular/router';
import {
    FormBuilder,
    ReactiveFormsModule,
} from '@angular/forms';

import {
    DataService,
} from '../../../services';

@Component({
    standalone: true,
    imports: [
        RouterLink,
        ReactiveFormsModule,
    ],
    templateUrl: './order.form.page.html'
})
export class OrderFormPage {
    private id: number | null = null;

    public errorMessage: string = '';

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
    ) {
    }

    public ngOnInit(
    ): void {
        this._activatedRoute.paramMap
            .subscribe({
                next: params => {
                    if (params.has('id')) {
                        this.id = Number(params.get('id'));
                    }
                }
            });
    }

    public get hasValidId(
    ): boolean {
        return this.id !== null && this.id > 0;
    }

    public get hasError(
    ): boolean {
        return this.errorMessage.length > 0;
    }
};