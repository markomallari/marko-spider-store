import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { Product } from '../../../types/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() delete: EventEmitter<Product> = new EventEmitter<Product>();
  @Input() products!: Product[];

  toggleEditPopup(data: Product) {
    this.edit.emit(data);
  }
  toggleDeletePopup(data: Product) {
    this.delete.emit(data);
  }
}
