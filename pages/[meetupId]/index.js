// our-domain.com/new-meetup/1234
import { Fragment } from "react";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head"

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb://richirm:9xdNbCbosPY4yGyf@cluster0-shard-00-00.4shhm.mongodb.net:27017,cluster0-shard-00-01.4shhm.mongodb.net:27017,cluster0-shard-00-02.4shhm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-tvwl45-shard-0&authSource=admin&retryWrites=true&w=majority'
  );

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString()
      }
    }))
  };
}

export async function getStaticProps(context) {
  // fetch data ofr a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    'mongodb://richirm:9xdNbCbosPY4yGyf@cluster0-shard-00-00.4shhm.mongodb.net:27017,cluster0-shard-00-01.4shhm.mongodb.net:27017,cluster0-shard-00-02.4shhm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-tvwl45-shard-0&authSource=admin&retryWrites=true&w=majority'
  );

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId)
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description
      }
    }
  }
}

export default MeetupDetails;