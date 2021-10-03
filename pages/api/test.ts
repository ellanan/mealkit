import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line import/no-anonymous-default-export
export default (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ text: 'test' });
};
