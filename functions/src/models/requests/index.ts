import {
  Allow,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { firestore } from 'firebase-admin';

import { IUser, User } from '../users';
import GeoPoint = firestore.GeoPoint;
import Timestamp = firestore.Timestamp;
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;

export enum RequestStatus {
  pending = 'pending',
  ongoing = 'ongoing',
  completed = 'completed',
  cancelled = 'cancelled',
  removed = 'removed'
}

export interface IRequest extends DocumentData {
  cavUserRef: DocumentReference<IUser> | null;
  pinUserRef: DocumentReference<IUser>;
  pinUserSnapshot: IUser;
  title: string;
  description: string;
  latLng: GeoPoint;
  status: RequestStatus;
  pinRating: number | null;
  cavRating: number | null;
  ratedAt: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export class Request implements IRequest {

  @Allow()
  private _cavUserRef: DocumentReference<IUser> | null;

  @IsNotEmptyObject()
  private _pinUserRef: DocumentReference<IUser>;

  @ValidateNested()
  private _pinUserSnapshot: User;

  @IsString()
  @IsNotEmpty()
  private _title: string;

  @IsString()
  @IsNotEmpty()
  private _description: string;

  @IsObject()
  private _latLng: GeoPoint;

  @IsEnum(RequestStatus)
  private _status: RequestStatus;

  /* TODO: When we reach greater than 500 requests created per second:
     https://firebase.google.com/docs/firestore/solutions/shard-timestamp#sharding_a_timestamp_field
   */
  @IsObject()
  private _createdAt: Timestamp;

  /* TODO: When we reach greater than 500 requests updated per second:
     https://firebase.google.com/docs/firestore/solutions/shard-timestamp#sharding_a_timestamp_field
   */
  @IsObject()
  private _updatedAt: Timestamp;

  @IsInt()
  @Min(1)
  @Max(5)
  private _pinRating: number | null;

  @IsInt()
  @Min(1)
  @Max(5)
  private _cavRating: number | null;

  @Allow()
  private _ratedAt: Timestamp | null;

  constructor(
    cavUserRef: DocumentReference<IUser> | null,
    pinUserRef: DocumentReference<IUser>,
    pinUserSnapshot: User,
    title: string,
    description: string,
    latLng: GeoPoint,
    status: RequestStatus,
    createdAt = Timestamp.now(),
    updatedAt = Timestamp.now(),
    pinRating: number | null = null,
    cavRating: number | null = null,
    ratedAt: Timestamp | null = null,
  ) {
    this._cavUserRef = cavUserRef;
    this._pinUserRef = pinUserRef;
    this._pinUserSnapshot = pinUserSnapshot;
    this._title = title;
    this._description = description;
    this._latLng = latLng;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._pinRating = pinRating;
    this._cavRating = cavRating;
    this._ratedAt = ratedAt;
  }

  static factory = (data: IRequest): Request => new Request(
    data.cavUserRef,
    data.pinUserRef,
    User.factory(data.pinUserSnapshot),
    data.title,
    data.description,
    data.latLng,
    data.status,
    data.createdAt,
    data.updatedAt,
    data.pinRating,
    data.cavRating,
    data.ratedAt,
  );

  get cavUserRef(): DocumentReference<IUser> | null {
    return this._cavUserRef;
  }

  set cavUserRef(value: DocumentReference<IUser> | null) {
    this._cavUserRef = value;
  }

  get pinUserRef(): DocumentReference<IUser> {
    return this._pinUserRef;
  }

  set pinUserRef(value: DocumentReference<IUser>) {
    this._pinUserRef = value;
  }

  get pinUserSnapshot(): User {
    return this._pinUserSnapshot;
  }

  set pinUserSnapshot(value: User) {
    this._pinUserSnapshot = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get latLng(): GeoPoint {
    return this._latLng;
  }

  set latLng(value: GeoPoint) {
    this._latLng = value;
  }

  get status(): RequestStatus {
    return this._status;
  }

  set status(value: RequestStatus) {
    this._status = value;
  }

  get createdAt(): Timestamp {
    return this._createdAt;
  }

  set createdAt(value: Timestamp) {
    this._createdAt = value;
  }

  get updatedAt(): Timestamp {
    return this._updatedAt;
  }

  set updatedAt(value: Timestamp) {
    this._updatedAt = value;
  }

  get pinRating(): number | null {
    return this._pinRating;
  }

  set pinRating(value: number | null) {
    this._pinRating = value;
  }

  get cavRating(): number | null {
    return this._cavRating;
  }

  set cavRating(value: number | null) {
    this._cavRating = value;
  }

  get ratedAt(): Timestamp | null {
    return this._ratedAt;
  }

  set ratedAt(value: Timestamp | null) {
    this._ratedAt = value;
  }
}
