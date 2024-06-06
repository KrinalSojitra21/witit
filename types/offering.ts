type CreditRange = {
  min: number;
  max: number;
  avg?: number;
};

export type CreateOffering = {
  name: string;
  image: string[];
  offeringDescription: string;
  creditRange: CreditRange;
};
export type UpateOffering = {
  offeringId: string;
} & Partial<CreateOffering>;

type User = {
  id: string;
  userName: string;
  userType: string;
  profileImage: string;
};

type counts = {
  like: number;
};
export type OfferingData = {
  owner: User;
  name: string;
  image: string[];
  offeringDescription: string;
  creditRange: CreditRange;
  completeOffers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  offeringId: string;
  pendingOffers?: number;
  offerStatus?: null | string;
  counts?: counts;
  isUserLike?: boolean;
};

export type Offer = {
  offeringId: string;
  offerId: string;
  user: User;
  credit: number;
  isReschedule: boolean;
  offerDate: number;
  offerDescription: string | null;
  status: string;
  message: string | null;
  isActiveNotification: boolean;
  createdAt: string;
  updatedAt: string;
  offering: OfferingData;
};
