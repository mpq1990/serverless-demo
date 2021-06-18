import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { getAuctionById } from './getAuction';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';
import uploadAuctionPictureSchema from '../lib/schemas/uploadAuctionPictureSchema';
import validator from '@middy/validator';

export async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  const { email } = event.requestContext.authorizer;

  if (email !== auction.seller) {
    throw new createError.Forbidden(
      'You can only upload pictures for your own auctions'
    );
  }
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  try {
    const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
    const updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadAuctionPictureSchema }));
