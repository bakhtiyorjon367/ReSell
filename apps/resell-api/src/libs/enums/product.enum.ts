import { registerEnumType } from '@nestjs/graphql';

export enum ProductCategory {
	ELECTRONICS =  'ELECTRONICS',
	FURNITURE = 'FURNITURE',
	HOMEandGARDEN = 'HOMEandGARDEN',
	BABYandKIDS = 'BABYandKIDS',
	WOMEN= 'WOMEN',
	MEN = 'MEN',
	HEALTHandBEAUTY ='HEALTHandBEAUTY',
	SPORTandOUTDOOR = 'SPORTandOUTDOOR',
	GAMEandHOBBY ='GAMEandHOBBY',
	BOOKandMUSIC = 'BOOKandMUSIC',
	ANIMAL = 'ANIMAL',
	ART = 'ART',
	OTHER = 'OTHER',
	WANTED = 'WANTED',
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
