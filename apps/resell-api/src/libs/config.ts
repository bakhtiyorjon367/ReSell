import {ObjectId} from 'bson';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';

export const availableMemberSorts =['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank' ]
export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews']
export const availableOptions = ['productBarter', 'productSharing'];
export const availableProductSorts = [
    'createdAt',
    'updatedAt',
    'productLikes',
    'productyViews',
    'productPrice',
    'productRank'
];
export const availableCommentSorts = ['createdAt', 'updatedAt'];

 // IMAGE CONFIGURATION 
 export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
 export const getSerialForImage = (filename: string) => {
      const ext = path.parse(filename).ext;
      return uuidv4() + ext;
 };

export const shapeIntoMongoObjectId = (target:any) => {
    return typeof target ==='string' ? new ObjectId(target) : target;
};

export const lookupMember = {
    $lookup: {
        from: 'members',
        localField: 'memberId',
        foreignField: '_id',
        as: 'memberData'
    }
}

export const lookupFollowingData = {
    $lookup: {
        from: 'members',
        localField: 'followingId',
        foreignField: '_id',
        as: 'followingData'
    }
}

export const lookupFollowerData = {
    $lookup: {
        from: 'members',
        localField: 'followerId',
        foreignField: '_id',
        as: 'followerData'
    }
}

export const lookupFavorite = {
    $lookup: {
        from: 'members',
        localField: 'favoriteProduct.memberId',
        foreignField: '_id',
        as: 'favoriteProduct.memberData'
    }
}

export const lookupVisit = {
    $lookup: {
        from: 'members',
        localField: 'visitedProduct.memberId',
        foreignField: '_id',
        as: 'visitedProduct.memberData'
    }
}

export const lookUpAuthMemberLiked = (memberId:T, targetRefId: string = '$_id') => {
    return {
        $lookup:{
            from: 'likes',
            let: {
                localLikeRefId: targetRefId,
                localMemberId: memberId,
                localMyFavourite: true
            },
            pipeline: [
                {
                    $match:{
                        $expr: {
                            $and: [{$eq:['$likeRefId','$$localLikeRefId']}, { $eq:['$memberId', '$$localMemberId']}],
                        },
                    },
                },
                {
                    $project:{
                        _id: 0,
                        memberId: 1,
                        likeRefId: 1,
                        myFavorite: '$$localMyFavourite',
                    }
                }
            ],
            as:'meLiked'
        }
    }
};


interface LookUpAuthMemberFollowed {
    followerId:T,
    followingId:string
}
export const lookUpAuthMemberFollowed = (input:LookUpAuthMemberFollowed) => {
    const { followerId, followingId } = input;
    return {
        $lookup:{
            from: 'follows',
            let: {
                localFollowerId: followerId,
                localFollowingId: followingId,
                localMyFavorite: true
            },
            pipeline: [
                {
                    $match:{
                        $expr: {
                            $and: [{$eq:['$followerId','$$localFollowerId']}, { $eq:['$followingId', '$$localFollowingId']}],
                        },
                    },
                },
                {
                    $project:{
                        _id: 0,
                        followerId: 1,
                        followingId: 1,
                        myFollowing: '$$localMyFavorite',
                    }
                }
            ],
            as:'meFollowed'
        }
    }
};