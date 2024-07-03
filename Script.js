document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList');
    const studentIndex = document.getElementById('studentIndex');

    studentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const index = studentIndex.value;

        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long and contain at least one number and one special character.');
            return;
        }

        if (index === "") {
            addStudent(name, age, email, password);
        } else {
            updateStudent(index, name, age, email, password);
        }

        studentForm.reset();
        studentIndex.value = '';
    });

    function validatePassword(password) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
        return regex.test(password);
    }

    function addStudent(name, age, email, password) {
        const student = { name, age, email, password };
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
    }

    function updateStudent(index, name, age, email, password) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students[index] = { name, age, email, password };
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
    }

    function deleteStudent(index) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
    }

    function editStudent(index) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        const student = students[index];
        document.getElementById('name').value = student.name;
        document.getElementById('age').value = student.age;
        document.getElementById('email').value = student.email;
        document.getElementById('password').value = student.password;
        studentIndex.value = index;
    }

    function displayStudents() {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        studentList.innerHTML = '';
        students.forEach((student, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>Name: ${student.name}, Age: ${student.age}, Email: ${student.email}</span>
                            <button class="edit" onclick="editStudent(${index})">Edit</button>
                            <button onclick="deleteStudent(${index})">Delete</button>`;
            studentList.appendChild(li);
        });
    }

    window.editStudent = editStudent;
    window.deleteStudent = deleteStudent;

    displayStudents();
});
