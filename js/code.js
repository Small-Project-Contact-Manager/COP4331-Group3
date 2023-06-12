const urlBase = 'http://contactmanag3r.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

/*related to the login/register toggle*/
function clickLogin()
{
	var login = document.getElementById('login');
	var register = document.getElementById('register');
	var btn = document.getElementById('button');
	
	login.style.left="50px";
	register.style.left="450px";
	btn.style.left="0px";
}

function clickRegister()
{
	var login = document.getElementById('login');
	var register = document.getElementById('register');
	var btn = document.getElementById('button');
	
	register.style.left="50px";
	login.style.left="-400px";
	btn.style.left="110px";
}

/*related to modal pop up for adding contacts */
function clickAdd()
{
	// Get the modal
	var modal = document.getElementById('addContactModal');

	modal.style.display="block"
		
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) 
	{
		if (event.target == modal) 
		{
			modal.style.display = "none";
		}
	}
}

/*related to modal pop up for modifying contacts */
function clickEdit(num)
{
	// Set the form values before the modal opens.
	let info = document.getElementById(`ContactInfo${num}`);
	
	document.getElementById("editFirstName").value = info.getAttribute("fname");
	document.getElementById("editLastName").value = info.getAttribute("lname");
	document.getElementById("editEmail").value = info.getAttribute("contactemail");
	document.getElementById("editPhone").value = info.getAttribute("contactphone");
	document.getElementById("editContactResult").innerHTML = "";
	
	// Get the modal
	var modal = document.getElementById('editContactModal');

	modal.style.display="block"
	
	document.getElementById('yesEdit').onclick = function()
	{
		changeContact(num);
	}
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) 
	{
		if (event.target == modal) 
		{
			modal.style.display = "none";
		}
	}
}

/*related to modal pop up for confirming delete contacts */
function clickDelete(num)
{
	// Get the modal
	var modal = document.getElementById('deleteContactModal');

	modal.style.display="block"

	// if user clicks on delete will delete
	document.getElementById('yesDelete').onclick = function() 
	{

		deleteContact(num);
	}
		
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) 
	{
		if (event.target == modal) 
		{
			modal.style.display = "none";
		}
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				
				/* changed to contacts.html */
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// Function to register for the contact manager.
function doRegister()
{
	let firstname = document.getElementById("firstName").value;
	let lastname = document.getElementById("lastName").value;
	
	let login = document.getElementById("regName").value;
	let password = document.getElementById("regPassword").value;
//	var hash = md5( password );
	
	if (!validSignUpForm(firstname, lastname, login, password)) {
		document.getElementById("registerResult").innerHTML = "Invalid signup!";
		return;
	}
	
	document.getElementById("registerResult").innerHTML = "";

	let tmp = 
	{
		firstName:firstname,
		lastName:lastname,
		login:login,
		password:password
	};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("registerResult").innerHTML = "Login is taken";
					return;
				}
		
				firstName = firstname;
				lastName = lastname;

				saveCookie();
	
				/* changed to contacts.html */
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Adds a contact for the current user.
function addContact()
{
	let firstName = document.getElementById("addFirstName").value;
	let lastName = document.getElementById("addLastName").value;
	let phone = document.getElementById("addPhone").value;
	let email = document.getElementById("addEmail").value;
	document.getElementById("addContactResult").innerHTML = "";
	

	if (!validAddContact(firstName, lastName, phone, email)) {
        console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
		//alert("Invalid contact information!");
        return;
	}

	document.getElementById('addContactModal').style.display='none';

	let tmp = 
	{
		firstName:firstName,
		lastName:lastName,
		phoneNumber:phone,
		emailAddress:email,
		userId:userId
	};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// After adding a contact, reset the form input.
				document.getElementById("addFirstName").value = "";
				document.getElementById("addLastName").value = "";
				document.getElementById("addEmail").value = "";
				document.getElementById("addPhone").value = "";
				showContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
	
}
/* renamed to searchContact */
function searchContact()
{
	let input = document.getElementById("searchName");
	let filter = input.value.toUpperCase();
	let table = document.getElementById("contactsTable");
	let tr = table.getElementsByTagName("tr");
  
	// Loop through all table rows, and hide those who don't match the search query
	for (let i = 0; i < tr.length; i++) 
	{
	  let tdFirst = tr[i].getElementsByTagName("td")[0]; // first name
	  let tdLast = tr[i].getElementsByTagName("td")[1]; // last name
	  let tdMail = tr[i].getElementsByTagName("td")[2]; // email
	  let tdPhone = tr[i].getElementsByTagName("td")[3]; // phone

	  if (tdFirst || tdLast || tdMail || tdPhone) 
	  {
			let txtValueFirst = tdFirst.textContent || tdFirst.innerText;
			let txtValueLast = tdLast.textContent || tdLast.innerText;
			let txtValueMail = tdMail.textContent || tdMail.innerText;
			let txtValuePhone = tdPhone.textContent || tdPhone.innerText;

			tr[i].style.display = "none";
			
			if (txtValueFirst.toUpperCase().indexOf(filter) > -1) 
			{
				tr[i].style.display = "";
			}
			if (txtValueLast.toUpperCase().indexOf(filter) > -1)
			{
				tr[i].style.display = "";
			}
			if (txtValueMail.toUpperCase().indexOf(filter) > -1)
			{
				tr[i].style.display = "";
			}
			if (txtValuePhone.toUpperCase().indexOf(filter) > -1)
			{
				tr[i].style.display = "";
			}
	  }
	}
	
}

// Changes a contact for a user.
function changeContact(num)
{
	let info = document.getElementById(`ContactInfo${num}`);

	// Create a JSON object to send.
	newFirst = document.getElementById("editFirstName").value;
	newLast = document.getElementById("editLastName").value;
	newEmail = document.getElementById("editEmail").value;
	newPhone = document.getElementById("editPhone").value;
	contactId = info.getAttribute("contactid");
	
	if (!validEditContact(newFirst, newLast, newPhone, newEmail)) {
        console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
		//alert("Invalid contact information!");
        return;
	}

	document.getElementById('editContactModal').style.display='none';
	
	let tmp =
	{
		newFirstName:newFirst,
		newLastName:newLast,
		newEmailAddr:newEmail,
		newPhoneNum:newPhone,
		id:contactId
	};
	
	let jsonPayload = JSON.stringify(tmp);
	
	// Open and POST to the edit API.
	let url = urlBase + '/UpdateContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	// Edit the contact or return an error.
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// Reload the contact table after editing.
				showContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// Could add error message here.
	}
}

// Deletes a contact for a user.
function deleteContact(num)
{
	let info = document.getElementById(`ContactInfo${num}`);
	document.getElementById('deleteContactModal').style.display='none';
	
	// Create a JSON object to send.
	fName = info.getAttribute("fname");
	lName = info.getAttribute("lname");
	contactId = info.getAttribute("contactid");
	
	let tmp =
	{
		firstName:fName,
		lastName:lName,
		userId:userId,
		id:contactId
	};
	
	let jsonPayload = JSON.stringify(tmp);
	
	// Open and POST to the delete API.
	let url = urlBase + '/DeleteContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	// Delete from the database or return an error.
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				showContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// Could add error message here.
	}
}

// Shows all contacts that a user currently has.
function showContacts()
{
	// Create a JSON object to send.
	let tmp = {userId:userId,search:""};
	let jsonPayload = JSON.stringify(tmp);
	
	// Open and POST to the API to get all contacts.
	let url = urlBase + '/Search.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	let contactTable = "";
	
	// Generate a table or catch an error.
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				// Check if no results exist.
				if (!jsonObject.hasOwnProperty("results"))
				{
					document.getElementById("tBody").innerHTML = "";
					return;
				}
				
				// Loop to format information as HTML.
				for (let i = 0; i < jsonObject.results.length; i++)
				{
					// Format contact information into the table.
					contactTable +=
					`
					<span id="ContactInfo${i}"
					fname="${jsonObject.results[i].FirstName}"
					lname="${jsonObject.results[i].LastName}"
					contactid="${jsonObject.results[i].ID}"
					contactemail="${jsonObject.results[i].Email}"
					contactphone="${jsonObject.results[i].Phone}"
					></span>
					
					<tr>
						<td> ${jsonObject.results[i].FirstName} </td>
						<td> ${jsonObject.results[i].LastName} </td>
						<td> ${jsonObject.results[i].Email} </td>
						<td> ${jsonObject.results[i].Phone} </td>
						<td> <button type="button" onclick="clickEdit(${i});" class="contactsButton"><i class="material-icons">edit_note</i></button>
						<button type="button" onclick="clickDelete(${i});" class="contactsButton"><i class="material-icons">delete</i></button> </td>
					</tr>
					`;
				}
				
				// Transforms this element in HTML document into a contact table.
				document.getElementById("tBody").innerHTML = contactTable;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// Note: Might want to add a line here:
		// document.getElementById("showContactsResult").innerHTML = err.message;
	}
}

// validate contact function for the contacts page
function validAddContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
		document.getElementById("addContactResult").innerHTML = "First Name Cannot Be Blank!";
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
		document.getElementById("addContactResult").innerHTML = "Last Name Cannot Be Blank!";
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
		document.getElementById("addContactResult").innerHTML = "Phone Cannot Be Blank!";
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
			document.getElementById("addContactResult").innerHTML = "Phone Should Be (###)-###-####, () and - are optional";
        }

        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
		document.getElementById("addContactResult").innerHTML = "Email Cannot Be Blank";
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
			document.getElementById("addContactResult").innerHTML = "Email should be example@mail.com!";
        }

        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

	if (firstName == "" &&  lastName == "" && phone == "" &&  email== "") {
        document.getElementById("addContactResult").innerHTML = "All fields must be filled out!";

    }

    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
        return false;

    }

    return true;

}

// Validation for editing a contact.
function validEditContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
		document.getElementById("editContactResult").innerHTML = "First Name Cannot Be Blank!";
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
		document.getElementById("editContactResult").innerHTML = "Last Name Cannot Be Blank!";
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
		document.getElementById("editContactResult").innerHTML = "Phone Cannot Be Blank!";
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
			document.getElementById("editContactResult").innerHTML = "Phone Should Be (###)-###-####, () and - are optional";
        }

        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
		document.getElementById("editContactResult").innerHTML = "Email Cannot Be Blank";
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
			document.getElementById("editContactResult").innerHTML = "Email should be example@mail.com!";
        }

        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

	if (firstName == "" &&  lastName == "" && phone == "" &&  email== "") {
        document.getElementById("editContactResult").innerHTML = "All fields must be filled out!";

    }

    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
        return false;

    }

    return true;

}

// Validation for register.
function validSignUpForm(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[a-zA-Z\d]{8,16}$/;

        if (regex.test(user) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            userErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}
