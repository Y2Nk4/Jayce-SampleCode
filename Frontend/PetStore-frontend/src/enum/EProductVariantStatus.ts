export default {
  // 0.草稿 1.正常 2.临时下架 3.禁止购买
  Draft: 0,
  Normal: 1,
  TemporaryUnavailable: 2,
  ForbiddenPurchase: 3,
  Unavailable: 4,

  0: 'Draft',
  1: 'Normal',
  2: 'TemporaryUnavailable',
  3: 'ForbiddenPurchase',
  4: 'Unavailable',
}

export const ALL_STATUS_CODE = [0, 1, 2, 3, 4]
