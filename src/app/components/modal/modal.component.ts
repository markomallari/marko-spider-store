import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../types/types';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  constructor(private formBuilder: FormBuilder) {}
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<Product>();
  @Input() uploadHandler = new EventEmitter<string>();
  @Input() header!: string;
  @Input() display: boolean = false;
  @Input() product: Product = {
    id: 0,
    image: '',
    name: '',
    scientific_name: '',
    family: '',
    classification: '',
    description: '',
    rating: 0,
    price: '',
  };

  fileName: string = '';

  specialCharacterValidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        control.value
      );

      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  productForm = this.formBuilder.group({
    name: ['', [Validators.required, this.specialCharacterValidator()]],
    image: [''],
    scientific_name: [''],
    description: [''],
    family: [''],
    classification: [''],
    price: ['', [Validators.required]],
    rating: [0],
  });

  ngOnChanges() {
    this.productForm.patchValue(this.product);
  }

  onConfirm() {
    const {
      name,
      image,
      scientific_name,
      family,
      description,
      classification,
      price,
      rating,
    } = this.productForm.value;

    this.confirm.emit({
      image: image || '',
      name: name || '',
      scientific_name: scientific_name || '',
      family: family || '',
      classification: classification || '',
      description: description || '',
      rating: rating || 0,
      price: price || '',
    });

    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel() {
    this.display = false;
    this.fileName = '';
    this.displayChange.emit(this.display);
  }

  onFileSelected(event: any) {
    const file = (File = event.target.files[0]);
    if (file) {
      this.fileName = file.name;
    }
  }
}
