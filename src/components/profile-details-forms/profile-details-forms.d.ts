type TNullableBodyDetails = {
  [K in keyof Omit<IBodyDetails, 'sex'>]: IBodyDetails[K] | null
} & { sex: TSex }
