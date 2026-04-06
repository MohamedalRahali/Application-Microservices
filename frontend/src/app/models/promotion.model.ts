export type PromotionType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY' | 'BUY_ONE_GET_ONE';

export interface Promotion {
  id: number;
  title: string;
  description?: string;
  code?: string;
  discountPercent?: number;
  discountAmount?: number;
  type: PromotionType;
  image?: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
  usageLimit?: number;
  usageCount: number;
  minOrderAmount?: number;
  restaurantId?: string;
}

export interface ValidateCodeRequest {
  code: string;
  orderAmount?: number;
}

export interface ValidateCodeResponse {
  valid: boolean;
  message: string;
  promotion?: Promotion;
  discountValue: number;
}

export interface PromotionStats {
  totalPromotions: number;
  activePromotions: number;
  expiredPromotions: number;
  totalUsages: number;
}
