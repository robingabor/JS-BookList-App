// Book Class : represent a book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//  UI Class : handle UI i.e : showing alert, remove, add book
class UI{
    // we dont watn to instantiate this class therefore lets create static methods
    static displayBooks(){
        
        const books = Store.getBooks();

        books.forEach((book)=> UI.addBookToList(book));

    }

    static addBookToList(book){

        const list = document.querySelector('.book-list');

        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete btn btn-danger btn-sm">X</a></td>
        `;

        list.appendChild(row);                
    }

    // delete books, we pass down the target element
    static deleteBook(element){
        // we going to looking if the element contains the 'delete' class
        if(element.classList.contains('delete')){
            // if so we want to delete the whole row, not only the td itself-> we have to remove its grandparent from the DOM
            element.parentElement.parentElement.remove();
        }
    }

    // Showing alerts with Bootsrap classes 
    static showAlert(message,className){
        // lets create a div first
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        // div.innerHTML = message;
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // lets insert the alert div before the form:
        container.insertBefore(div,form);
        // VANISH within 3 sec
        setTimeout(()=>{
            document.querySelector('.alert').remove();
        },2500);
    }


    // lets clear the form's input fields
    static clearFields(){
        document.querySelector("#title").value = '';
        document.querySelector("#author").value = '';
        document.querySelector("#isbn").value = '';

    }
    
}

// Strore Class : takes care of storage(in this case to localStorage)

class Store{
    static getBooks(){
        let books;
        // check if there is no item in books
        if(localStorage.getItem('books')=== null){
            books = [];
        }else{
            // lets parse it into a regular JS array of objects
            // because in localStorage it is stored as a string
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        // then we need to push on whatever is passed in as param
        books.push(book);
        // local storage is strings-> JSON.stringify
        localStorage.setItem('books',JSON.stringify(books));

    }

    static removeBooke(isbn){
        const books = Store.getBooks();

        // we want to remove the book wish has a corresponding isbn
        books.forEach((book,index)=>{
            if(book.isbn === isbn){
                // remove with splice
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));

    }
}

// Events : display books (show the books in the list)
// As soon as the DOM loads we want to call UI.addBookList()
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Events : Add a books ()
document.querySelector('#book-form').addEventListener('submit',(e)=>{
    // Prevent actual submit
    e.preventDefault();
    console.log('mukodik');
    // we need the submitted values, lets get them all
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validation of the values 
    if(title === '' || author === '' || isbn === ''){
        // alert("Please fill in all fileds");
        UI.showAlert("Please fill in all fileds","warning");
    }else{
        // lets instantiate the Book class with the valeus 
        const book = new Book(title,author,isbn);

        console.log(book);
        // Add Book To UI
        UI.addBookToList(book);
        // Add Book To localStorage
        Store.addBook(book);

        // Show succes message
        UI.showAlert("Book inserted sucessfully","success");

        // Lets clear the input fields
        UI.clearFields();
    }  

});

// Events : Remove a books ()

document.querySelector('.book-list').addEventListener('click', (e)=>{
    console.log(e.target);
    // delete book UI
    UI.deleteBook(e.target);
    // delete book from localStorage
    Store.removeBooke(e.target.parentElement.previousElementSibling.textContent);

    // Show succes message
    UI.showAlert("Book removed sucessfully","success");
});


