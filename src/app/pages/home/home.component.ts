import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Products, Product } from '../../../types/types';
import { ProductsComponent } from '../products/products.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PaginatorModule,
    ProductsComponent,
    CommonModule,
    ButtonModule,
    ModalComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private productsService: ProductService,
    private messageService: MessageService
  ) {}
  @ViewChild('paginator') paginator: Paginator | undefined;

  products: Product[] = [];
  totalRecords: number = 0;
  rows: number = 8;

  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/products', { page, perPage })
      .subscribe({
        next: (data: Products) => {
          this.products = data.data;
          this.totalRecords = data.total;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnInit() {
    this.fetchProducts(0, this.rows);
  }
  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }

  toggleDeletePopup(product: Product) {
    if (!product.id) {
      return;
    }

    this.deleteProduct(product.id);
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  selectedProduct: Product = {
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

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }

    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
  }

  onProductOutput(product: Product) {
    console.log(product, 'Output');
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  editProduct(product: Product, id: number) {
    this.productsService
      .editProduct(`http://localhost:3000/products/${id}`, product)
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
          this.messageService.add({
            severity: 'success',
            summary: 'Successfully Updated!',
            detail: 'Successfully Updated!',
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteProduct(id: number) {
    this.productsService
      .deleteProduct(`http://localhost:3000/products/${id}`)
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
          this.messageService.add({
            severity: 'error',
            summary: 'Successfully Deleted!',
            detail: 'Successfully Deleted!',
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addProduct(product: Product) {
    const formData = new FormData();
    const fileInput: HTMLInputElement | null = document.getElementById(
      'fileInput'
    ) as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length) {
      formData.append('file', fileInput.files[0]);
      this.productsService
        .addProduct(`http://localhost:3000/products/upload`, formData)
        .subscribe({
          next: (data) => {
            if (data) {
              product.image = `http://localhost:3000/${data.req.filename}`;
              if (product.image) {
                this.proceedAddProduct(product);
              }
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  proceedAddProduct(product: Product) {
    this.productsService
      .addProduct(`http://localhost:3000/products`, product)
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
          this.messageService.add({
            severity: 'success',
            summary: 'Successfully Added!',
            detail: 'Successfully Added!',
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
