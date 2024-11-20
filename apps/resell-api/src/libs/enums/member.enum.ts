import {registerEnumType} from '@nestjs/graphql';
export enum MemberType {
    USER= 'USER',
    ADMIN = 'ADMIN',
};
registerEnumType(MemberType, {
    name: 'MemberType',});

export enum MemberStatus {
   ACTIVE = 'ACTIVE',
   BLOCK = 'BLOCK',
   DELETE = 'DELETE',
}
registerEnumType(MemberStatus,{
    name: 'MemberStatus'});

export enum MemberAuthType {
    PHONE = 'PHONE',
    TELEGRAM = 'TELEGRAM',
    EMAIL = 'EMAIL', 
}
registerEnumType(MemberAuthType,{
    name: 'MemberAuthType'});