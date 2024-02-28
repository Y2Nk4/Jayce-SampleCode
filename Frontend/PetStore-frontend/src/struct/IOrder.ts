export interface ISimpleOrder{
  id: number;
  user_id: number;
  payment_method: number;
  amount: number;
  paid_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IGetOrderDetailParams{
  orderId: number;
}

export interface IOrderDetail extends ISimpleOrder{
  id: number;
}
