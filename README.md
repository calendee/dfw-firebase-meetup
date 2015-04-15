dfw-firebase-meetup April 2015
===================

Backend Queue Processing With Firebase

Links
==================
- [Firebase Work Queue](https://github.com/firebase/firebase-work-queue) : An example of processing queues using Firebase.
Not highly recommended

- [Firelease](https://github.com/pkaminski/firelease) : A Firebase queue consumer built on top of [NodeFire](https://github.com/pkaminski/nodefire)

Scenario # 1
============
Use the Firebase SDK to monitor the queue.

```
npm install firebase
npm install firelease
npm install nodefire
npm install lwip
npm install async
npm install q
node index-fb.js
```