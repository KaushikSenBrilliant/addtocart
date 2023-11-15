//importing a firebase fcn from the url which contains it
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = { //assigning this to an object
    databaseURL: "https://nice-project-3204c-default-rtdb.asia-southeast1.firebasedatabase.app/"
    //now we need to use some code which lives on Firebase's server
}

const app = initializeApp(appSettings) //appSetting contains the specific URL, this connects firebase with our project
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList") //ref is any location inside our DB, we name it shoppingList, so all the data we push will go inside of this ref
//we are importing ref, which is the shorform of reference,we are working with database DB so we call it and name the ref inside it

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list") //this JS method looks for this particular HTML element by this id then  it returns a reference to that element, we can then modify the incoming data

//Hey, browser, when someone clicks on the addButtonEl (which is the button), do the things inside the function I provided

addButtonEl.addEventListener("click", function() {
  const inputValue = inputFieldEl.value.trim();
  
  get(shoppingListInDB).then((snapshot) => {
    if (snapshot.val()) {
      let items = Object.values(snapshot.val());

      if (items.includes(inputValue)) {
          alert("Item is already present in the list");
          //console.log("Item present");
          clearInputFieldEl();
      } else {
          uniqueitem(inputValue);
      }
    } 
    else {
      uniqueitem(inputValue);
    }
  });
});

function uniqueitem(input)
{
  if(input) //take input when valid
  {
      push(shoppingListInDB, input);
      clearInputFieldEl();
      //console.log("Item added to list");
      // If snapshot.val() is null, push the new value to the database
  }
  else //when blank space is entered
  {
      alert("Please enter a valid input");
      //console.log("Enter valid input");
      clearInputFieldEl();
      // If the first value entered is blank when snapshot.val() doesnt even exists 
  }
} 


function clearInputFieldEl()
{
    inputFieldEl.value = ""; //clearing the input field after entering an item
}

function addItemToList(item)
{
    //shoppingListEl.innerHTML += `<li>${item}</li>`;
    //this function takes the shopping lis element, uses the the innerHTML to append the inputValue at the bottom
    //.innerHTML is a property of the HTML element that represents the content inside that element
    //using += operator we are adding something to the current content of the shopping list element
    //using template literals to insert dynamic values in a string

    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li") //we want to create li element
    newEl.textContent = itemValue //putting some text content inside it

    newEl.addEventListener("click",function(){
        let exactLocationOfItemInDB = ref(database,`shoppingList/${itemID}`) //going to the exact location in DB
        //console.log(exactLocationOfItemInDB)
        remove(exactLocationOfItemInDB) //importing remove fcn and using it to remove the item
    })
    shoppingListEl.append(newEl) //placing it inside our parent element shoppingListEl
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

onValue(shoppingListInDB,function(snapshot){ //onValue function gives us the snapshot everytime the database updates
    //snapshot is an object that represents a specific point in the database, It captures the data in your database at that exact instant
    
    if(snapshot.exists()) //if atleast one element exits in the DB we perform the following
    {
        let itemsArray = Object.entries(snapshot.val()) //itemsArray stores the key:value pairs inside the array

        clearShoppingListEl();
        //shoppingListEl.innerHTML = ""; //this clears the content of the shopping list on your web page, it clears the shopping list so that we can then populate it with latest data
        //ensuring that the displayed content matches the data you fetch from the database
        //console.log(itemsArray) this prints the whole array with all the elements inside it

        for(let i = 0; i < itemsArray.length; i++)
        {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0] //the IDs/keys
            let currentItemValue = currentItem[1] //the values it is storing
            
            addItemToList(currentItem)
            //console.log(itemsArray[i]) this prints the array elements one by one, doesnt print in an array format that is horizontally
        }
    }

    else //then we change the list using innerHTML
    {
        shoppingListEl.innerHTML = "No items...yet"
    }
    
})