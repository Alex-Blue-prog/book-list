// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
let ready = true; 

//UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book)=> UI.addBookToList(book));

    }
    // ADD BOOK TO LIST func
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete"> X </a> </td>

        `;

        list.appendChild(row);
    }

    // // CLEAR FIELDS func
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }


    // Remove a Book
    static deleteBook(el) {
        if(el.classList.contains('delete')){
            el.parentNode.parentElement.remove();
        }
    }

    // ALERT
    static showAlert(message, className) {
    
        if(ready) {
            ready = false;

            const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            const container = document.querySelector('.container');
            const form = document.querySelector('#book-form');
            container.insertBefore(div, form);

            //vanish in 3 seconds
            setTimeout(()=> {
                div.remove();
                ready = true;
            }, 3000)

            
        }
        
    }

}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));

        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn == isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=> {

    e.preventDefault();

    // GET FORM VALUES
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // VALIDATE
    if(title === '' || author === '' || isbn === '') {
        // FAILED ALERT
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // INSTATIATE BOOK
        const book = new Book(title, author, isbn);
        
        // ADD BOOK TO LIST
        UI.addBookToList(book);
        // ADD BOOK TO STORAGE
        Store.addBook(book);

        // CLEAR FIELDS
        UI.clearFields();

        // SUCCESS ALERT
        UI.showAlert('Book added', 'success');
    }

    

})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //DEL FROM UI
    UI.deleteBook(e.target);
    // DEL FROM THE STORAGE
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // DEL ALERT
    UI.showAlert('Book deleted', 'info');
});
