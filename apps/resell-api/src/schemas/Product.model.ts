import { Schema } from 'mongoose';
import { ProductLocation, ProductStatus, ProductCategory } from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		productCategory: {
			type: String,
			enum: ProductCategory,
			required: true,
		},

		productStatus: {
			type: String,
			enum: ProductStatus,
			default: ProductStatus.ACTIVE,
		},

		productLocation: {
			type: String,
			enum: ProductLocation,
			required: true,
		},

		dealAddress: {
			type: String,
			required: true,
		},

		productTitle: {
			type: String,
			required: true,
		},

		productPrice: {
			type: Number,
			required: true,
		},

		productViews: {
			type: Number,
			default: 0,
		},

		productLikes: {
			type: Number,
			default: 0,
		},

    	productRank: {
			type: Number,
			default:0,
		},

		productComments: {
			type: Number,
			default: 0,
		},

		productImages: {
			type: [String],
			required: true,
		},

		productDesc: {
			type: String,
		},

		productBarter: {
			type: Boolean,
			default: false,
		},

		productSharing: {
			type: Boolean,
			default: false,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},
		
		reservedAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		manufacturedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'products' },
);

ProductSchema.index({ productCategory: 1, productLocation: 1, productTitle: 1, productPrice: 1 }, { unique: true });

export default ProductSchema;
