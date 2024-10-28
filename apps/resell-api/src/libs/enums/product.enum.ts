import { registerEnumType } from '@nestjs/graphql';

// export enum ServiceType {
// 	PARTTIME = 'PARTTIME',
// 	CAR = 'CAR',
// 	HOUSE = 'HOUSE',
// 	SELLMYSTUFF = 'SELLMYSTUFF'
// }
// registerEnumType(ServiceType, {
// 	name: 'PropertyType',
// });
//___________________________________________
export enum ProductCategory {
	DIGITAL =  'DIGITAL',
	INTERIOR = 'INTERIOR',
	WOMEN= 'WOMEN',
	MEN = 'MEN',
	READING = 'READING',
	SPORTS ='SPORTS',
	FOOD = 'FOOD',
	OTHER = 'OTHER',
}
registerEnumType(ProductCategory, {
	name: 'ProductCategory',
});

export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	RESERVED = 'RESERVED',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(ProductLocation, {
	name: 'ProductLocation',
});
