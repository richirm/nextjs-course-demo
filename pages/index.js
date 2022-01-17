// our-domain.com
import Head from 'next/head';
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from 'react';

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'A First Meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/12/M%C3%BAnich.jpg',
    address: 'Some address 5, 12345 Some City',
    description: 'This is a first meetup'
  },
  {
    id: 'm2',
    title: 'A Second Meetup',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
    address: 'Some address 5, 12345 Some City',
    description: 'This is a second meetup'
  }
];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React Meetups!"
        />
      </Head>
      <MeetupList
        meetups={props.meetups}
      ></MeetupList>
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   // it code is executed on fly time (each request) on the server
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// }

export async function getStaticProps() {
  // it code is executed on the build time on the server
  // fetch data from an API

  const client = await MongoClient.connect(
    'mongodb://richirm:9xdNbCbosPY4yGyf@cluster0-shard-00-00.4shhm.mongodb.net:27017,cluster0-shard-00-01.4shhm.mongodb.net:27017,cluster0-shard-00-02.4shhm.mongodb.net:27017/meetups?ssl=true&replicaSet=atlas-tvwl45-shard-0&authSource=admin&retryWrites=true&w=majority'
  );

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description
      }))
    },
    revalidate: 1 //each second the page is updated
  };
}

export default HomePage;