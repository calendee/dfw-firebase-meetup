# DFW Firebase Meetup January 2015

Deep Dive - Querying / Retrieving Data

## Data Structure

Store data the way you are going to query it - not the way it is currently organized

- [Avoid Nesting Data](https://www.firebase.com/docs/web/guide/structuring-data.html)
- Massive amounts of data is unusable in Firebase via Browser
- Split data into logical groups that make sense for your QUERYING needs
- Use summary tables
- Firebase is not your "Big Data" repository
 - Remember the purpose is to share and sync data between clients

## Loading Gotchas

- Do not assume all data is loaded remotely after script processes each data point
- How to confirm remote data exists?

## Querying

Remember that our blank web site has an `fb` variable with a connection to our Firebase

- Get all records from a specific station

```
fb.child('weather').child('tx').child('TX-BEL-1').on('value', function(snapshot) {
   var records = snapshot.val();
   console.table(records);
})

or

fb.child('weather/tx/TX-BEL-1').on('value', function(snapshot) {
   var records = snapshot.val();
   console.table(records);
})

```

- orderByChild : Sort the weather report by precipitation amount for specific station
```
// NOTE : This does not work
fb.child('weather/tx/TX-BEL-1').orderByChild('totalPrecipAmt').on('value', function(snapshot) {
   var records = snapshot.val();
   console.table(records);
})

// Must use "child_added
fb.child('weather/tx/TX-BEL-1').orderByChild('totalPrecipAmt').on('child_added', function(snapshot) {
   var record = snapshot.val();
   console.table(record.date +  " : " + record.totalPrecipAmt);
})

```

- limitToFirst : Sort the weather report by precipitation amount for specific station and retrieve only first 5.
```
fb.child('weather/tx/TX-BEL-1').orderByChild('totalPrecipAmt').limitToFirst(5).on('child_added', function(snapshot) {
   var record = snapshot.val();
   console.table(record.date +  " : " + record.totalPrecipAmt);
})

```

- limitToLast : Sort the weather report by precipitation amount for specific station and retrieve only last 5.
```
fb.child('weather/tx/TX-BEL-1').orderByChild('totalPrecipAmt').limitToLast(5).on('child_added', function(snapshot) {
   var record = snapshot.val();
   console.table(record.date +  " : " + record.totalPrecipAmt);
})

```

- Get only data with actual rain fall
```
fb.child('weather/tx/TX-BEL-1').orderByChild('totalPrecipAmt').startAt(0.001).endAt(9999).on('child_added', function(snapshot) {
   var record = snapshot.val();
   console.table(record.date +  " : " + record.totalPrecipAmt);
})

OR

fb.child('weather/tx/TX-BEL-1').orderByChild('totalPrecipAmt').startAt(0.001).on('child_added', function(snapshot) {
   var record = snapshot.val();
   console.table(record.date +  " : " + record.totalPrecipAmt);
})

```

- Get only data for December
```
fb.child('weather/tx/TX-BEL-1').orderByChild('date').startAt('2014-12-01').endAt('2014-12-31').on('child_added', function(dateSnapshot) {
   var record = dateSnapshot.val();
   console.table(record.date +  " : " + record.totalPrecipAmt);
})

```