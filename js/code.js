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
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
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
	let srch = document.getElementById("searchName").value;
	document.getElementById("searchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Search.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchResult").innerHTML = "Contacts(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
	
}

// Changes a contact for a user.
function changeContact(num)
{
	console.log("successful function call");
	
	let info = document.getElementById(`ContactInfo${num}`);

	// Create a JSON object to send.
	newFirst = document.getElementById("editFirstName").value;
	newLast = document.getElementById("editLastName").value;
	newEmail = document.getElementById("editEmail").value;
	newPhone = document.getElementById("editPhone").value;
	contactId = info.getAttribute("contactid");
	
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
