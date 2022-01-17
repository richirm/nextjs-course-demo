// GET /api/new-meetup
// POST /api/new-meetup

import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await MongoClient.connect(
      'mongodb://richirm:9xdNbCbosPY4yGyf@cluster0-shard-00-00.4shhm.mongodb.net:27017,cluster0-shard-00-01.4shhm.mongodb.net:27017,cluster0-shard-00-02.4shhm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-tvwl45-shard-0&authSource=admin&retryWrites=true&w=majority'
    );

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const result = await meetupsCollection.insertOne(data);
    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;