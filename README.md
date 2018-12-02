# Giftr™


DELIVERABLES/FEATURES:
- A user should be able to see all of the gift data on initial page load
1. make a get to the gifts url
2. add the gifts to the page\

- A user (any user, don't worry about authorization) should be able to edit a gift's details

1. add an edit button to each gift and give that edit button the gift's id so we can identify it later on
- A user should be able to delete a particular gift

1. add a delete button to each gift and give that delete button the gift's id like we did w the edit button

- A user should be able to search for and filter particular gifts with names that include a particular search query.
1. use the datastore to filter so u don't have to fetch again --> listen for INPUT event on the input field


Once all of the features listed above are working, add AJAX to persist changes to your database. A RESTful JSON API is being faked using a node module (js package) called `json-server`

- To install, run the following line of code in your terminal: $ `npm install -g json-server`
- To run the package and host your 'server': `$ json-server --watch db.json`
- Change your program so that the gifts are being loaded in from the server instead of the `giftData.js` file. You may want to comment out the line in `index.html` that loads the file in.
- A user should be able to perform the same CRUD actions listed above **and** persist changes to the database.
