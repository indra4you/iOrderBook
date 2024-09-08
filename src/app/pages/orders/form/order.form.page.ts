import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
    RouterLink,
} from '@angular/router';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    NgClass,
} from '@angular/common';

import {
    DataService,
    OrderRequest,
} from '../../../services';

@Component({
    standalone: true,
    imports: [
        RouterLink,
        ReactiveFormsModule,
        NgClass,
    ],
    templateUrl: './order.form.page.html'
})
export class OrderFormPage implements OnInit {
    @ViewChild('focusOn')
    public focusOn: ElementRef<HTMLInputElement> | undefined;
    
    private id: number | null = null;

    public errorMessage: string = '';
    public isLoading: boolean = true;
    public mainFormGroup: FormGroup;
    public isSaving: boolean = false;

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _dataService: DataService,
    ) {
        this.mainFormGroup = this._formBuilder.group({});
    }

    public ngOnInit(
    ): void {
        this._activatedRoute.paramMap
            .subscribe({
                next: params => {
                    if (params.has('id')) {
                        this.id = Number(params.get('id'));
                    }

                    this.setupFormGroup();
                }
            });
    }

    private async setupFormGroup(
    ): Promise<void> {
        this.mainFormGroup = this._formBuilder.group({
            name: new FormControl('', [Validators.required, Validators.minLength(3)]),
            mobileNumber: new FormControl('', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]),
        });

        this.isLoading = false;

        setTimeout(
            () => this.focusOn?.nativeElement.focus(),
            500,
        );
    }

    public get hasValidId(
    ): boolean {
        return this.id !== null && this.id > 0;
    }

    public get hasError(
    ): boolean {
        return this.errorMessage.length > 0;
    }

    public get mainFormGroupControls(
    ): { [key: string]: AbstractControl } {
        return this.mainFormGroup.controls;
    }

    public get isFormValid(
    ): boolean {
        return this.mainFormGroup.valid;
    }

    public async onSubmitClicked(
    ): Promise<void> {
        this.isSaving = true;

        const orderRequest: OrderRequest = {
            name: this.mainFormGroupControls.name.value,
            mobileNumber: this.mainFormGroupControls.mobileNumber.value,
            products: [],
        };

        try {
            if (this.hasValidId) {
                await this._dataService.modifyOrder(
                    this.id!,
                    orderRequest,
                );
            } else {
                await this._dataService.addOrder(
                    orderRequest,
                );
            }

            this._router.navigate(
                ['/orders'],
            );
        } catch (error) {
            throw error;
        } finally {
            this.isSaving = false;
        }
    }
};