importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

const firebaseConfig = JSON.parse(atob('eyJhcGlLZXkiOiJBSXphU3lETlFUQ2phTUN4SVVtbTFSdkVUWmVCS3VwYU02MTVaeUEiLCJhdXRoRG9tYWluIjoic3AyZG9iY3p5Y2UuZmlyZWJhc2VhcHAuY29tIiwiZGF0YWJhc2VVUkwiOiJodHRwczovL3NwMmRvYmN6eWNlLmZpcmViYXNlaW8uY29tIiwicHJvamVjdElkIjoic3AyZG9iY3p5Y2UiLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjQ0NjU1OTE2MjM4MSIsImFwcElkIjoiMTo0NDY1NTkxNjIzODE6d2ViOmE0ZDYzOGQ0ZTU4NzJhMTBjOTg1NDQiLCJtZWFzdXJlbWVudElkIjoiRy00RE5ZRFA1TVJIIn0='));

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
