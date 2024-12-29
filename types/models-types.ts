import { Types } from "mongoose";
export interface PropertyModelTypes {
    _id: Types.ObjectId | string | string[];
    owner: Types.ObjectId | string;
    name: string;
    type: string;
    description: string;
    location: {
        street: string;
        city: string;
        state: string;
        zipcode: string;
    };
    beds: number;
    baths: number;
    square_feet: number;
    amenities: string[];
  rates: {
    weekly: number;
    monthly: number;
    nightly: number;
  };
  seller_info: {
    name: string;
    email: string;
    phone: string;
  };
  images: string[];
  is_featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyTotal {
  properties: PropertyModelTypes[];
  total: number;
}

interface UserModelTypes {
  email: string;
  username: string;
  image: string;
  bookmarks: [PropertyModelTypes];
}

export interface  MessageModelTypes {
  _id: Types.ObjectId | string | string[];
  sender: UserModelTypes;
  recipient: Types.ObjectId | string;
  property: PropertyModelTypes;
  name: string;
  email: string;
  phone: string;
  message: string;
  body: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}