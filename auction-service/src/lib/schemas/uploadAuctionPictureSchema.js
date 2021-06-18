const uploadAuctionPictureSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'string',
      minLength: 1,
    },
  },
};

export default uploadAuctionPictureSchema;
