import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryComponent } from '../addcategory/addcategory.component';
import { AddItemComponent } from '../add-item/add-item.component';
import { AddKiranaItemComponent, DialogContent2 } from '../add-kirana-item/add-kirana-item.component';
import { MenueServicesService } from '../../services/menue-services.service';
import { KiranaMenueService } from '../../services/kirana-menue.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContent } from '../add-item/add-item.component'
import { PriceChart } from '../add-item/add-item.component';
import { constants, CgTags, RProduct, KProduct } from '../../constants/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menue',
  standalone: true,
  imports: [AddCategoryComponent, CommonModule, AddItemComponent, AddKiranaItemComponent],
  templateUrl: './menue.component.html',
  styleUrl: './menue.component.css'
})

export class MenueComponent {


  constructor(private router: Router, private KiranaMenueService: KiranaMenueService, private MenueServicesService: MenueServicesService, public dialog: MatDialog) { }

  categories: any[] = [];
  itemsData: any[] = [];
  AllItemsData: any[] = [];
  MerchantType: string | null = '';
  ProductUnits: string[] = constants.productUnit;
  DimensionUnits: string[] = constants.dimensionUnit;
  currentCategory: any = {
    "descriptor": {
      "name": "All Items",
    },
  };
  CGMap: { [key: string]: string } = {
    "Quantity": "CG1",
    "Preparation type": "CG2",
    "Size": "CG3",
    "Base": "CG4",
    "Rice": "CG5",
    "Make Your Own": "CG6",
  }

  reverseCGmap: { [key: string]: string } = {
    "CG1": "Quantity ",
    "CG2": "Preparation type",
    "CG3": "Size",
    "CG4": "Base",
    "CG5": "Rice",
    "CG6": "Make Your Own",
  }

  ngOnInit() {
    this.MerchantType = localStorage.getItem('type');

    if (this.MerchantType === 'restaurant') {
      this.MenueServicesService.getCategories().subscribe({
        next: (items) => {
          this.categories = items;
          this.ChnageCategory(this.categories[0]);
        },
        error: (error) => {
          // change this only for a specific error
          if (error.status === 401) {
            localStorage.clear();
            this.router.navigate(['/login'])
          }
          console.error('Error fetching items:', error);

        }
      })

      this.MenueServicesService.getItems().subscribe({
        next: (items) => {
          console.log(items);
          if (items.length > 0) {

            const cg_map: { [key: string]: any[] } = {};
            items[0].items.map((cg: any, cg_index: number) => {

              const cg_key = cg.parentItemId;
              let keyArray = [];
              if (cg_map[cg_key] !== undefined) {
                cg_map[cg_key].push({ "Item_id": cg_index, "Category_id": cg.parentCategoryId });
              } else {
                keyArray.push({ "Item_id": cg_index, "Category_id": cg.parentCategoryId });
                cg_map[cg_key] = keyArray;
              }
            });

            items[0].product.forEach((Element: any, index: number) => {
              const custom_group: any[] = [
                {
                  name: 'Quantity',
                  data: [],
                },
                {
                  name: 'Preparation type',
                  data: [],
                },
                {
                  name: 'Size',
                  data: [],
                },
                {
                  name: 'Base',
                  data: [],
                },
                {
                  name: 'Rice',
                  data: [],
                },
                {
                  name: 'Make Your Own',
                  data: [],
                },
              ]

              const Item_details: object = {
                "itemName": Element.descriptor.name,
                "price": Element.price.value,
                "PackagingPrice": Element?.packagingPrice,
                "shortDescription": Element?.descriptor?.short_desc,
                "longDescription": Element?.descriptor?.long_desc,
                "foodPreference": Element?.tags[3]?.list[0].value === 'yes' ? "Veg" : "Non veg",
                "weight": Element?.weight.value,
                "weightUnit": Element?.weight.unit,
                "ItemTimings": Element?.timing,
                "width": Element?.dimension?.width.value,
                "height": Element?.dimension?.height.value,
                "length": Element?.dimension?.length.value,
                "widthUnit": Element?.dimension?.width.unit,
                "heightUnit": Element?.dimension?.height.unit,
                "lengthUnit": Element?.dimension?.length.unit,
                "Cancleable": Element.ondc_org_cancellable,
                "COD": Element.ondc_org_available_on_cod,
                "fullfillmentId": Element.fulfillment_id,
                // need to map to customer care fields
                "ccName": Element.fulfillment_id,
                "ccEmail": Element.fulfillment_id,
                "ccPhone": Element.fulfillment_id,
              }

              console.log(JSON.stringify(cg_map));
              if (cg_map[Element.id] !== undefined) {
                cg_map[Element.id].forEach((cg: any, index: number) => {
                  const Category_index = cg.Category_id?.split('')[2] - 1;
                  const Item = items[0].items[cg.Item_id];
                  custom_group[Category_index]?.data.push({
                    variantName: Item.descriptor.name,
                    additionalPrice: Item.price.value,
                    FoodType: Item.tags[3]?.list[0].code === 'yes' ? "veg" : "Non veg",
                    id: Item.id,
                  });
                });
              }

              const Current_Product: object = {
                id: Element.id,
                category: Element.category_ids[0].split(':')[0],
                customGroups: custom_group,
                itemDetails: Item_details,
              }
              this.itemsData.push(Current_Product);
            })
          }
          console.log("Items Data:", this.itemsData);
          this.AllItemsData = this.itemsData;
          this.ChnageCategory(this.categories[0]);
        },
        error: (error) => console.error('Error fetching items:', error)
      });
    } else {
      this.MenueServicesService.getKiranaCategories().subscribe({
        next: (items) => {
          this.categories = items;
          this.ChnageCategory(this.categories[0]);
        },
        error: (error) => {
          if (error.status === 401) {
            localStorage.clear();
            this.router.navigate(['/login'])
          }
          console.error('Error fetching items:', error)
        }

      })
      this.MenueServicesService.getKiranaitems().subscribe({
        next: (items) => {
          console.log("Kirana Items ", items);
          if (items.length > 0) {
            items[0].product.forEach((Element: any, index: number) => {
              const Item_details: object = {
                "itemName": Element.descriptor.name,
                "price": Element.price.value,
                "PackagingPrice": Element?.packagingPrice,
                "shortDescription": Element?.descriptor?.short_desc,
                "longDescription": Element?.descriptor?.long_desc,
                "foodPreference": Element?.tags[3]?.list[0].value === 'yes' ? "Veg" : "Non veg",
                "ItemTimings": Element?.timing,
                "width": Element?.dimension?.width.value,
                "height": Element?.dimension?.height.value,
                "length": Element?.dimension?.length.value,
                "widthUnit": Element?.dimension?.width.unit,
                "heightUnit": Element?.dimension?.height.unit,
                "lengthUnit": Element?.dimension?.length.unit,
                // "Cancleable": Element.ondc_org_cancellable,
                // "COD": Element.ondc_org_available_on_cod,
                // "fullfillmentId": Element.fulfillment_id,
                // "weight": Element?.quantity.unitized.measure.value,
                // "weightUnit": Element?.quantity.unitized.measure.unit,
                "ccName": Element.fulfillment_id,
                "ccEmail": Element.fulfillment_id,
                "ccPhone": Element.fulfillment_id,
              }


              const Current_Product: object = {
                id: Element.id,
                category: Element.category_ids[0].split(':')[0],
                itemDetails: Item_details,
              }
              this.itemsData.push(Current_Product);

            })
            console.log("Items Data:", this.itemsData);
          }

          this.AllItemsData = this.itemsData;
          this.ChnageCategory(this.categories[0]);

        },
        error: (error) => console.error('Error fetching items:', error)
      });
    }

  }

  ChnageCategory(cat: any) {
    this.currentCategory = cat;
    this.itemsData = this.AllItemsData;
    this.itemsData = this.itemsData.filter((item) => item?.category === cat?.id);

  }

  AllItems() {
    this.itemsData = this.AllItemsData;
    this.currentCategory = {

      "descriptor": {
        "name": "All Items",

      },
    };

  }

  openDialog(editItem?: any): void {
    if (this.MerchantType === 'restaurant') {
      const dialogRef = this.dialog.open(DialogContent, {
        data: editItem ? { editItem } : {} // Pass editItem if present
      });

      dialogRef.afterClosed().subscribe(result => {

        // Perform actions based on the result, such as updating your items array or refreshing data
        console.log("User input data :", result);
        console.log("User input data :", JSON.stringify(result));
        if (result) {
          const restaurantCustomGroup: any[] = [];
          const restaurantItemDto: any[] = [];
          result.customGroups.forEach((d: any, index: number) => {
            if (d.data.length > 0) {
              d.data.forEach((cg: any, index2: number) => {
                const temp = {
                  "id": editItem ? this.CGMap[d.name] : "",
                  "defaultId": cg.CgId,
                  "descriptor": {
                    "name": d.name,
                  },
                  "tags": [
                    {
                      "code": CgTags.code0,
                      "list": [
                        {
                          "code": CgTags.list0code,
                          "value": CgTags.list0value
                        }
                      ]
                    },
                    {
                      "code": CgTags.code1,
                      "list": [
                        {
                          "code": CgTags.list1code,
                          "value": CgTags.list1value
                        },
                        {
                          "code": CgTags.list2code,
                          "value": CgTags.list2value
                        },
                        {
                          "code": CgTags.list3code,
                          "value": CgTags.list3value
                        },
                        {
                          "code": CgTags.list4code,
                          "value": CgTags.list4value
                        }
                      ]
                    }
                  ]
                }
                restaurantCustomGroup.push(temp);

                cg.data.forEach((e: any) => {
                  let tags = [
                    {
                      "code": RProduct.code0,
                      "list": [
                        {
                          "code": RProduct.listCode0,
                          "value": RProduct.listValue0,
                        }
                      ]
                    },
                    {
                      "code": RProduct.code4,
                      "list": [
                        {
                          "code": RProduct.listCode4,
                          "value": e.FoodType === "Veg" ? "yes" : "no",
                        }
                      ]
                    }
                  ]


                  tags.push({
                    "code": RProduct.code1,
                    "list": [
                      {
                        "code": RProduct.listCode1,
                        "value": cg.CgId,
                      },
                      {
                        "code": RProduct.listCode2,
                        "value": "yes",
                      }
                    ]
                  })

                  if (result.childRelationShips[e.varientId]) {
                    tags.push(
                      {
                        "code": RProduct.code2,
                        "list": [
                          {
                            "code": RProduct.listCode3,
                            "value": result.childRelationShips[e.varientId],
                          }
                        ]
                      },
                    )
                  }

                  const temp2 = {
                    "id": e.id ? e.id : "",
                    "customId": e.variantId,
                    "foodType": e.FoodType,
                    "parentCategoryId": this.CGMap[d.name],
                    "descriptor": {
                      "name": e.variantName,
                    },
                    "quantity": {
                      "unitized": {
                        "measure": {
                          "unit": RProduct.quantityMeasureUnit,
                          "value": RProduct.quantityMeasureValue
                        }
                      },
                      "available": {
                        "count": RProduct.availableCount
                      },
                      "maximum": {
                        "count": RProduct.maximumCount
                      }
                    },
                    "price": {
                      "currency": RProduct.priceCurrency,
                      "value": e.additionalPrice,
                      "maximumValue": RProduct.priceMaximumValue
                    },
                    "categoryId": RProduct.categoryId,
                    "related": RProduct.related,
                    "tags": tags,
                  }

                  restaurantItemDto.push(temp2)
                })
              });



              if (editItem) {
                result.customGroups.forEach((d: any, index: number) => {
                  if (d.data.length === 0 && editItem.customGroups[index].data.length > 0) {
                    d.data = editItem.customGroups[index].data;
                  }
                });
              }



            }
          });


          const CGItems: any[] = [];
          result.customGroups.forEach((d: any, index: number) => {
            if (d.data.length > 0) {
              CGItems.push(
                {
                  "code": "id",
                  "value": this.CGMap[d.name],
                },
              );

            }
          });

          let vendorId = localStorage.getItem('vendorId');
          let locationData: any = localStorage.getItem('vendorLocation');
          locationData = JSON.parse(locationData);
          let str = locationData?.time?.days;
          let numbers = str?.split(',');
          let StartDay = numbers[0];
          let EndDay = numbers[numbers.length - 1];

          const payload = {
            "restaurantProductDto": {
              "vendorId": vendorId,
              "time": {
                "label": "",
                "timestamp": ""
              },
              "descriptor": {
                "name": result.itemDetails.itemName,
                "symbol": "https://sellerNP.com/images/i1.png",
                "short_desc": result.itemDetails.shortDescription,
                "long_desc": result.itemDetails.longDescription,
                "images": [
                  "https://sellerNP.com/images/i1.png"
                ]
              },
              "packagingPrice": result.itemDetails.PackagingPrice,
              "foodType": result.itemDetails.foodPreference,
              "dimension": {
                "height": {
                  "value": result.itemDetails.height,
                  "unit": result.itemDetails.heightUnit,
                },
                "width": {
                  "value": result.itemDetails.width,
                  "unit": result.itemDetails.widthUnit
                },
                "length": {
                  "value": result.itemDetails.length,
                  "unit": result.itemDetails.lengthUnit,
                }
              },
              "weight": {
                "value": result.itemDetails.weight,
                "unit": result.itemDetails.weightUnit,
              },
              "timing": result.itemDetails.ItemTimings,
              "quantity": {
                "unitized": {
                  "measure": {
                    "unit": RProduct.quantityMeasureUnit,
                    "value": RProduct.quantityMeasureValue,
                  }
                },
                "available": {
                  "count": RProduct.availableCount,
                },
                "maximum": {
                  "count": RProduct.maximumCount,
                }
              },
              "price": {
                "currency": RProduct.priceCurrency,
                "value": result.itemDetails.price,
                "maximum_value": RProduct.priceMaximumValue,
                "tags ": [{
                  "code": RProduct.PriceTagsCode,
                  "list": [
                    {
                      "code": RProduct.PriceTagsListCode,
                      "value": RProduct.PriceTagsListValue

                    },
                    {
                      "code": RProduct.PriceTagsListCode1,
                      "value": RProduct.PriceTagsListValue1
                    }
                  ]
                }
                ]

              },
              "category_id": "F&B",
              "category_ids": [
                `${this.currentCategory.id}:${this.itemsData.length > 0 ? this.itemsData.length + 1 : 1}`
              ],
              "customizationItems": [

              ],
              "parent_category_id": this.currentCategory.id,
              "id": editItem ? editItem.id : "",
              "fulfillment_id": result.itemDetails.fullfillmentId,
              "location_id": locationData.id,
              "related": RProduct.related,
              "recommended": RProduct.recommended,
              "ondc_org_returnable": result.itemDetails.returnable,
              "ondc_org_cancellable": result.itemDetails.Cancleable,
              "ondc_org_return_window": `PT${result.itemDetails.ReturnWindow}H`,
              "ondc_org_seller_pickup_return": false,
              "ondc_org_time_to_ship": constants.timeToShip,
              "ondc_org_available_on_cod": result.itemDetails.COD,
              "ondc_org_contact_details_consumer_care": `${result.itemDetails.ccName}, ${result.itemDetails.ccEmail}, ${result.itemDetails.ccPhone}`,
              "tags": [
                {
                  "code": RProduct.tagsCode,
                  "list": [
                    {
                      "code": RProduct.tagsListCode0,
                      "value": RProduct.tagsListValue0,
                    }
                  ]
                },
                {
                  "code": RProduct.tagsCode1,
                  "list": CGItems,
                },
                {
                  "code": RProduct.tagsCode2,
                  "list": [
                    {
                      "code": RProduct.tagsList2Code1,
                      "value": StartDay
                    },
                    {
                      "code": RProduct.tagsList2Code2,
                      "value": EndDay,
                    },
                    {
                      "code": RProduct.tagsList2Code3,
                      "value": locationData?.time?.range?.start,
                    },
                    {
                      "code": RProduct.tagsList2Code4,
                      "value": locationData?.time?.range?.end,
                    }
                  ]
                },
                {
                  "code": RProduct.tagsCode3,
                  "list": [
                    {
                      "code": RProduct.tagsList3code,
                      "value": result.itemDetails.foodPreference === 'Veg' ? 'yes' : 'no',
                    }
                  ]
                }
              ]
            },
            "restaurantCustomGroup": restaurantCustomGroup,
            "restaurantItemDto": restaurantItemDto,
            // "childrelationShips": result.childRelationShips,
          }

          console.log("PayLoad:", payload);
          if (editItem) {
            this.MenueServicesService.updateItems(payload).subscribe({
              next: (res) => console.log("Updated Item Data", res),
              error: (error) => console.error('Update Error:', error),
            });
          } else {

            this.MenueServicesService.addMenus(payload).subscribe({
              next: (res: any) => {
                let id: number = res.restaurantProductDto.id;
                result.id = id;
              },
              error: (error) => console.error('Add Item Error:', error),
            });
            this.itemsData.push(result)
          }
        }
      });
    }
    else {
      const dialogRef2 = this.dialog.open(DialogContent2, {
        data: editItem ? { editItem } : {}
      });

      dialogRef2.afterClosed().subscribe(result => {

        console.log("User input data :", result);
        if (result) {
          const restaurantCustomGroup: any[] = [];
          const restaurantItemDto: any[] = [];
          let vendorId = localStorage.getItem('vendorId');
          let locationData: any = localStorage.getItem('vendorLocation');
          locationData = JSON.parse(locationData);

          let payload = {
            "kiranaProductDto": [{
              "kiranaId": vendorId,
              "time": {
                "label": "",
                "timestamp": ""
              },
              "parent_item_id": KProduct.parentItemId,
              "descriptor": {
                "name": result.itemDetails.itemName.toLowerCase(),
                "symbol": "https://sellerNP.com/images/i1.png",
                "short_desc": result.itemDetails.shortDescription.toLowerCase(),
                "long_desc": result.itemDetails.longDescription.toLowerCase(),
                "images": [
                  "https://sellerNP.com/images/i1.png"
                ]
              },
              "packagingPrice": result.itemDetails.PackagingPrice,
              "foodType": result.itemDetails.foodPreference,
              "dimension": {
                "height": {
                  "value": result.itemDetails.height,
                  "unit": result.itemDetails.heightUnit,
                },
                "width": {
                  "value": result.itemDetails.width,
                  "unit": result.itemDetails.widthUnit
                },
                "length": {
                  "value": result.itemDetails.length,
                  "unit": result.itemDetails.lengthUnit,
                }
              },
              "weight": {
                "value": result.itemDetails.weight,
                "unit": result.itemDetails.weightUnit,
              },
              "timing": result.itemDetails.ItemTimings,
              "quantity": {
                "unitized": {
                  "measure": {
                    "unit": KProduct.quantityMeasureUnit,
                    "value": KProduct.quantityMeasureValue
                  }
                },
                "available": {
                  "count": KProduct.availableCount
                },
                "maximum": {
                  "count": KProduct.maximumCount
                }
              },
              "price": {
                "currency": KProduct.priceCurrency,
                "value": result.itemDetails.price,
                "maximum_value": KProduct.priceMaximumValue,
                "tags ": [{
                  "code": KProduct.PriceTagsCode,
                  "list": [
                    {
                      "code": KProduct.PriceTagsListCode,
                      "value": KProduct.PriceTagsListValue
                    },
                    {
                      "code": KProduct.PriceTagsListCode1,
                      "value": KProduct.PriceTagsListValue1
                    }
                  ]
                }
                ]

              },
              "category_id": this.currentCategory.id,
              "category_ids": [
                `${this.currentCategory.id}:${this.itemsData.length > 0 ? this.itemsData.length + 1 : 1}`
              ],
              "customizationItems": [

              ],
              "parent_category_id": this.currentCategory.id,
              "id": editItem ? editItem.id : "",
              "fulfillment_id": result.itemDetails.fullfillmentId,
              "location_id": locationData.id,
              "ondc_org_returnable": result.itemDetails.returnable,
              "ondc_org_cancellable": result.itemDetails.Cancleable,
              "ondc_org_return_window": `PT${result.itemDetails.ReturnWindow}H`,
              "ondc_org_seller_pickup_return": false,
              "ondc_org_time_to_ship": constants.timeToShip,
              "ondc_org_available_on_cod": result.itemDetails.COD,
              "ondc_org_contact_details_consumer_care": `${result.itemDetails.ccName}, ${result.itemDetails.ccEmail}, ${result.itemDetails.ccPhone}`,
              "tags": [
                {
                  "code": KProduct.tagsCode,
                  "list": [
                    {
                      "code": KProduct.tagsListCode0,
                      "value": KProduct.tagsListValue0
                    }
                  ]
                },
                {
                  "code": KProduct.tagsCode1,
                  "list": [
                    {
                      "code": KProduct.tagsList1code,
                      "value": result.itemDetails.foodPreference === 'Veg' ? 'yes' : 'no',
                    }
                  ]
                }
              ]
            }],
            "kiranaCustomGroup": restaurantCustomGroup,
            "kiranaItem": restaurantItemDto,
          }



          result.varientItems.forEach((Vitem: any, index: number) => {
            let temp: any = JSON.parse(JSON.stringify(payload.kiranaProductDto[0]));
            temp.weight.value = Vitem.quantity;
            temp.quantity.unitized.measure.value = Vitem.quantity;
            temp.descriptor.images = Vitem.images;
            temp.price.value = Vitem.price

            // console.log(JSON.stringify(temp));
            payload.kiranaProductDto.push(temp);
          })
          console.log("PayLoad:", JSON.stringify(payload));
          if (editItem) {
            this.KiranaMenueService.updateKiranaItems(payload).subscribe({
              next: (res) => console.log("Updated Item Data", res),
              error: (error) => console.error('Update Error:', error),
            });
          } else {
            this.KiranaMenueService.addKiranaProduct(payload).subscribe({
              next: (res: any) => {
                console.log(res);
                let id: number = res.kiranaProductDto.id;
                result.id = id;
              },
              error: (error) => console.error('Add Item Error:', error),
            });
            this.itemsData.push(result.kiranaProductDto)
            this.AllItemsData.push(result.kiranaProductDto)
          }
        }
      });

    }
  }

  openPriceChart() {
    this.dialog.open(PriceChart);
  }


  addItemDialog() {
    console.log("Add Item clicked");
    this.openDialog(); // Open dialog in add mode
  }

  editItem(item: any) {
    console.log("Item Data :", item);
    this.openDialog(item); // Open dialog in edit mode with the item
  }


  deleteItem(item: any) {
    if (this.MerchantType === 'restaurant') {
      this.MenueServicesService.deleteItem(item).subscribe({
        next: (res) => {
          console.log("Delete result :", res),
            this.itemsData = this.itemsData.filter((i) => i.id !== item.id);
        },
        error: (error) => console.error('Error:', error),
      });
    } else {
      this.KiranaMenueService.deleteKiranaItem(item).subscribe({
        next: (res) => {
          console.log("Delete result :", res),
            this.itemsData = this.itemsData.filter((i) => i.id !== item.id);
        },
        error: (error) => console.error('Error:', error),
      });

    }

  }

  // Update addCategory to properly handle the emitted event
  addCategory(event: any) {
    this.categories = this.categories.concat(event);
    this.categories = this.categories.filter((item, index) => this.categories.indexOf(item) === index);
    this.MenueServicesService.addCategories(this.categories);
  }
}
