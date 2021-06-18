const placeBidSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'string',
        },
      },
      required: ['amount'],
    },
  },
};

export default placeBidSchema;
