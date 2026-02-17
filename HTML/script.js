let students = JSON.parse(localStorage.getItem("students")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

function addStudent() {
    const roll = document.getElementById("rollNumber").value.trim();
    const name = document.getElementById("studentName").value.trim();

    if (roll === "" || name === "") {
        alert("Please enter roll number and student name");
        return;
    }

    // Prevent duplicate roll numbers
    if (students.some(s => s.roll === roll)) {
        alert("Roll number already exists!");
        return;
    }

    students.push({ roll, name });
    localStorage.setItem("students", JSON.stringify(students));

    document.getElementById("rollNumber").value = "";
    document.getElementById("studentName").value = "";

    loadStudents();
}

function loadStudents() {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach((student, index) => {
        table.innerHTML += `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>
                    <select id="status-${index}">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

function saveAttendance() {
    const date = document.getElementById("attendanceDate").value;

    if (!date) {
        alert("Please select a date");
        return;
    }

    attendance[date] = students.map((student, index) => {
        return {
            roll: student.roll,
            name: student.name,
            status: document.getElementById(`status-${index}`).value
        };
    });

    localStorage.setItem("attendance", JSON.stringify(attendance));
    showSummary();
}

function showSummary() {
    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = "";

    for (let date in attendance) {
        let present = attendance[date].filter(s => s.status === "Present").length;
        let absent = attendance[date].length - present;

        summaryDiv.innerHTML += `
            <p><strong>${date}</strong> → Present: ${present}, Absent: ${absent}</p>
        `;
    }
}

function clearData() {
    if (confirm("Are you sure you want to clear all data?")) {
        localStorage.clear();
        students = [];
        attendance = {};
        loadStudents();
        showSummary();
    }
}

// Initial Load
loadStudents();
showSummary();

